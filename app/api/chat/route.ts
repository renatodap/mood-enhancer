import { NextRequest, NextResponse } from 'next/server';
import { getGroqClient, MODEL, TEMPERATURE, MAX_TOKENS } from '@/lib/groq';
import { createOpenRouterCompletion, isOpenRouterAvailable } from '@/lib/openrouter';
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

    // Prepare messages
    const formattedMessages = [
      {
        role: 'system' as const,
        content: systemPrompt,
      },
      ...messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    let responseMessage: string | null = null;
    let usedFallback = false;
    let groqAttempted = false;

    // Try Groq first (preferred - faster and free)
    if (process.env.GROQ_API_KEY) {
      try {
        console.log('Attempting Groq API with model:', MODEL);
        groqAttempted = true;
        const groq = getGroqClient();
        const completion = await groq.chat.completions.create({
          messages: formattedMessages,
          model: MODEL,
          temperature: TEMPERATURE,
          max_tokens: MAX_TOKENS,
        });

        responseMessage = completion.choices[0]?.message?.content || null;

        // If response is empty or invalid, throw to trigger fallback
        if (!responseMessage || responseMessage.trim().length === 0) {
          throw new Error('Empty response from Groq');
        }

        console.log('✓ Groq API succeeded');
      } catch (groqError) {
        console.warn('Groq API failed:', groqError instanceof Error ? groqError.message : 'Unknown error');
        responseMessage = null; // Reset to try fallback
      }
    }

    // If Groq failed or wasn't available, try OpenRouter
    if (!responseMessage && isOpenRouterAvailable()) {
      try {
        console.log(groqAttempted ? 'Trying OpenRouter fallback...' : 'Using OpenRouter (Groq not configured)');
        responseMessage = await createOpenRouterCompletion(formattedMessages);
        usedFallback = true;
        console.log('✓ OpenRouter succeeded');
      } catch (openRouterError) {
        console.error('OpenRouter API failed:', openRouterError instanceof Error ? openRouterError.message : 'Unknown error');
        responseMessage = null;
      }
    }

    // If both failed, return error
    if (!responseMessage) {
      const errorMsg = groqAttempted && !isOpenRouterAvailable()
        ? 'Primary API unavailable. Please configure OPENROUTER_API_KEY as fallback.'
        : 'Both AI services are currently unavailable. Please try again in a moment.';

      return NextResponse.json(
        { error: errorMsg },
        { status: 503 }
      );
    }

    // Check for medical red flags (basic keyword detection)
    const shouldRecommendHelp = detectMedicalConcerns(responseMessage);

    return NextResponse.json({
      message: responseMessage,
      shouldRecommendHelp,
      _meta: usedFallback ? { provider: 'openrouter' } : { provider: 'groq' },
    });
  } catch (error) {
    console.error('Error in chat API:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

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