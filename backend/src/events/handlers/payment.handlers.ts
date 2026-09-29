import { EventEnvelope } from "../event-types.js";
import { runOnceWithSideEffect } from "../outbox.js";
import { prisma } from "../../config/database.js";
import { paymentService } from "../../services/payment.service.js";

/** OrderCancelled -> refund if the customer had already paid. */
export async function refundOnCancel(event: EventEnvelope<"OrderCancelled">): Promise<void> {
  await runOnceWithSideEffect(event.eventId, "payment.refund-on-cancel", () =>
    paymentService.refundOrderPayment(event.payload.orderId)
  );
}

/** PaymentSucceeded -> if the order was cancelled first (e.g. timed out), the money goes back. */
export async function refundIfOrderCancelled(event: EventEnvelope<"PaymentSucceeded">): Promise<void> {
  await runOnceWithSideEffect(event.eventId, "payment.refund-if-cancelled", async () => {
    const order = await prisma.order.findUnique({ where: { id: event.payload.orderId }, select: { status: true } });
    if (order?.status === "cancelled") await paymentService.refundOrderPayment(event.payload.orderId);
  });
}
