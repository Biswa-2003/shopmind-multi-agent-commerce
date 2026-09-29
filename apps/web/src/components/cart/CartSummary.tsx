"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/utils";
import { CartSummary as CartSummaryType } from "@/types/cart";
import { ArrowRight, ShieldCheck, Tag, Sparkles, PackageCheck } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cartStore";
import { api, getErrorMessage, PaymentConfig } from "@/lib/api";
import { PaymentMethod } from "@/types/order";

interface CartSummaryProps {
  summary: CartSummaryType;
}

export function CartSummary({ summary }: CartSummaryProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  // null until loaded; gateway null means online payment isn't configured on the server
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const onlineAvailable = Boolean(paymentConfig?.gateway);

  const openCheckout = () => {
    setModalOpen(true);
    if (isLoggedIn && !paymentConfig) {
      api.payments
        .config()
        .then((config) => {
          setPaymentConfig(config);
          if (!config.gateway) setPaymentMethod("cod");
        })
        .catch(() => {
          setPaymentConfig({ gateway: null, keyId: null });
          setPaymentMethod("cod");
        });
    }
  };

  const closeModal = () => {
    if (isPlacingOrder) return;
    setModalOpen(false);
    setCheckoutError(null);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setCheckoutError(null);
    try {
      const items = useCartStore.getState().items.map((i) => ({ productId: i.product.id, quantity: i.quantity }));
      const method: PaymentMethod = paymentMethod === "online" && onlineAvailable ? "online" : "cod";
      const order = await api.orders.checkout(items, method);
      // The server empties the saved cart as part of checkout
      useCartStore.getState().resetLocal();
      router.push(
        method === "online"
          ? `/orders/${encodeURIComponent(order.id)}/pay`
          : `/orders?placed=${encodeURIComponent(order.id)}`
      );
    } catch (err) {
      setCheckoutError(getErrorMessage(err, "We couldn't place your order. Please try again."));
      setIsPlacingOrder(false);
    }
  };

  return (
    <>
      <div className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xl space-y-5">
        <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">
          Order Summary
        </h3>

        <div className="space-y-3 text-sm divide-y divide-zinc-100 dark:divide-zinc-800/80">
          <div className="flex justify-between pt-1">
            <span className="text-zinc-500">Subtotal</span>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {formatINR(summary.subtotal)}
            </span>
          </div>

          <div className="flex justify-between pt-3">
            <span className="text-zinc-500">Delivery Fee</span>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {summary.deliveryFee === 0 ? "FREE" : formatINR(summary.deliveryFee)}
            </span>
          </div>

          {summary.discount > 0 && (
            <div className="flex justify-between pt-3 text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                AI Smart Savings
              </span>
              <span className="font-bold">-{formatINR(summary.discount)}</span>
            </div>
          )}

          <div className="flex justify-between pt-3">
            <span className="text-zinc-500">Estimated GST (18%)</span>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {formatINR(summary.tax)}
            </span>
          </div>

          <div className="flex justify-between pt-4 text-base font-extrabold text-zinc-900 dark:text-white">
            <span>Total Payable</span>
            <span className="text-indigo-600 dark:text-indigo-400 text-lg">
              {formatINR(summary.total)}
            </span>
          </div>
        </div>

        <button
          id="btn-checkout-trigger"
          onClick={openCheckout}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>256-Bit SSL Encrypted & Verified Safe Payment</span>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={isLoggedIn ? "Confirm your order" : "Log in to check out"}
      >
        {isLoggedIn ? (
          <div className="space-y-4 py-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-zinc-900 dark:text-white">
              {summary.totalItems} {summary.totalItems === 1 ? "item" : "items"} · {formatINR(summary.total)}
            </h4>
            <fieldset className="space-y-2 text-left">
              <legend className="text-xs font-semibold text-zinc-500 mb-2">Payment method</legend>
              {(
                [
                  {
                    value: "online",
                    label: "Pay online",
                    hint: onlineAvailable
                      ? paymentConfig?.gateway === "mock"
                        ? "UPI, cards, netbanking (test mode: no real money)"
                        : "UPI, cards, netbanking & wallets via Razorpay"
                      : paymentConfig
                        ? "Not available right now"
                        : "Checking availability...",
                    disabled: !onlineAvailable,
                  },
                  { value: "cod", label: "Cash on Delivery", hint: "Pay when your order arrives", disabled: false },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === option.value && !option.disabled
                      ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40"
                      : "border-zinc-200 dark:border-zinc-800"
                  } ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={option.value}
                    checked={paymentMethod === option.value && !option.disabled}
                    disabled={option.disabled}
                    onChange={() => setPaymentMethod(option.value)}
                    className="mt-1 accent-indigo-600"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-zinc-900 dark:text-white">{option.label}</span>
                    <span className="block text-xs text-zinc-500">{option.hint}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
              The final total is confirmed by our server using current prices.
            </p>
            {checkoutError && (
              <p role="alert" className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-xl px-4 py-2.5">
                {checkoutError}
              </p>
            )}
            <div className="pt-2 flex items-center justify-center gap-2">
              <Button variant="outline" onClick={closeModal} disabled={isPlacingOrder}>
                Cancel
              </Button>
              <Button
                id="btn-place-order"
                onClick={handlePlaceOrder}
                isLoading={isPlacingOrder}
                disabled={paymentMethod === "online" && !paymentConfig}
              >
                {paymentMethod === "online" && onlineAvailable ? "Continue to payment" : "Place order"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto">
              Log in or create an account to place your order. Your cart will be kept.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <Link
                href="/register?next=/cart"
                className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs"
              >
                Create account
              </Link>
              <Link
                href="/login?next=/cart"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Log in
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default CartSummary;
