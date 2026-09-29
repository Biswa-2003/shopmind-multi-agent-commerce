import { EventEnvelope } from "../event-types.js";
import { enqueueEvent, runOnce } from "../outbox.js";
import { logger } from "../../utils/logger.js";

class InsufficientStockError extends Error {
  constructor(public readonly productIds: string[]) {
    super(`Insufficient stock for ${productIds.join(", ")}`);
  }
}

/** OrderCreated -> take the ordered units out of stock, all or nothing. */
export async function reserveStock(event: EventEnvelope<"OrderCreated">): Promise<void> {
  const { orderId, items, paymentMethod } = event.payload;
  try {
    await runOnce(event.eventId, "inventory.reserve", async (tx) => {
      // Lock the order row so a cancellation can't slip in between our check and our reservation
      const [order] = await tx.$queryRaw<{ status: string }[]>`SELECT status FROM orders WHERE id = ${orderId} FOR UPDATE`;
      if (!order || order.status === "cancelled") return;

      const short: string[] = [];
      for (const item of items) {
        // Atomic check-and-decrement: never goes below zero, even with concurrent orders
        const { count } = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (count === 0) short.push(item.productId);
      }
      if (short.length > 0) throw new InsufficientStockError(short); // rolls back every decrement

      await tx.stockReservation.createMany({
        data: items.map((i) => ({
          orderId,
          productId: i.productId,
          quantity: i.quantity,
          // Cash on delivery is a firm sale now; online orders hold stock until paid
          status: paymentMethod === "cod" ? "committed" : "reserved",
        })),
      });
      await tx.product.updateMany({
        where: { id: { in: items.map((i) => i.productId) }, stock: { lte: 0 } },
        data: { availability: "out-of-stock" },
      });
    });
  } catch (err) {
    if (!(err instanceof InsufficientStockError)) throw err;
    logger.warn(`[Inventory] Order ${orderId}: ${err.message}`);
    await runOnce(event.eventId, "inventory.reserve", async (tx) => {
      await enqueueEvent(tx, "StockReservationFailed", { orderId, productIds: err.productIds });
    });
  }
}

/** PaymentSucceeded -> the held units are now sold. */
export async function commitStock(event: EventEnvelope<"PaymentSucceeded">): Promise<void> {
  await runOnce(event.eventId, "inventory.commit", async (tx) => {
    await tx.stockReservation.updateMany({
      where: { orderId: event.payload.orderId, status: "reserved" },
      data: { status: "committed" },
    });
  });
}

/** OrderCancelled -> put the units back on sale. */
export async function releaseStock(event: EventEnvelope<"OrderCancelled">): Promise<void> {
  await runOnce(event.eventId, "inventory.release", async (tx) => {
    const reservations = await tx.stockReservation.findMany({
      where: { orderId: event.payload.orderId, status: { in: ["reserved", "committed"] } },
    });
    for (const r of reservations) {
      await tx.product.update({
        where: { id: r.productId },
        data: { stock: { increment: r.quantity }, availability: "in-stock" },
      });
    }
    await tx.stockReservation.updateMany({
      where: { id: { in: reservations.map((r) => r.id) } },
      data: { status: "released" },
    });
  });
}
