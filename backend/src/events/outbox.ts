import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { EventPayloads, EventType } from "./event-types.js";

export type Tx = Prisma.TransactionClient;

/**
 * Records an event in the outbox. Call it inside the same transaction as the change the event
 * describes: either both are saved or neither is. The relay publishes it to the queue afterwards.
 */
export async function enqueueEvent<T extends EventType>(tx: Tx, type: T, payload: EventPayloads[T]): Promise<void> {
  await tx.outboxEvent.create({
    data: { type, payload: payload as unknown as Prisma.InputJsonValue },
  });
}

/**
 * Runs database work exactly once per (event, handler), even if the event is delivered twice.
 * The idempotency marker is written in the same transaction as the work.
 * Returns false when this event was already handled.
 */
export async function runOnce(eventId: string, handler: string, work: (tx: Tx) => Promise<void>): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.processedEvent.createMany({
      data: [{ eventId, handler }],
      skipDuplicates: true,
    });
    if (count === 0) return false;
    await work(tx);
    return true;
  });
}

/**
 * For handlers with outside side effects (sending email, calling the payment gateway) that can't
 * join a database transaction: skips already-handled events and marks the event handled only
 * after the side effect succeeds. A crash in between can repeat the side effect (at-least-once).
 */
export async function runOnceWithSideEffect(eventId: string, handler: string, work: () => Promise<void>): Promise<boolean> {
  const done = await prisma.processedEvent.findUnique({ where: { eventId_handler: { eventId, handler } } });
  if (done) return false;
  await work();
  await prisma.processedEvent.createMany({ data: [{ eventId, handler }], skipDuplicates: true });
  return true;
}
