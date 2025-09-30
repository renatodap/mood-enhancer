/**
 * OpenRouter API client - fallback when Groq is unavailable
 * Using cheapest/free models for cost efficiency
 */

// OpenRouter free models (no cost per request)
// Using DeepSeek as primary - free tier with good quality
export const OPENROUTER_MODEL = 'deepseek/deepseek-chat:free';
export const OPENROUTER_TEMPERATURE = 0.7;
export const OPENROUTER_MAX_TOKENS = 500;

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterChatRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface OpenRouterChatResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call OpenRouter chat completion API
 */
export async function createOpenRouterCompletion(
  messages: OpenRouterMessage[]
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const requestBody: OpenRouterChatRequest = {
    model: OPENROUTER_MODEL,
    messages,
    temperature: OPENROUTER_TEMPERATURE,
    max_tokens: OPENROUTER_MAX_TOKENS,
  };

  console.log('Calling OpenRouter API with model:', OPENROUTER_MODEL);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://mood-enhancer.vercel.app',
      'X-Title': 'Mental Wellness Chat',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenRouter API error:', response.status, errorText);
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data: OpenRouterChatResponse = await response.json();

  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from OpenRouter');
  }

  return content;
}

/**
 * Check if OpenRouter is available
 */
export function isOpenRouterAvailable(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}