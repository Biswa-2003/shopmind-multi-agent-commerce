import axios from "axios";
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { prisma } from "../config/database.js";

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

/** Development default: prints the email instead of sending it. */
const consoleProvider: EmailProvider = {
  async send(message) {
    logger.info(`[Email] To: ${message.to} | ${message.subject}\n${message.text}`);
  },
};

const resendProvider: EmailProvider = {
  async send(message) {
    await axios.post(
      "https://api.resend.com/emails",
      { from: ENV.EMAIL_FROM, to: [message.to], subject: message.subject, text: message.text },
      { headers: { Authorization: `Bearer ${ENV.RESEND_API_KEY}` }, timeout: 10000 }
    );
  },
};

/** Always fails. Set EMAIL_PROVIDER=failing to watch retries and the dead letter queue in action. */
const failingProvider: EmailProvider = {
  async send() {
    throw new Error("Email provider unavailable (EMAIL_PROVIDER=failing)");
  },
};

function selectProvider(): EmailProvider {
  if (ENV.EMAIL_PROVIDER === "resend") {
    if (!ENV.RESEND_API_KEY) throw new Error("EMAIL_PROVIDER=resend requires RESEND_API_KEY");
    return resendProvider;
  }
  if (ENV.EMAIL_PROVIDER === "failing") return failingProvider;
  return consoleProvider;
}

const provider = selectProvider();
const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
const shortId = (id: string) => `ORD-${id.slice(0, 8).toUpperCase()}`;

const CANCEL_REASONS: Record<string, string> = {
  out_of_stock: "one or more items went out of stock",
  payment_timeout: "payment wasn't completed in time",
  customer_request: "you requested the cancellation",
};

async function loadOrder(orderId: string) {
  return prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { user: true, items: { include: { product: true } }, payments: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
}

function itemLines(order: Awaited<ReturnType<typeof loadOrder>>): string {
  return order.items.map((i) => `  - ${i.quantity} × ${i.product.name} — ${inr(Number(i.price) * i.quantity)}`).join("\n");
}

export const emailService = {
  async sendOrderConfirmation(orderId: string): Promise<void> {
    const order = await loadOrder(orderId);
    await provider.send({
      to: order.user.email,
      subject: `Order ${shortId(order.id)} confirmed`,
      text: `Hi ${order.user.name},\n\nThanks for your order! We'll collect ${inr(Number(order.totalAmount))} on delivery.\n\n${itemLines(order)}\n\nTracking number: ${order.trackingNumber}\n\n— ShopMind AI`,
    });
  },

  async sendPaymentReceipt(orderId: string): Promise<void> {
    const order = await loadOrder(orderId);
    const payment = order.payments[0];
    await provider.send({
      to: order.user.email,
      subject: `Payment received for order ${shortId(order.id)}`,
      text: `Hi ${order.user.name},\n\nWe've received your payment of ${inr(Number(order.totalAmount))}${payment?.method ? ` via ${payment.method.toUpperCase()}` : ""}.\n\n${itemLines(order)}\n\nTracking number: ${order.trackingNumber}\n\n— ShopMind AI`,
    });
  },

  async sendCancellation(orderId: string): Promise<void> {
    const order = await loadOrder(orderId);
    // The refund runs in parallel with this email, so any paid state means a refund is on its way
    const refunded = ["paid", "refund_pending", "refunded"].includes(order.payments[0]?.status ?? "");
    await provider.send({
      to: order.user.email,
      subject: `Order ${shortId(order.id)} cancelled`,
      text: `Hi ${order.user.name},\n\nYour order was cancelled because ${CANCEL_REASONS[order.cancelReason ?? ""] ?? "of a problem processing it"}.${
        refunded ? ` Your payment of ${inr(Number(order.totalAmount))} is being refunded.` : ""
      }\n\n${itemLines(order)}\n\n— ShopMind AI`,
    });
  },
};
