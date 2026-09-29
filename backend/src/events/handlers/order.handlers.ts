import { EventEnvelope } from "../event-types.js";
import { runOnce } from "../outbox.js";
import { orderService } from "../../services/order.service.js";

/** StockReservationFailed -> cancel the order (compensation; triggers refund + email via OrderCancelled). */
export async function cancelOnStockFailure(event: EventEnvelope<"StockReservationFailed">): Promise<void> {
  await runOnce(event.eventId, "order.cancel-on-stock-failure", async (tx) => {
    await orderService.cancelOrder(event.payload.orderId, "out_of_stock", tx);
  });
}
