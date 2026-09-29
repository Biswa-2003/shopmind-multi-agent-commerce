import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import axios from "axios";
import { ENV } from "../config/env.js";

export type GatewayName = "razorpay" | "mock";

export interface PaymentGateway {
  name: GatewayName;
  /** Public key the browser needs to open the checkout (Razorpay key id). */
  publicKey: string | null;
  createOrder(amountPaise: number, receipt: string): Promise<{ id: string }>;
  /** Checks the signature the checkout popup returns after a successful payment. */
  verifyCheckoutSignature(gatewayOrderId: string, gatewayPaymentId: string, signature: string): boolean;
  refund(gatewayPaymentId: string, amountPaise: number): Promise<{ id: string }>;
}

function hmacHex(secret: string, message: string | Buffer): string {
  return createHmac("sha256", secret).update(message).digest("hex");
}

/** Constant-time comparison so signatures can't be guessed byte by byte. */
function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

class RazorpayGateway implements PaymentGateway {
  readonly name = "razorpay" as const;
  readonly publicKey = ENV.RAZORPAY_KEY_ID;
  private readonly http = axios.create({
    baseURL: "https://api.razorpay.com/v1",
    auth: { username: ENV.RAZORPAY_KEY_ID, password: ENV.RAZORPAY_KEY_SECRET },
    timeout: 10000,
  });

  async createOrder(amountPaise: number, receipt: string): Promise<{ id: string }> {
    const res = await this.http.post("/orders", { amount: amountPaise, currency: "INR", receipt });
    return { id: res.data.id };
  }

  verifyCheckoutSignature(gatewayOrderId: string, gatewayPaymentId: string, signature: string): boolean {
    const expected = hmacHex(ENV.RAZORPAY_KEY_SECRET, `${gatewayOrderId}|${gatewayPaymentId}`);
    return safeEqual(expected, signature);
  }

  async refund(gatewayPaymentId: string, amountPaise: number): Promise<{ id: string }> {
    const res = await this.http.post(`/payments/${gatewayPaymentId}/refund`, { amount: amountPaise });
    return { id: res.data.id };
  }
}

/** Development stand-in: no money moves. The UI offers "succeed" / "fail" buttons instead of a popup. */
class MockGateway implements PaymentGateway {
  readonly name = "mock" as const;
  readonly publicKey = null;

  async createOrder(): Promise<{ id: string }> {
    return { id: `mock_order_${randomBytes(8).toString("hex")}` };
  }

  verifyCheckoutSignature(): boolean {
    return false; // mock payments are completed through the dev-only mock endpoint instead
  }

  async refund(): Promise<{ id: string }> {
    return { id: `mock_refund_${randomBytes(8).toString("hex")}` };
  }
}

function selectGateway(): PaymentGateway | null {
  const hasRazorpayKeys = Boolean(ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET);
  const choice = ENV.PAYMENT_GATEWAY;

  if (choice === "razorpay" || (choice === "auto" && hasRazorpayKeys)) {
    if (!hasRazorpayKeys) throw new Error("PAYMENT_GATEWAY=razorpay requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET");
    return new RazorpayGateway();
  }
  if (choice === "mock" || (choice === "auto" && ENV.NODE_ENV === "development")) {
    if (ENV.NODE_ENV === "production") throw new Error("The mock payment gateway cannot be used in production");
    return new MockGateway();
  }
  return null; // online payments disabled; cash on delivery still works
}

export const paymentGateway: PaymentGateway | null = selectGateway();

/** Verifies Razorpay's webhook signature over the exact raw request body. */
export function verifyWebhookSignature(rawBody: Buffer, signature: string | undefined): boolean {
  if (!ENV.RAZORPAY_WEBHOOK_SECRET || !signature) return false;
  return safeEqual(hmacHex(ENV.RAZORPAY_WEBHOOK_SECRET, rawBody), signature);
}
