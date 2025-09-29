export type FeelingType =
  | 'overwhelmed'
  | 'anxious'
  | 'sad'
  | 'stressed'
  | 'lonely'
  | 'frustrated'
  | 'tired'
  | 'confused'
  | 'angry'
  | 'worried';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Session {
  id: string;
  userName: string;
  feeling: FeelingType;
  messages: Message[];
  startTime: Date;
}

export interface FeelingOption {
  type: FeelingType;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

export interface ChatRequest {
  messages: Message[];
  feeling: FeelingType;
}

export interface ChatResponse {
  message: string;
  shouldRecommendHelp?: boolean;
}