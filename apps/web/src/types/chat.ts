import { Product } from './product';

export type MessageRole = 'user' | 'assistant' | 'system';

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
  recommendations?: ChatRecommendation[];
  actionPrompts?: string[];
}

export interface ConversationState {
  id: string;
  messages: ChatMessage[];
  isLoading: boolean;
  intent?: 'search' | 'compare' | 'recommend' | 'qa' | 'general';
}
