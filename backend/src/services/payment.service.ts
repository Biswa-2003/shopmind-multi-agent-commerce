import { randomBytes } from "node:crypto";
import { prisma } from "../config/database.js";
import { HttpError } from "../utils/http-error.js";
import { logger } from "../utils/logger.js";
import { enqueueEvent } from "../events/outbox.js";
import { paymentGateway, verifyWebhookSignature } from "./payment-gateway.js";
import { orderService, OrderView } from "./order.service.js";

const toPaise = (rupees: number) => Math.round(rupees * 100);

export interface PaymentSession {
  gateway: "razorpay" | "mock";
  keyId: string | null;
  orderId: string;
  gatewayOrderId: string;
  amountPaise: number;
  currency: string;
  prefill: { name: string; email: string };
}

export class PaymentService {
  getConfig(): { gateway: "razorpay" | "mock" | null; keyId: string | null } {
    return { gateway: paymentGateway?.name ?? null, keyId: paymentGateway?.publicKey ?? null };
  }

  /** Starts (or resumes) online payment for the user's unpaid order. */
  async initiate(userId: string, orderId: string): Promise<PaymentSession> {
    if (!paymentGateway) throw new HttpError(503, "Online payment isn't available right now. Please choose Cash on Delivery.");

    const order = await prisma.order.findFirst({ where: { id: orderId, userId }, include: { user: true } });
    if (!order) throw new HttpError(404, "Order not found");
    if (order.paymentMethod !== "online") throw new HttpError(400, "This order is Cash on Delivery");
    if (order.status !== "pending_payment") {
      throw new HttpError(409, order.status === "cancelled" ? "This order was cancelled" : "This order is already paid");
    }

    // Reuse the gateway order so retries after a failed or abandoned attempt don't create duplicates
    let payment = await prisma.payment.findFirst({
      where: { orderId, gateway: paymentGateway.name, status: { in: ["created", "failed"] } },
      orderBy: { createdAt: "desc" },
    });
    if (!payment) {
      const gatewayOrder = await paymentGateway.createOrder(toPaise(Number(order.totalAmount)), order.id.slice(0, 40));
      payment = await prisma.payment.create({
        data: {
          orderId,
          gateway: paymentGateway.name,
          gatewayOrderId: gatewayOrder.id,
          amount: order.totalAmount,
        },
      });
    }

    return {
      gateway: paymentGateway.name,
      keyId: paymentGateway.publicKey,
      orderId,
      gatewayOrderId: payment.gatewayOrderId,
      amountPaise: toPaise(Number(payment.amount)),
      currency: payment.currency,
      prefill: { name: order.user.name, email: order.user.email },
    };
  }

  /** Called by the browser after the Razorpay popup reports success. Trusts only the signature. */
  async verifyCheckout(
    userId: string,
    input: { orderId: string; razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }
  ): Promise<OrderView> {
    if (paymentGateway?.name !== "razorpay") throw new HttpError(400, "Razorpay is not the active payment gateway");

    const payment = await prisma.payment.findUnique({
      where: { gatewayOrderId: input.razorpayOrderId },
      include: { order: { select: { userId: true } } },
    });
    if (!payment || payment.orderId !== input.orderId || payment.order.userId !== userId) {
      throw new HttpError(404, "Payment not found");
    }
    if (!paymentGateway.verifyCheckoutSignature(input.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature)) {
      throw new HttpError(400, "Payment verification failed");
    }

    await this.markPaid(input.razorpayOrderId, input.razorpayPaymentId, null);
    return orderService.getOrder(userId, input.orderId);
  }

  /** Development only: completes a mock payment without a real gateway. */
  async completeMock(userId: string, orderId: string, outcome: "success" | "failure"): Promise<OrderView> {
    if (paymentGateway?.name !== "mock") throw new HttpError(404, "Not found");

    const payment = await prisma.payment.findFirst({
      where: { orderId, gateway: "mock", order: { userId } },
      orderBy: { createdAt: "desc" },
    });
    if (!payment) throw new HttpError(404, "Start the payment first");

    if (outcome === "success") {
      await this.markPaid(payment.gatewayOrderId, `mock_pay_${randomBytes(8).toString("hex")}`, "mock");
    } else {
      await this.markFailed(payment.gatewayOrderId, "Simulated payment failure");
    }
    return orderService.getOrder(userId, orderId);
  }

  /** Razorpay server-to-server notification; the backup for customers who close the tab. */
  async handleWebhook(rawBody: Buffer, signature: string | undefined): Promise<void> {
    if (!verifyWebhookSignature(rawBody, signature)) throw new HttpError(400, "Invalid webhook signature");

    const event = JSON.parse(rawBody.toString("utf8"));
    const entity = event?.payload?.payment?.entity;
    if (!entity?.order_id) return; // not a payment event we track

    const known = await prisma.payment.findUnique({ where: { gatewayOrderId: entity.order_id }, select: { id: true } });
    if (!known) {
      logger.warn(`[Payments] Webhook for unknown gateway order ${entity.order_id}; ignoring`);
      return;
    }

    if (event.event === "payment.captured" || event.event === "order.paid") {
      await this.markPaid(entity.order_id, entity.id, entity.method ?? null);
    } else if (event.event === "payment.failed") {
      await this.markFailed(entity.order_id, entity.error_description || "Payment failed");
    }
  }

  /**
   * Records a successful payment exactly once, however many times it's reported
   * (browser callback and webhook). Emits PaymentSucceeded in the same transaction.
   */
  async markPaid(gatewayOrderId: string, gatewayPaymentId: string, method: string | null): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { gatewayOrderId } });
      if (!payment) throw new HttpError(404, "Payment not found");

      const { count } = await tx.payment.updateMany({
        where: { id: payment.id, status: { in: ["created", "failed"] } },
        data: { status: "paid", gatewayPaymentId, method, failureReason: null },
      });
      if (count === 0) {
        // Already recorded; a later report may still tell us the method (e.g. "upi")
        if (method) await tx.payment.updateMany({ where: { id: payment.id, method: null }, data: { method } });
        return;
      }

      await tx.order.updateMany({ where: { id: payment.orderId, status: "pending_payment" }, data: { status: "paid" } });
      await enqueueEvent(tx, "PaymentSucceeded", {
        orderId: payment.orderId,
        paymentId: payment.id,
        gatewayPaymentId,
        amount: Number(payment.amount),
      });
    });
  }

  /** A failed attempt; the customer can retry until the order's payment timeout. */
  async markFailed(gatewayOrderId: string, reason: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { gatewayOrderId } });
      if (!payment) throw new HttpError(404, "Payment not found");
      const { count } = await tx.payment.updateMany({
        where: { id: payment.id, status: "created" },
        data: { status: "failed", failureReason: reason.slice(0, 500) },
      });
      if (count > 0) {
        await enqueueEvent(tx, "PaymentFailed", { orderId: payment.orderId, paymentId: payment.id, reason });
      }
    });
  }

  /**
   * Compensation: refunds the order's payment if it was paid (e.g. the order was cancelled because
   * stock ran out after payment). Does nothing if there's nothing to refund.
   */
  async refundOrderPayment(orderId: string): Promise<void> {
    const payment = await prisma.payment.findFirst({ where: { orderId, status: "paid" } });
    if (!payment) return;
    if (!paymentGateway || paymentGateway.name !== payment.gateway) {
      throw new Error(`Cannot refund ${payment.gateway} payment ${payment.id}: that gateway is not active`);
    }
    if (!payment.gatewayPaymentId) throw new Error(`Payment ${payment.id} has no gateway payment id`);

    // Claim the refund: only one caller can move paid -> refund_pending, so money is never returned twice
    const { count } = await prisma.payment.updateMany({
      where: { id: payment.id, status: "paid" },
      data: { status: "refund_pending" },
    });
    if (count === 0) return;

    try {
      const refund = await paymentGateway.refund(payment.gatewayPaymentId, toPaise(Number(payment.amount)));
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "refunded", refundId: refund.id } });
      logger.info(`[Payments] Refunded ₹${Number(payment.amount)} for order ${orderId} (refund ${refund.id})`);
    } catch (err) {
      // Release the claim so the retry can try again
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "paid" } });
      throw err;
    }
  }
}

export const paymentService = new PaymentService();
