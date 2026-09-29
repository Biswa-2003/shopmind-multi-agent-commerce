"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PackageCheck, Clock, ArrowRight, ShieldCheck, CheckCircle2, LogIn, ShoppingBag } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { api, getErrorMessage } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useLocationSearch } from "@/hooks/useHydrated";
import { Order } from "@/types/order";

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  pending_payment: { label: "Awaiting payment", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  paid: { label: "Paid", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  confirmed: { label: "Confirmed", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  shipped: { label: "Shipped", className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  delivered: { label: "Delivered", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  cancelled: { label: "Cancelled", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
};

const CANCEL_REASONS: Record<string, string> = {
  out_of_stock: "An item went out of stock",
  payment_timeout: "Payment wasn't completed in time",
  customer_request: "Cancelled by you",
};

const PAYMENT_STATUS: Record<string, string> = {
  paid: "Paid",
  refund_pending: "Refund in progress",
  refunded: "Refunded",
  failed: "Last attempt failed",
  created: "Not paid yet",
};

function paymentLine(order: Order): string {
  if (order.paymentMethod === "cod") return "Payment: Cash on Delivery";
  const status = order.payment ? PAYMENT_STATUS[order.payment.status] ?? order.payment.status : "Not paid yet";
  const method = order.payment?.method && order.payment.status !== "created" ? ` · ${order.payment.method.toUpperCase()}` : "";
  return `Payment: Online · ${status}${method}`;
}

function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function shortOrderId(id: string): string {
  return `ORD-${id.slice(0, 8).toUpperCase()}`;
}

export default function OrdersPage() {
  const { isLoggedIn, isHydrated } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const placedOrderId = new URLSearchParams(useLocationSearch()).get("placed");

  const handleCancel = async (orderId: string) => {
    if (!window.confirm("Cancel this order? Any payment will be refunded.")) return;
    setCancellingId(orderId);
    setError(null);
    try {
      const updated = await api.orders.cancel(orderId);
      setOrders((prev) => prev?.map((o) => (o.id === orderId ? updated : o)) ?? null);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't cancel this order."));
    }
    setCancellingId(null);
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    api.orders
      .list()
      .then((list) => {
        if (!cancelled) setOrders(list);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Couldn't load your orders."));
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  if (!isHydrated || (isLoggedIn && orders === null && !error)) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-zinc-400 text-sm">
        Loading your orders...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <LogIn className="w-10 h-10 mx-auto text-indigo-500" />
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Log in to see your orders</h1>
        <p className="text-sm text-zinc-500">Your order history is saved to your account.</p>
        <Link
          href="/login?next=/orders"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Your Order History
        </h1>
        <p className="text-sm text-zinc-500 mt-1">Every order you&apos;ve placed with ShopMind.</p>
      </div>

      {placedOrderId && orders?.some((o) => o.id === placedOrderId && ["paid", "confirmed"].includes(o.status)) && (
        <div
          role="status"
          className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-sm font-semibold"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {orders?.find((o) => o.id === placedOrderId)?.paymentMethod === "online"
            ? `Payment received. Order ${shortOrderId(placedOrderId)} is confirmed.`
            : `Order ${shortOrderId(placedOrderId)} placed. You'll pay on delivery.`}
        </div>
      )}

      {error && (
        <p role="alert" className="mb-6 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-2xl px-4 py-3">
          {error}
        </p>
      )}

      {orders && orders.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <ShoppingBag className="w-10 h-10 mx-auto text-zinc-300" />
          <p className="text-sm text-zinc-500">You haven&apos;t placed any orders yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {orders?.map((order) => (
          <div
            key={order.id}
            className={`p-6 rounded-3xl border bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-sm space-y-4 ${
              order.id === placedOrderId
                ? "border-emerald-400 dark:border-emerald-600"
                : "border-zinc-200/80 dark:border-zinc-800/80"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Order Number
                </span>
                <p className="font-extrabold text-zinc-900 dark:text-white text-base" title={order.id}>
                  {shortOrderId(order.id)}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Date Placed
                </span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{formatOrderDate(order.createdAt)}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Total Amount
                </span>
                <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                  {formatINR(order.totalAmount)}
                </p>
              </div>

              <div className="text-right space-y-1">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    STATUS_BADGES[order.status]?.className ?? "bg-zinc-500/10 text-zinc-600"
                  }`}
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>{STATUS_BADGES[order.status]?.label ?? order.status}</span>
                </div>
                {order.status === "cancelled" && order.cancelReason && (
                  <p className="text-xs text-zinc-500">{CANCEL_REASONS[order.cancelReason] ?? order.cancelReason}</p>
                )}
              </div>
            </div>

            <ul className="space-y-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    <Image src={item.product.image} alt={item.product.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:underline truncate block"
                    >
                      {item.product.name}
                    </Link>
                    <span className="text-xs text-zinc-500">
                      {item.quantity} × {formatINR(item.price)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-zinc-500 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div>
                <dt>Subtotal</dt>
                <dd className="font-semibold text-zinc-800 dark:text-zinc-200">{formatINR(order.subtotal)}</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {order.deliveryFee === 0 ? "FREE" : formatINR(order.deliveryFee)}
                </dd>
              </div>
              <div>
                <dt>GST (18%)</dt>
                <dd className="font-semibold text-zinc-800 dark:text-zinc-200">{formatINR(order.tax)}</dd>
              </div>
              {order.discount > 0 && (
                <div>
                  <dt>Savings</dt>
                  <dd className="font-semibold text-emerald-600 dark:text-emerald-400">-{formatINR(order.discount)}</dd>
                </div>
              )}
            </dl>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Tracking Number: {order.trackingNumber ?? "Assigned when shipped"}</span>
              </div>

              <div className="flex items-center gap-1.5 text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5" />
                {paymentLine(order)}
              </div>
            </div>

            {["pending_payment", "confirmed", "paid"].includes(order.status) && (
              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                {order.status === "pending_payment" && order.payBy && (
                  <span className="mr-auto text-xs text-amber-600 dark:text-amber-400">
                    Pay by {new Date(order.payBy).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} to keep this order
                  </span>
                )}
                <button
                  onClick={() => handleCancel(order.id)}
                  disabled={cancellingId === order.id}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:border-rose-400 hover:text-rose-500 cursor-pointer disabled:opacity-50"
                >
                  {cancellingId === order.id ? "Cancelling..." : "Cancel order"}
                </button>
                {order.status === "pending_payment" && (
                  <Link
                    href={`/orders/${order.id}/pay`}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                  >
                    Pay now {formatINR(order.totalAmount)}
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
