import { EventEnvelope } from "../event-types.js";
import { runOnceWithSideEffect } from "../outbox.js";
import { prisma } from "../../config/database.js";
import { emailService } from "../../services/email.service.js";

/** OrderCreated (cash on delivery) -> confirmation email. Online orders get a receipt once paid. */
export async function sendOrderConfirmation(event: EventEnvelope<"OrderCreated">): Promise<void> {
  if (event.payload.paymentMethod !== "cod") return;
  await runOnceWithSideEffect(event.eventId, "email.order-confirmation", () =>
    emailService.sendOrderConfirmation(event.payload.orderId)
  );
}

/** PaymentSucceeded -> payment receipt (unless the order was cancelled; that email covers the refund). */
export async function sendPaymentReceipt(event: EventEnvelope<"PaymentSucceeded">): Promise<void> {
  await runOnceWithSideEffect(event.eventId, "email.payment-receipt", async () => {
    const order = await prisma.order.findUnique({ where: { id: event.payload.orderId }, select: { status: true } });
    if (order?.status !== "cancelled") await emailService.sendPaymentReceipt(event.payload.orderId);
  });
}

/** OrderCancelled -> cancellation email. */
export async function sendCancellation(event: EventEnvelope<"OrderCancelled">): Promise<void> {
  await runOnceWithSideEffect(event.eventId, "email.cancellation", () =>
    emailService.sendCancellation(event.payload.orderId)
  );
}
