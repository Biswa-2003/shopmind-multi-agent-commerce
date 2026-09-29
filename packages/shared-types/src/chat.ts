import { SharedProduct } from "./product.js";

export type SharedMessageRole = "user" | "assistant" | "system";

export interface SharedRecommendation {
  product: SharedProduct;
  matchScore: number;
  reason: string;
}

export interface SharedChatMessage {
  id: string;
  role: SharedMessageRole;
  content: string;
  timestamp: string;
  recommendations?: SharedRecommendation[];
  actionPrompts?: string[];
}
