import Groq from 'groq-sdk';

export const MODEL = 'llama-3.1-70b-versatile';
export const TEMPERATURE = 0.7;
export const MAX_TOKENS = 500;

// Create Groq client lazily at runtime to ensure env vars are loaded
export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }

  return new Groq({
    apiKey: apiKey,
  });
}