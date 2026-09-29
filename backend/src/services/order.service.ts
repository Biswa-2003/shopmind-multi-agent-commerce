import { randomBytes } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { ENV } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";
import { logger } from "../utils/logger.js";
import { Product } from "../types/product.types.js";
import { productInclude, toProduct } from "./product.service.js";
import { calculateSummary } from "./pricing.js";
import { MAX_QUANTITY_PER_ITEM } from "./cart.service.js";
import { enqueueEvent, Tx } from "../events/outbox.js";
import { CancelReason } from "../events/event-types.js";

export type PaymentMethod = "online" | "cod";

/** Orders in these states can still be cancelled. */
const CANCELLABLE_STATUSES = ["pending_payment", "confirmed", "paid"];

const orderInclude = {
  items: { include: { product: { include: productInclude } } },
  payments: { orderBy: { createdAt: "desc" }, take: 1 },
} satisfies Prisma.OrderInclude;
type OrderRow = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

export interface OrderView {
  id: string;
  status: string;
  paymentMethod: PaymentMethod;
  cancelReason: string | null;
  trackingNumber: string | null;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  totalAmount: number;
  createdAt: string;
  /** Unpaid online orders are cancelled automatically after this time. */
  payBy: string | null;
  payment: { status: string; method: string | null; gateway: string } | null;
  items: { id: string; productId: string; price: number; quantity: number; product: Product }[];
}

function toOrderView(order: OrderRow): OrderView {
  const payment = order.payments[0];
  return {
    id: order.id,
    status: order.status,
    paymentMethod: order.paymentMethod === "online" ? "online" : "cod",
    cancelReason: order.cancelReason,
    trackingNumber: order.trackingNumber,
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    discount: Number(order.discount),
    tax: Number(order.tax),
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    payBy:
      order.status === "pending_payment"
        ? new Date(order.createdAt.getTime() + ENV.PAYMENT_TIMEOUT_MINUTES * 60_000).toISOString()
        : null,
    payment: payment ? { status: payment.status, method: payment.method, gateway: payment.gateway } : null,
    items: order.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      price: Number(i.price),
      quantity: i.quantity,
      product: toProduct(i.product),
    })),
  };
}

function newTrackingNumber(): string {
  return `TRK-IN-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export class OrderService {
  /**
   * Places an order. Prices come from the database, never the client. In one transaction:
   * the order is saved, the saved cart is emptied, and an OrderCreated event is recorded.
   * Stock reservation, emails and payment follow asynchronously from that event.
   */
  async checkout(
    userId: string,
    requested: { productId: string; quantity: number }[],
    paymentMethod: PaymentMethod
  ): Promise<OrderView> {
    // Combine duplicate lines for the same product
    const quantities = new Map<string, number>();
    for (const line of requested) {
      quantities.set(line.productId, Math.min(MAX_QUANTITY_PER_ITEM, (quantities.get(line.productId) ?? 0) + line.quantity));
    }

    const products = await prisma.product.findMany({ where: { id: { in: [...quantities.keys()] } } });
    const byId = new Map(products.map((p) => [p.id, p]));

    const missing = [...quantities.keys()].filter((id) => !byId.has(id));
    if (missing.length > 0) {
      throw new HttpError(400, "Some items are no longer available", { missing });
    }
    // Early, friendly check; the inventory handler makes the authoritative reservation
    const outOfStock = products
      .filter((p) => p.availability !== "in-stock" || p.stock < (quantities.get(p.id) ?? 0))
      .map((p) => (p.stock > 0 ? `${p.name} (only ${p.stock} left)` : p.name));
    if (outOfStock.length > 0) {
      throw new HttpError(409, `Not enough stock: ${outOfStock.join(", ")}`, { outOfStock });
    }

    const lines = [...quantities].map(([productId, quantity]) => ({
      productId,
      quantity,
      price: Number(byId.get(productId)!.price),
    }));
    const summary = calculateSummary(lines);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId,
          paymentMethod,
          status: paymentMethod === "online" ? "pending_payment" : "confirmed",
          trackingNumber: newTrackingNumber(),
          subtotal: summary.subtotal,
          deliveryFee: summary.deliveryFee,
          discount: summary.discount,
          tax: summary.tax,
          totalAmount: summary.total,
          items: { create: lines.map((l) => ({ productId: l.productId, price: l.price, quantity: l.quantity })) },
        },
        include: orderInclude,
      });
      await tx.cartItem.deleteMany({ where: { cart: { userId } } });
      await enqueueEvent(tx, "OrderCreated", {
        orderId: created.id,
        userId,
        paymentMethod,
        totalAmount: summary.total,
        items: lines.map(({ productId, quantity }) => ({ productId, quantity })),
      });
      return created;
    });

    return toOrderView(order);
  }

  async listOrders(userId: string): Promise<OrderView[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
    return orders.map(toOrderView);
  }

  async getOrder(userId: string, orderId: string): Promise<OrderView> {
    const order = await prisma.order.findFirst({ where: { id: orderId, userId }, include: orderInclude });
    if (!order) throw new HttpError(404, "Order not found");
    return toOrderView(order);
  }

  /**
   * Cancels an order if it is still cancellable, recording OrderCancelled in the same transaction
   * (which releases stock, refunds any payment and emails the customer). Returns false if the
   * order was already cancelled or can no longer be cancelled.
   */
  async cancelOrder(orderId: string, reason: CancelReason, tx?: Tx): Promise<boolean> {
    const run = async (t: Tx) => {
      // Conditional update: safe against a payment or another cancellation happening at the same moment
      const { count } = await t.order.updateMany({
        where: { id: orderId, status: { in: CANCELLABLE_STATUSES } },
        data: { status: "cancelled", cancelReason: reason },
      });
      if (count === 0) return false;
      await enqueueEvent(t, "OrderCancelled", { orderId, reason });
      return true;
    };
    return tx ? run(tx) : prisma.$transaction(run);
  }

  /** Customer-initiated cancellation of their own order. */
  async cancelByCustomer(userId: string, orderId: string): Promise<OrderView> {
    const order = await prisma.order.findFirst({ where: { id: orderId, userId }, select: { status: true } });
    if (!order) throw new HttpError(404, "Order not found");
    const cancelled = await this.cancelOrder(orderId, "customer_request");
    if (!cancelled) throw new HttpError(409, `This order can't be cancelled (status: ${order.status})`);
    return this.getOrder(userId, orderId);
  }

  /** Cancels online orders left unpaid past the payment timeout. Safe to run on several servers at once. */
  async expireUnpaidOrders(): Promise<number> {
    const cutoff = new Date(Date.now() - ENV.PAYMENT_TIMEOUT_MINUTES * 60_000);
    const stale = await prisma.order.findMany({
      where: { status: "pending_payment", createdAt: { lt: cutoff } },
      select: { id: true },
      take: 100,
    });
    let expired = 0;
    for (const { id } of stale) {
      if (await this.cancelOrder(id, "payment_timeout")) expired++;
    }
    if (expired > 0) logger.info(`[Orders] Cancelled ${expired} unpaid order(s) after ${ENV.PAYMENT_TIMEOUT_MINUTES} min`);
    return expired;
  }
}

export const orderService = new OrderService();
