import { Product } from "./product.types.js";

export type AgentIntent =
  | "product_search"
  | "product_recommendation"
  | "product_comparison"
  | "product_question"
  | "cart_request"
  | "general_shopping";

export const AGENT_INTENTS: AgentIntent[] = [
  "product_search",
  "product_recommendation",
  "product_comparison",
  "product_question",
  "cart_request",
  "general_shopping",
];

/** Requirement keywords; each one matches a product tag of the same name. */
export const REQUIREMENT_TAGS = [
  "coding",
  "photography",
  "gaming",
  "anc",
  "office-work",
  "travel",
  "creator",
  "budget",
  "premium",
] as const;

export interface IntentDetectionResult {
  intent: AgentIntent;
  category?: string;
  budget?: number;
  requirements?: string[];
  /** Catalog ids the user referred to, by name or by "it/this/that" from earlier in the chat. */
  productIds: string[];
  quantity?: number;
  /** "llm" when the AI model parsed the message, "rules" for the keyword fallback. */
  source: "llm" | "rules";
}

/** One earlier message in the conversation, oldest first. */
export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
  productIds?: string[];
}

export interface ChatContext {
  history: ChatTurn[];
  /** Products shown in the most recent assistant reply, in display order. */
  lastProductIds: string[];
}

export interface AddToCartAction {
  type: "add_to_cart";
  productId: string;
  quantity: number;
  product: Product;
}

export type AssistantAction = AddToCartAction;

export interface AgentResponse {
  agentName: string;
  intent: AgentIntent;
  content: string;
  recommendedProducts?: Product[];
  comparisonMatrix?: Record<string, unknown>;
  suggestedFollowUps?: string[];
  /** Things the client should do, e.g. add a product to the cart. */
  actions?: AssistantAction[];
  conversationId?: string;
}

export interface AIProvider {
  generateResponse(input: string, context?: unknown): Promise<unknown>;
}
