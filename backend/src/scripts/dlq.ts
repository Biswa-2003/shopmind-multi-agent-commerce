/**
 * Dead letter queue tool.
 *   npm run dlq --workspace=backend                 list events waiting for attention
 *   npm run dlq --workspace=backend -- replay <id>  send one back to its handler
 *   npm run dlq --workspace=backend -- replay all   send all of them back
 * Fix the underlying problem first (e.g. email provider down), then replay.
 */
import { prisma } from "../config/database.js";
import { eventBus } from "../events/event-bus.js";

async function main() {
  const [command, target] = process.argv.slice(2);
  const pending = await prisma.deadLetterEvent.findMany({ where: { replayedAt: null }, orderBy: { failedAt: "asc" } });

  if (!command || command === "list") {
    if (pending.length === 0) {
      console.log("Dead letter queue is empty.");
      return;
    }
    console.log(`${pending.length} event(s) in the dead letter queue:\n`);
    for (const d of pending) {
      console.log(`${d.id}\n  ${d.failedAt.toISOString()}  ${d.queue}  ${d.eventType} (event ${d.eventId})`);
      console.log(`  attempts: ${d.attempts}  error: ${d.error ?? "unknown"}\n`);
    }
    return;
  }

  if (command === "replay") {
    if (!target) throw new Error('Usage: dlq replay <id> | dlq replay all');
    const ids = target === "all" ? pending.map((d) => d.id) : [target];
    await eventBus.start({ workers: false });
    try {
      for (const id of ids) {
        await eventBus.replayDeadLetter(id);
        console.log(`Replayed ${id}`);
      }
      console.log(ids.length ? `\n${ids.length} event(s) sent back to their queues. The running server will process them.` : "Nothing to replay.");
    } finally {
      await eventBus.stop();
    }
    return;
  }

  throw new Error(`Unknown command "${command}". Use: list | replay <id> | replay all`);
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
