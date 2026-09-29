import { api, PaymentSession } from "@/lib/api";
import { Order } from "@/types/order";

const CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", handler: (response: { error?: { description?: string } }) => void): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadCheckoutScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = CHECKOUT_SCRIPT;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error("Couldn't load the payment window. Check your connection and try again."));
      };
      document.body.appendChild(script);
    });
  }
  return scriptPromise;
}

export type RazorpayOutcome = { status: "paid"; order: Order } | { status: "dismissed" };

/**
 * Opens Razorpay's checkout for a payment session. On success the signature is sent to our
 * server for verification; the browser's word alone never marks an order paid.
 */
export async function openRazorpayCheckout(session: PaymentSession, description: string): Promise<RazorpayOutcome> {
  await loadCheckoutScript();
  const Razorpay = window.Razorpay;
  if (!Razorpay || !session.keyId) throw new Error("Payment window unavailable");

  return new Promise((resolve, reject) => {
    const checkout = new Razorpay({
      key: session.keyId,
      order_id: session.gatewayOrderId,
      amount: session.amountPaise,
      currency: session.currency,
      name: "ShopMind AI",
      description,
      prefill: session.prefill,
      theme: { color: "#4f46e5" },
      handler: (response: RazorpaySuccess) => {
        api.payments
          .verify({
            orderId: session.orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          })
          .then((order) => resolve({ status: "paid", order }))
          .catch(reject);
      },
      modal: { ondismiss: () => resolve({ status: "dismissed" }) },
    });
    // Failed attempts keep the popup open so the customer can try another method; nothing to do here
    checkout.on("payment.failed", () => undefined);
    checkout.open();
  });
}
