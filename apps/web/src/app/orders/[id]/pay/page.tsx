"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CreditCard, FlaskConical, Lock, ShieldCheck, Timer, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api, getErrorMessage, PaymentSession } from "@/lib/api";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { formatINR } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Order } from "@/types/order";

const shortOrderId = (id: string) => `ORD-${id.slice(0, 8).toUpperCase()}`;

export default function PayOrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoggedIn, isHydrated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mockSession, setMockSession] = useState<PaymentSession | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    api.orders
      .get(id)
      .then(setOrder)
      .catch((err) => setError(getErrorMessage(err, "Couldn't load this order.")));
  }, [id, isLoggedIn]);

  const goToOrders = () => router.push(`/orders?placed=${encodeURIComponent(id)}`);

  const handlePay = async () => {
    if (!order) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const session = await api.payments.initiate(order.id);
      if (session.gateway === "mock") {
        setMockSession(session); // development: show simulated outcome buttons instead of a popup
        setBusy(false);
        return;
      }
      const outcome = await openRazorpayCheckout(session, `Order ${shortOrderId(order.id)}`);
      if (outcome.status === "paid") {
        goToOrders();
        return;
      }
      setNotice("Payment window closed before payment was completed. You can try again.");
    } catch (err) {
      setError(getErrorMessage(err, "Payment couldn't be started. Please try again."));
    }
    setBusy(false);
  };

  const handleMock = async (outcome: "success" | "failure") => {
    setBusy(true);
    setError(null);
    try {
      const updated = await api.payments.completeMock(id, outcome);
      if (updated.status === "paid") {
        goToOrders();
        return;
      }
      setOrder(updated);
      setMockSession(null);
      setError("Payment failed (simulated). No money was taken. You can try again.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
    setBusy(false);
  };

  const handleCancel = async () => {
    setBusy(true);
    try {
      setOrder(await api.orders.cancel(id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
    setBusy(false);
  };

  if (!isHydrated) return null;

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-sm text-zinc-500">Log in to pay for your order.</p>
        <Link href={`/login?next=/orders/${id}/pay`} className="inline-flex px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm">
          Log in
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-sm text-zinc-400">
        {error ?? "Loading your order..."}
      </div>
    );
  }

  const awaitingPayment = order.status === "pending_payment";

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 md:py-16">
      <div className="p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <CreditCard className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
            {awaitingPayment ? "Complete your payment" : `Order ${shortOrderId(order.id)}`}
          </h1>
          <p className="text-sm text-zinc-500">
            {order.items.length} {order.items.length === 1 ? "item" : "items"} · Order {shortOrderId(order.id)}
          </p>
        </div>

        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-2 gap-4">
              <span className="text-zinc-700 dark:text-zinc-300 truncate">
                {item.quantity} × {item.product.name}
              </span>
              <span className="font-semibold text-zinc-900 dark:text-white shrink-0">{formatINR(item.price * item.quantity)}</span>
            </li>
          ))}
          <li className="flex justify-between pt-3 text-base font-extrabold text-zinc-900 dark:text-white">
            <span>Total (incl. GST)</span>
            <span className="text-indigo-600 dark:text-indigo-400">{formatINR(order.totalAmount)}</span>
          </li>
        </ul>

        {awaitingPayment && order.payBy && (
          <p className="flex items-center justify-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
            <Timer className="w-3.5 h-3.5" />
            Pay by {new Date(order.payBy).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} or the
            order is cancelled and items released.
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-xl px-4 py-2.5">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 rounded-xl px-4 py-2.5">
            {notice}
          </p>
        )}

        {awaitingPayment && !mockSession && (
          <div className="space-y-3">
            <Button id="btn-pay-now" size="lg" className="w-full" onClick={handlePay} isLoading={busy}>
              <Lock className="w-4 h-4 mr-2" />
              Pay {formatINR(order.totalAmount)}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              UPI, cards, netbanking & wallets via Razorpay
            </p>
            <button
              onClick={handleCancel}
              disabled={busy}
              className="w-full text-xs font-semibold text-zinc-500 hover:text-rose-500 cursor-pointer disabled:opacity-50"
            >
              Cancel this order
            </button>
          </div>
        )}

        {awaitingPayment && mockSession && (
          <div className="space-y-3 p-4 rounded-2xl border border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/30">
            <p className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
              <FlaskConical className="w-4 h-4" />
              Test payment (development mode)
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              No Razorpay keys are configured, so no real payment window opens and no money moves. Choose an outcome:
            </p>
            <div className="flex gap-2">
              <Button id="btn-mock-success" className="flex-1" onClick={() => handleMock("success")} isLoading={busy}>
                Simulate success
              </Button>
              <Button id="btn-mock-failure" variant="outline" className="flex-1" onClick={() => handleMock("failure")} disabled={busy}>
                Simulate failure
              </Button>
            </div>
          </div>
        )}

        {!awaitingPayment && (
          <div className="text-center space-y-3">
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {order.status === "cancelled" ? <XCircle className="w-4 h-4 text-rose-500" /> : <ShieldCheck className="w-4 h-4 text-emerald-500" />}
              {order.status === "cancelled" ? "This order was cancelled." : "This order doesn't need payment."}
            </p>
            <Link href="/orders" className="inline-flex text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View my orders
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
