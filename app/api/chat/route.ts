import { NextRequest, NextResponse } from 'next/server';
import { groq, MODEL, TEMPERATURE, MAX_TOKENS } from '@/lib/groq';
import { getSystemPrompt } from '@/lib/prompts';
import { ChatRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, feeling } = body;

    if (!messages || !feeling) {
      return NextResponse.json(
        { error: 'Messages and feeling are required' },
        { status: 400 }
      );
    }

    // Get the system prompt for the specific feeling
    const systemPrompt = getSystemPrompt(feeling);

    // Prepare messages for Groq API
    const groqMessages = [
      {
        role: 'system' as const,
        content: systemPrompt,
      },
      ...messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: groqMessages,
      model: MODEL,
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
    });

    const responseMessage = completion.choices[0]?.message?.content ||
      "I'm here to help. Can you tell me more about what you're experiencing?";

    // Check for medical red flags (basic keyword detection)
    const shouldRecommendHelp = detectMedicalConcerns(responseMessage);

    return NextResponse.json({
      message: responseMessage,
      shouldRecommendHelp,
    });
  } catch (error) {
    console.error('Error in chat API:', error);

    // Handle Groq API specific errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API configuration error. Please check your Groq API key.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

function detectMedicalConcerns(text: string): boolean {
  const redFlags = [
    'suicide',
    'suicidal',
    'kill myself',
    'end my life',
    'self-harm',
    'self harm',
    'cutting myself',
    'hurt myself',
    'want to die',
    'better off dead',
    'professional help',
    'see a therapist',
    'talk to a doctor',
    'mental health professional',
  ];

  const lowerText = text.toLowerCase();
  return redFlags.some((flag) => lowerText.includes(flag));
}