import Groq from 'groq-sdk';

// Don't throw error on import - let the API route handle it
// This prevents build-time errors when env vars aren't available
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy-key-for-build',
});

export const MODEL = 'llama-3.1-70b-versatile';
export const TEMPERATURE = 0.7;
export const MAX_TOKENS = 500;