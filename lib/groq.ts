import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const MODEL = 'llama-3.1-70b-versatile';
export const TEMPERATURE = 0.7;
export const MAX_TOKENS = 500;