import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { AgentResponse, ChatContext, ChatTurn } from "../types/assistant.types.js";
import { LLMMessage } from "./llm.service.js";
import { logger } from "../utils/logger.js";

const HISTORY_TURNS = 10;
const LLM_HISTORY_TURNS = 6;
const MAX_TURN_CHARS = 500;

interface MessageMetadata {
  intent?: string;
  agentName?: string;
  productIds?: string[];
}

export class ConversationService {
  /**
   * Returns the id of the conversation to use. Reuses the given one when the caller may access it
   * (guest conversations, or the user's own); otherwise starts a new one.
   */
  async resolveConversation(conversationId: string | undefined, userId: string | undefined): Promise<string> {
    if (conversationId) {
      const existing = await prisma.conversation.findUnique({ where: { id: conversationId } });
      if (existing && (existing.userId === null || existing.userId === userId)) {
        // A guest who logs in mid-chat keeps the conversation
        if (existing.userId === null && userId) {
          await prisma.conversation.update({ where: { id: existing.id }, data: { userId } });
        }
        return existing.id;
      }
    }
    const created = await prisma.conversation.create({ data: { userId: userId ?? null } });
    return created.id;
  }

  async getContext(conversationId: string): Promise<ChatContext> {
    const rows = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: HISTORY_TURNS,
    });
    const history: ChatTurn[] = rows.reverse().map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
      productIds: ((m.metadata as MessageMetadata | null)?.productIds ?? []).filter((id) => typeof id === "string"),
    }));
    const lastWithProducts = [...history].reverse().find((t) => t.role === "assistant" && t.productIds?.length);
    return { history, lastProductIds: lastWithProducts?.productIds ?? [] };
  }

  /** Saves one user message and the assistant's reply. Failures are logged, never thrown. */
  async saveExchange(conversationId: string, userMessage: string, response: AgentResponse): Promise<void> {
    const now = Date.now();
    const metadata: MessageMetadata = {
      intent: response.intent,
      agentName: response.agentName,
      productIds: (response.recommendedProducts ?? []).map((p) => p.id),
    };
    try {
      await prisma.message.createMany({
        data: [
          // Explicit timestamps keep the pair in order
          { conversationId, role: "user", content: userMessage, createdAt: new Date(now) },
          {
            conversationId,
            role: "assistant",
            content: response.content,
            metadata: metadata as Prisma.InputJsonValue,
            createdAt: new Date(now + 1),
          },
        ],
      });
    } catch (err) {
      logger.warn("[Conversation] Could not save chat messages:", (err as Error).message);
    }
  }
}

/** Recent turns as LLM chat messages, so replies can refer back to earlier ones. */
export function toLLMHistory(ctx: ChatContext | undefined): LLMMessage[] {
  if (!ctx) return [];
  return ctx.history.slice(-LLM_HISTORY_TURNS).map((t) => ({
    role: t.role,
    content: t.content.length > MAX_TURN_CHARS ? `${t.content.slice(0, MAX_TURN_CHARS)}…` : t.content,
  }));
}

export const conversationService = new ConversationService();
