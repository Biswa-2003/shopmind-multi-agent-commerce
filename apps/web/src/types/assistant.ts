import { Product } from "./product";

export type MessageRole = "user" | "assistant" | "system";

export type AgentIntent =
  | "product_search"
  | "product_recommendation"
  | "product_comparison"
  | "product_question"
  | "cart_request"
  | "general_shopping";

export interface AssistantAction {
  type: "add_to_cart";
  productId: string;
  quantity: number;
  product: Product;
}

export interface ChatRecommendation {
  product: Product;
  matchScore: number;
  reason: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  intent?: AgentIntent;
  recommendations?: ChatRecommendation[];
  comparisonProducts?: Product[];
  actionPrompts?: string[];
  /** Products the assistant put in the cart for this reply. */
  addedToCart?: { name: string; quantity: number }[];
  /** True when the backend was unreachable and the reply came from the built-in offline answers. */
  offline?: boolean;
}
