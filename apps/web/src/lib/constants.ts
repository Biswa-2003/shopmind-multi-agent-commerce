export const BRAND_NAME = "ShopMind AI";
export const BRAND_TAGLINE = "Shopping, powered by intelligence.";

export const SUGGESTED_PROMPTS = [
  "Find a laptop under ₹60,000 for coding.",
  "Suggest the best phone for photography.",
  "Show me headphones for office work.",
  "Compare iPhone and Samsung phones.",
  "Which smartwatch is good under ₹5,000?",
  "Recommend a laptop with good battery life.",
];

export const INITIAL_ASSISTANT_MESSAGE = {
  id: "msg-welcome",
  role: "assistant" as const,
  content: "Hello! I am **ShopMind AI**, your personal shopping assistant. Ask me anything about tech, laptops, phones, specs, or ask me to compare products!",
  timestamp: new Date().toISOString(),
  actionPrompts: SUGGESTED_PROMPTS.slice(0, 4),
};
