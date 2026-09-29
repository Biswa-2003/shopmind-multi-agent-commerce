import axios from "axios";

export class AssistantApiClient {
  constructor(private baseUrl: string) {}

  async chat(message: string, conversationId?: string, userId?: string) {
    const res = await axios.post(`${this.baseUrl}/assistant/chat`, {
      message,
      conversationId,
      userId,
    });
    return res.data;
  }
}
