import { PgBoss, type JobWithMetadata } from "pg-boss";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { EventEnvelope, EventType } from "./event-types.js";
import { commitStock, releaseStock, reserveStock } from "./handlers/inventory.handlers.js";
import { refundIfOrderCancelled, refundOnCancel } from "./handlers/payment.handlers.js";
import { sendCancellation, sendOrderConfirmation, sendPaymentReceipt } from "./handlers/email.handlers.js";
import { cancelOnStockFailure } from "./handlers/order.handlers.js";
import { orderService } from "../services/order.service.js";

type Handler = (event: EventEnvelope<any>) => Promise<void>;

/**
 * Who reacts to which event. Each handler gets its own queue, so each retries and dead-letters
 * independently: a failing email never blocks stock reservation.
 */
const SUBSCRIPTIONS: Record<EventType, { queue: string; handle: Handler }[]> = {
  OrderCreated: [
    { queue: "inventory.reserve-stock", handle: reserveStock },
    { queue: "email.order-confirmation", handle: sendOrderConfirmation },
  ],
  PaymentSucceeded: [
    { queue: "inventory.commit-stock", handle: commitStock },
    { queue: "email.payment-receipt", handle: sendPaymentReceipt },
    { queue: "payment.refund-if-cancelled", handle: refundIfOrderCancelled },
  ],
  PaymentFailed: [], // recorded for auditing; the customer can retry until the payment timeout
  StockReservationFailed: [{ queue: "order.cancel-on-stock-failure", handle: cancelOnStockFailure }],
  OrderCancelled: [
    { queue: "inventory.release-stock", handle: releaseStock },
    { queue: "payment.refund-on-cancel", handle: refundOnCancel },
    { queue: "email.cancellation", handle: sendCancellation },
  ],
};

export const DEAD_LETTER_QUEUE = "dead-letter";
const RELAY_INTERVAL_MS = 500;
const RELAY_BATCH = 50;
const EXPIRY_SWEEP_MS = 60_000;

/** pg-boss uses its own "pgboss" schema; drop Prisma's ?schema= parameter from the URL. */
function connectionString(): string {
  const url = new URL(ENV.DATABASE_URL);
  url.searchParams.delete("schema");
  return url.toString();
}

class EventBus {
  private boss: PgBoss | null = null;
  private timers: NodeJS.Timeout[] = [];
  private stopping = false;
  private relaying = false;

  /** Connects to the queue. With workers, also starts handlers, the outbox relay and the expiry sweep. */
  async start({ workers }: { workers: boolean }): Promise<void> {
    const boss = new PgBoss({ connectionString: connectionString(), schema: "pgboss" });
    boss.on("error", (err) => logger.error("[EventBus] pg-boss error:", err));
    await boss.start();
    this.boss = boss;

    await this.ensureQueue(DEAD_LETTER_QUEUE, {});
    for (const handlers of Object.values(SUBSCRIPTIONS)) {
      for (const { queue } of handlers) {
        await this.ensureQueue(queue, {
          retryLimit: ENV.EVENT_RETRY_LIMIT,
          retryDelay: ENV.EVENT_RETRY_DELAY_SECONDS,
          retryBackoff: true, // 5s, 10s, 20s, 40s... with jitter
          retryDelayMax: 600,
          expireInSeconds: 120,
          deadLetter: DEAD_LETTER_QUEUE,
        });
      }
    }

    if (!workers) return;

    for (const handlers of Object.values(SUBSCRIPTIONS)) {
      for (const { queue, handle } of handlers) {
        await boss.work<EventEnvelope>(queue, { pollingIntervalSeconds: 0.5 }, async ([job]) => {
          try {
            await handle(job.data);
          } catch (err) {
            logger.warn(
              `[EventBus] ${queue} failed for ${job.data.type} ${job.data.eventId} (attempt ${job.retryCount + 1}/${ENV.EVENT_RETRY_LIMIT + 1}): ${(err as Error).message}`
            );
            throw err; // pg-boss schedules the retry, or dead-letters after the last one
          }
        });
      }
    }

    await boss.work<EventEnvelope>(DEAD_LETTER_QUEUE, { includeMetadata: true, pollingIntervalSeconds: 1 }, async ([job]) =>
      this.recordDeadLetter(job as JobWithMetadata<EventEnvelope>)
    );

    this.loop(() => this.relayOutbox().then(() => undefined), RELAY_INTERVAL_MS);
    this.loop(() => orderService.expireUnpaidOrders().then(() => undefined), EXPIRY_SWEEP_MS);
    logger.info("[EventBus] Workers, outbox relay and payment-timeout sweep started");
  }

  async stop(): Promise<void> {
    this.stopping = true;
    this.timers.forEach(clearTimeout);
    await this.boss?.stop({ graceful: true, timeout: 10_000 });
    this.boss = null;
  }

  private async ensureQueue(name: string, options: Parameters<PgBoss["createQueue"]>[1]): Promise<void> {
    const boss = this.requireBoss();
    if (!(await boss.getQueue(name))) {
      await boss.createQueue(name, options);
    } else if (options && Object.keys(options).length > 0) {
      // Apply changed retry settings on restart (pg-boss rejects an empty update)
      await boss.updateQueue(name, options);
    }
  }

  /** Runs `task` repeatedly with `ms` between runs (never overlapping); errors are logged, not fatal. */
  private loop(task: () => Promise<void>, ms: number): void {
    const tick = async () => {
      if (this.stopping) return;
      try {
        await task();
      } catch (err) {
        logger.error("[EventBus] Background task failed:", (err as Error).message);
      }
      if (!this.stopping) this.timers.push(setTimeout(tick, ms));
    };
    this.timers.push(setTimeout(tick, ms));
  }

  /**
   * Outbox relay: publishes saved-but-unpublished events to every subscribed queue.
   * Delivery is at-least-once (a crash after sending but before marking re-sends); handlers are idempotent.
   */
  async relayOutbox(): Promise<number> {
    if (this.relaying) return 0;
    this.relaying = true;
    try {
      const boss = this.requireBoss();
      return await prisma.$transaction(
        async (tx) => {
          // SKIP LOCKED lets several server instances relay in parallel without double-publishing
          const rows = await tx.$queryRaw<{ id: string; type: EventType; payload: unknown; createdAt: Date }[]>`
            SELECT id, type, payload, "createdAt" FROM outbox_events
            WHERE "publishedAt" IS NULL ORDER BY "createdAt" LIMIT ${RELAY_BATCH}
            FOR UPDATE SKIP LOCKED`;
          for (const row of rows) {
            const envelope: EventEnvelope = {
              eventId: row.id,
              type: row.type,
              payload: row.payload as EventEnvelope["payload"],
              occurredAt: row.createdAt.toISOString(),
            };
            for (const { queue } of SUBSCRIPTIONS[row.type] ?? []) {
              await boss.send(queue, envelope);
            }
            await tx.outboxEvent.update({ where: { id: row.id }, data: { publishedAt: new Date() } });
            logger.debug(`[EventBus] Published ${row.type} ${row.id} -> ${(SUBSCRIPTIONS[row.type] ?? []).map((s) => s.queue).join(", ") || "(no subscribers)"}`);
          }
          return rows.length;
        },
        { timeout: 30_000 }
      );
    } finally {
      this.relaying = false;
    }
  }

  /** A job ran out of retries: keep it, with its last error, for inspection and replay. */
  private async recordDeadLetter(job: JobWithMetadata<EventEnvelope>): Promise<void> {
    const boss = this.requireBoss();
    const queue = job.sourceName ?? "unknown";
    let error: string | null = null;
    let attempts = 0;
    if (job.sourceName && job.sourceId) {
      const original = await boss.getJobById(job.sourceName, job.sourceId);
      if (original) {
        const output = original.output as { message?: string } | null;
        error = output?.message ?? (output ? JSON.stringify(output) : null);
        attempts = original.retryCount + 1;
      }
    }
    await prisma.deadLetterEvent.create({
      data: {
        queue,
        eventId: job.data.eventId,
        eventType: job.data.type,
        payload: job.data as unknown as Prisma.InputJsonValue,
        error: error?.slice(0, 2000) ?? null,
        attempts,
      },
    });
    logger.error(`[EventBus] DEAD LETTER: ${queue} gave up on ${job.data.type} ${job.data.eventId} after ${attempts} attempt(s): ${error}`);
  }

  /** Sends a dead-lettered event back to its original queue. */
  async replayDeadLetter(id: string): Promise<void> {
    const boss = this.requireBoss();
    const dead = await prisma.deadLetterEvent.findUnique({ where: { id } });
    if (!dead) throw new Error(`Dead letter ${id} not found`);
    if (dead.replayedAt) throw new Error(`Dead letter ${id} was already replayed at ${dead.replayedAt.toISOString()}`);
    await boss.send(dead.queue, dead.payload as object);
    await prisma.deadLetterEvent.update({ where: { id }, data: { replayedAt: new Date() } });
  }

  private requireBoss(): PgBoss {
    if (!this.boss) throw new Error("Event bus is not started");
    return this.boss;
  }
}

export const eventBus = new EventBus();
