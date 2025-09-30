import { NextRequest, NextResponse } from 'next/server';
import { groq, MODEL, TEMPERATURE, MAX_TOKENS } from '@/lib/groq';
import { getSystemPrompt } from '@/lib/prompts';
import { ChatRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'API key not configured. Please set GROQ_API_KEY environment variable.' },
        { status: 500 }
      );
    }

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

    console.log('Calling Groq API with model:', MODEL);

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
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      if (error.message.includes('API key') || error.message.includes('401') || error.message.includes('authentication')) {
        return NextResponse.json(
          { error: 'API authentication failed. Please check your Groq API key in environment variables.' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
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