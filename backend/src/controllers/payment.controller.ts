import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { paymentService } from "../services/payment.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { sendSuccess } from "../utils/response.js";

export const verifySchema = z.object({
  orderId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export const mockCompleteSchema = z.object({
  orderId: z.string().min(1),
  outcome: z.enum(["success", "failure"]),
});

export class PaymentController {
  config(_req: Request, res: Response): void {
    sendSuccess(res, paymentService.getConfig(), "Payment configuration");
  }

  async initiate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      sendSuccess(res, await paymentService.initiate(req.userId!, String(req.params.orderId)), "Payment started");
    } catch (err) {
      next(err);
    }
  }

  async verify(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as z.infer<typeof verifySchema>;
      sendSuccess(res, await paymentService.verifyCheckout(req.userId!, body), "Payment verified");
    } catch (err) {
      next(err);
    }
  }

  async completeMock(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, outcome } = req.body as z.infer<typeof mockCompleteSchema>;
      sendSuccess(res, await paymentService.completeMock(req.userId!, orderId, outcome), "Mock payment completed");
    } catch (err) {
      next(err);
    }
  }

  /** Mounted with express.raw(): the signature is computed over the exact bytes Razorpay sent. */
  async webhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await paymentService.handleWebhook(req.body as Buffer, req.header("x-razorpay-signature"));
      res.status(200).json({ received: true });
    } catch (err) {
      next(err);
    }
  }
}

export const paymentController = new PaymentController();
