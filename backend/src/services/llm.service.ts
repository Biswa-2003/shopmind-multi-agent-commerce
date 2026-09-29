import axios from "axios";
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMOptions {
  /** Total time budget across all providers, in ms. */
  deadlineMs?: number;
  maxTokens?: number;
  temperature?: number;
}

const DEFAULT_DEADLINE_MS = 12000;
const MIN_ATTEMPT_MS = 1000;

type ProviderCall = (messages: LLMMessage[], opts: Required<LLMOptions>, timeoutMs: number) => Promise<string | null>;

function hasKey(key: string): boolean {
  return Boolean(key) && !key.includes("your_");
}

/** Removes reasoning blocks some models (e.g. Qwen) emit before the answer. */
function cleanOutput(text: string | null | undefined): string | null {
  if (!text) return null;
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  return cleaned || null;
}

export class LLMService {
  private providers(): { name: string; timeoutMs: number; call: ProviderCall }[] {
    const list: { name: string; timeoutMs: number; call: ProviderCall }[] = [];
    if (hasKey(ENV.GROQ_API_KEY)) list.push({ name: "Groq", timeoutMs: 8000, call: this.callGroq });
    if (hasKey(ENV.GEMINI_API_KEY)) list.push({ name: "Gemini", timeoutMs: 8000, call: this.callGemini });
    if (hasKey(ENV.OPENROUTER_API_KEY)) list.push({ name: "OpenRouter", timeoutMs: 10000, call: this.callOpenRouter });
    return list;
  }

  /** True when at least one provider has an API key configured. */
  isAvailable(): boolean {
    return this.providers().length > 0;
  }

  /**
   * Tries Groq, then Gemini, then OpenRouter until one answers, within one overall deadline.
   * Returns null if none is configured or all fail, so callers can fall back to template text.
   */
  async generateResponse(messages: LLMMessage[], options: LLMOptions = {}): Promise<string | null> {
    const opts: Required<LLMOptions> = {
      deadlineMs: options.deadlineMs ?? DEFAULT_DEADLINE_MS,
      maxTokens: options.maxTokens ?? 600,
      temperature: options.temperature ?? 0.7,
    };
    const startedAt = Date.now();

    for (const provider of this.providers()) {
      const remaining = opts.deadlineMs - (Date.now() - startedAt);
      if (remaining < MIN_ATTEMPT_MS) {
        logger.warn(`[LLM] Deadline reached before trying ${provider.name}`);
        break;
      }
      try {
        const text = cleanOutput(await provider.call(messages, opts, Math.min(provider.timeoutMs, remaining)));
        if (text) {
          logger.debug(`[LLM] ${provider.name} answered in ${Date.now() - startedAt}ms`);
          return text;
        }
      } catch (err: unknown) {
        logger.warn(`[LLM] ${provider.name} call failed:`, (err as Error).message);
      }
    }

    return null;
  }

  private callGroq: ProviderCall = async (messages, opts, timeoutMs) => {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: ENV.GROQ_MODEL,
        messages,
        temperature: opts.temperature,
        max_tokens: opts.maxTokens,
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: timeoutMs,
      }
    );

    return response.data?.choices?.[0]?.message?.content || null;
  };

  private callGemini: ProviderCall = async (messages, opts, timeoutMs) => {
    const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${ENV.GEMINI_MODEL}:generateContent`,
      {
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        contents,
        generationConfig: { temperature: opts.temperature, maxOutputTokens: opts.maxTokens },
      },
      {
        headers: {
          "Content-Type": "application/json",
          // Header rather than ?key= so the key never appears in URLs or proxy logs
          "x-goog-api-key": ENV.GEMINI_API_KEY,
        },
        timeout: timeoutMs,
      }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  };

  private callOpenRouter: ProviderCall = async (messages, opts, timeoutMs) => {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: ENV.OPENROUTER_MODEL,
        messages,
        temperature: opts.temperature,
        max_tokens: opts.maxTokens,
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": ENV.CLIENT_URL,
          "X-Title": "ShopMind AI Assistant",
        },
        timeout: timeoutMs,
      }
    );

    return response.data?.choices?.[0]?.message?.content || null;
  };
}

export const llmService = new LLMService();
