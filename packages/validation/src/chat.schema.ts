import { z } from "zod";

export const SendMessageSchema = z.object({
  message: z.string().min(1, "Message content is required"),
  conversationId: z.string().optional(),
  userId: z.string().optional(),
});
