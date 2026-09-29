import { shoppingOrchestrator } from "../agents/shopping-orchestrator.agent.js";
import { AgentResponse } from "../types/assistant.types.js";

export class AssistantService {
  async handleChatMessage(
    message: string,
    options: { conversationId?: string; userId?: string } = {}
  ): Promise<AgentResponse> {
    return await shoppingOrchestrator.processQuery(message, options);
  }
}

export const assistantService = new AssistantService();
