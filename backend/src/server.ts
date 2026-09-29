import app from "./app.js";
import { ENV } from "./config/env.js";
import { closeDatabase, initDatabase } from "./config/database.js";
import { eventBus } from "./events/event-bus.js";
import { paymentService } from "./services/payment.service.js";
import { logger } from "./utils/logger.js";

async function start() {
  await initDatabase();
  // Workers can run in a separate process by setting RUN_WORKERS=false here and true there
  await eventBus.start({ workers: ENV.RUN_WORKERS });

  const { gateway } = paymentService.getConfig();
  logger.info(`[Payments] Online payment gateway: ${gateway ?? "none (cash on delivery only)"}`);

  const server = app.listen(ENV.PORT, () => {
    logger.info(`[ShopMind AI Backend] Running on http://localhost:${ENV.PORT}`);
    logger.info(`[ShopMind AI Backend] Environment: ${ENV.NODE_ENV}`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down...`);
    server.close(() => {
      eventBus
        .stop()
        .catch(() => undefined)
        .finally(() => closeDatabase().finally(() => process.exit(0)));
    });
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});
