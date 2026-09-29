"use client";

import { useRef, useState } from "react";
import { AssistantAction, ChatMessage } from "@/types/assistant";
import { INITIAL_ASSISTANT_MESSAGE, SUGGESTED_PROMPTS } from "@/lib/constants";
import { PRODUCTS } from "@/data/products";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";

/** Carries out actions the assistant asked for; the cart store saves to the account when logged in. */
function applyActions(actions: AssistantAction[] | undefined) {
  for (const action of actions ?? []) {
    if (action.type === "add_to_cart" && action.product) {
      useCartStore.getState().addItem(action.product, action.quantity);
    }
  }
}

export function useAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_ASSISTANT_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Lets the backend remember earlier messages ("add it to my cart")
  const conversationId = useRef<string | undefined>(undefined);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 1. Try sending to backend API
      const backendRes = await api.sendChatMessage(text, conversationId.current);
      if (backendRes && backendRes.data) {
        const agentData = backendRes.data;
        conversationId.current = agentData.conversationId ?? conversationId.current;
        applyActions(agentData.actions);
        const botMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: agentData.content || agentData.message || "Here are my findings:",
          timestamp: new Date().toISOString(),
          intent: agentData.intent,
          recommendations: agentData.recommendedProducts?.map((p: typeof PRODUCTS[0]) => ({
            product: p,
            matchScore: p.matchScore || 95,
            reason: p.aiPros?.[0] || "Top rated match for your criteria.",
          })),
          comparisonProducts: agentData.intent === "product_comparison" ? agentData.recommendedProducts : undefined,
          actionPrompts: agentData.suggestedFollowUps || SUGGESTED_PROMPTS.slice(0, 3),
          addedToCart: (agentData.actions as AssistantAction[] | undefined)
            ?.filter((a) => a.type === "add_to_cart" && a.product)
            .map((a) => ({ name: a.product.name, quantity: a.quantity })),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
        return;
      }
    } catch {
      // Graceful fallback to client-side multi-agent engine simulation
    }

    // 2. Client-side Autonomous Mock AI Fallback
    setTimeout(() => {
      const q = text.toLowerCase();
      let replyContent = "";
      let recommendations: ChatMessage["recommendations"] = [];
      let comparisonProducts: ChatMessage["comparisonProducts"] = undefined;
      let actionPrompts: string[] = [];
      let intent: ChatMessage["intent"] = "general_shopping";

      if (q.includes("under 60") || q.includes("under 60,000") || q.includes("under ₹60,000") || (q.includes("laptop") && q.includes("coding"))) {
        intent = "product_recommendation";
        const codingLaptops = PRODUCTS.filter((p) => p.category === "Laptops" && p.price <= 60000);
        replyContent = "I found these top coding laptops under ₹60,000. The **Acer Swift Go 14** stands out with its gorgeous 2.8K OLED screen and 16GB RAM for compiling code and running Docker.";
        recommendations = codingLaptops.map((p) => ({
          product: p,
          matchScore: p.matchScore || 98,
          reason: p.aiPros?.[0] || "Great compilation speeds & keyboard layout.",
        }));
        actionPrompts = ["Compare Acer Swift Go vs Asus Vivobook", "Add Acer Swift Go 14 to Cart", "Show full spec sheet"];
      } else if (q.includes("photography") || q.includes("photo") || (q.includes("phone") && q.includes("camera"))) {
        intent = "product_recommendation";
        const phones = PRODUCTS.filter((p) => p.category === "Smartphones" && p.tags.includes("photography"));
        replyContent = "For mobile photography and ProVisual AI processing, the **Samsung Galaxy S24 Ultra** (200MP + 5x optical zoom) and **Apple iPhone 15 Pro** (48MP ProRAW) are the undisputed kings.";
        recommendations = phones.slice(0, 2).map((p) => ({
          product: p,
          matchScore: p.matchScore || 97,
          reason: p.aiPros?.[0] || "World-class sensor resolution & color science.",
        }));
        actionPrompts = ["Compare iPhone 15 Pro vs S24 Ultra", "Check camera zoom samples", "Add S24 Ultra to Cart"];
      } else if (q.includes("compare")) {
        intent = "product_comparison";
        const items = q.includes("headphone")
          ? PRODUCTS.filter((p) => p.category === "Headphones").slice(0, 2)
          : PRODUCTS.filter((p) => p.category === "Smartphones").slice(0, 2);
        replyContent = `Here is a side-by-side spec comparison between ${items[0]?.name} and ${items[1]?.name}:`;
        comparisonProducts = items;
        recommendations = items.map((p) => ({
          product: p,
          matchScore: p.matchScore || 95,
          reason: p.aiPros?.[0] || "Top category pick.",
        }));
        actionPrompts = ["Which one has longer battery life?", "Add first choice to Cart"];
      } else if (q.includes("smartwatch") && (q.includes("5000") || q.includes("5,000"))) {
        intent = "product_recommendation";
        const watches = PRODUCTS.filter((p) => p.category === "Smartwatches" && p.price <= 5000);
        replyContent = "Under ₹5,000, the **Noise ColorFit Pro 5** offers the clearest 1.85-inch AMOLED screen and Bluetooth calling, while the **Fire-Boltt Invincible Plus** includes 4GB offline music storage.";
        recommendations = watches.map((p) => ({
          product: p,
          matchScore: p.matchScore || 96,
          reason: p.aiPros?.[0] || "Best value under ₹5,000.",
        }));
        actionPrompts = ["Add Noise ColorFit Pro 5 to Cart", "Compare both smartwatches"];
      } else if (q.includes("office") || q.includes("headphone")) {
        intent = "product_recommendation";
        const headphones = PRODUCTS.filter((p) => p.category === "Headphones");
        replyContent = "For office and remote work calls, the **Sony WH-1000XM5** is the best choice with quad beamforming microphones that cancel surrounding keyboard typing and chatter.";
        recommendations = headphones.slice(0, 2).map((p) => ({
          product: p,
          matchScore: p.matchScore || 98,
          reason: p.aiPros?.[0] || "Superior background noise cancellation.",
        }));
        actionPrompts = ["Is it comfortable for 8 hours?", "Add Sony WH-1000XM5 to Cart"];
      } else if (q.includes("battery") && q.includes("laptop")) {
        intent = "product_recommendation";
        const macbook = PRODUCTS.find((p) => p.id === "lap-2") || PRODUCTS[1];
        replyContent = `The **Apple MacBook Air M3** leads the industry with up to 18 hours of real-world battery endurance on a single charge and silent fanless operation.`;
        recommendations = [
          {
            product: macbook,
            matchScore: 99,
            reason: "18-hour continuous battery life with silent cooling.",
          },
        ];
        actionPrompts = ["Compare MacBook Air M3 with Acer Swift Go 14", "Add to Cart"];
      } else {
        intent = "general_shopping";
        replyContent = `I searched across our catalog of electronics, smartphones, and laptops. Here are top-rated items matching modern performance benchmarks:`;
        recommendations = PRODUCTS.slice(0, 3).map((p) => ({
          product: p,
          matchScore: p.matchScore || 92,
          reason: `High customer satisfaction (${p.rating}★) with verified reliability.`,
        }));
        actionPrompts = SUGGESTED_PROMPTS.slice(0, 3);
      }

      const botMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyContent,
        timestamp: new Date().toISOString(),
        intent,
        recommendations,
        comparisonProducts,
        actionPrompts,
        offline: true,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 700);
  };

  const clearChat = () => {
    setMessages([INITIAL_ASSISTANT_MESSAGE]);
    conversationId.current = undefined; // start a fresh conversation on the server too
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  };
}
