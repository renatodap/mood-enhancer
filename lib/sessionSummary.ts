import { SessionSummary, Message } from '@/types';

const STORAGE_KEY = 'wellness_session_summaries';

/**
 * Extract key topics discussed in the conversation
 */
export function extractTopics(messages: Message[]): string[] {
  if (messages.length === 0) return [];

  const userMessages = messages.filter((m) => m.role === 'user');
  if (userMessages.length === 0) return [];

  const topics: string[] = [];
  const allText = userMessages.map((m) => m.content.toLowerCase()).join(' ');

  // Work/Career topics
  if (
    allText.match(
      /\b(work|job|career|deadline|project|boss|colleague|meeting|professional)\b/
    )
  ) {
    topics.push('Work & Career Stress');
  }

  // Relationship topics
  if (
    allText.match(
      /\b(family|friend|partner|relationship|spouse|parent|child|sibling)\b/
    )
  ) {
    topics.push('Relationships & Family');
  }

  // Boundaries & Self-Care
  if (
    allText.match(/\b(boundary|boundaries|no|guilt|prioritize|self-care|rest)\b/)
  ) {
    topics.push('Boundaries & Self-Care');
  }

  // Anxiety & Worry
  if (allText.match(/\b(anxious|anxiety|worry|worried|nervous|fear|scared)\b/)) {
    topics.push('Anxiety & Worry');
  }

  // Depression & Sadness
  if (
    allText.match(
      /\b(sad|sadness|depressed|depression|hopeless|empty|numb|lonely)\b/
    )
  ) {
    topics.push('Sadness & Low Mood');
  }

  // Stress & Overwhelm
  if (
    allText.match(
      /\b(stress|stressed|overwhelm|overwhelmed|too much|exhausted|burnout)\b/
    )
  ) {
    topics.push('Stress & Overwhelm');
  }

  // Decision Making
  if (
    allText.match(/\b(decide|decision|choice|choose|confused|uncertain|unsure)\b/)
  ) {
    topics.push('Decision Making');
  }

  // Sleep & Rest
  if (allText.match(/\b(sleep|tired|exhausted|insomnia|rest|energy)\b/)) {
    topics.push('Sleep & Energy');
  }

  return topics.slice(0, 3); // Return max 3 topics
}

/**
 * Extract meaningful insights from the conversation
 */
export function extractInsights(messages: Message[]): string[] {
  if (messages.length === 0) return [];

  const insights: string[] = [];
  const allText = messages.map((m) => m.content.toLowerCase()).join(' ');

  // Boundary insights
  if (allText.includes('guilt') && allText.match(/\b(no|boundary|boundaries)\b/)) {
    insights.push(
      'You recognize the connection between difficulty setting boundaries and feelings of guilt'
    );
  }

  // Overwhelm insights
  if (
    allText.includes('overwhelm') &&
    allText.match(/\b(too much|many|multiple|juggling)\b/)
  ) {
    insights.push('You identified specific commitments that are contributing to overwhelm');
  }

  // Pattern recognition
  if (allText.match(/\b(always|never|pattern|usually|often|tend to)\b/)) {
    insights.push('You noticed patterns in your thoughts or behaviors');
  }

  // Prioritization
  if (
    allText.match(/\b(prioritize|priority|priorities|important|urgent)\b/)
  ) {
    insights.push('You explored the need to prioritize and manage competing demands');
  }

  // Self-awareness
  if (allText.match(/\b(realize|realized|understand|see now|aware)\b/)) {
    insights.push('You gained new awareness about your situation');
  }

  // Support systems
  if (
    allText.match(/\b(help|support|talk|reach out|ask for|communicate)\b/)
  ) {
    insights.push('You considered reaching out for support or communicating your needs');
  }

  // Progress & Growth
  if (allText.match(/\b(better|improve|try|practice|work on|change)\b/)) {
    insights.push('You expressed willingness to try new approaches');
  }

  return insights.slice(0, 3); // Return max 3 insights
}

/**
 * Extract actionable items from the conversation
 */
export function extractActionItems(messages: Message[]): string[] {
  if (messages.length === 0) return [];

  const actions: string[] = [];
  const allText = messages.map((m) => m.content.toLowerCase()).join(' ');
  const userMessages = messages.filter((m) => m.role === 'user');

  // Check for explicit action statements
  const actionPhrases = [
    'i will',
    'i should',
    'i need to',
    'i want to',
    'i can',
    'maybe i',
    'i could',
  ];

  userMessages.forEach((msg) => {
    const lower = msg.content.toLowerCase();
    actionPhrases.forEach((phrase) => {
      if (lower.includes(phrase)) {
        // Extract the sentence containing the action phrase
        const sentences = msg.content.split(/[.!?]+/);
        sentences.forEach((sentence) => {
          if (sentence.toLowerCase().includes(phrase)) {
            const cleaned = sentence.trim();
            if (cleaned.length > 10 && actions.length < 3) {
              actions.push(cleaned);
            }
          }
        });
      }
    });
  });

  // If no explicit actions found, suggest based on topics discussed
  if (actions.length < 3) {
    if (allText.match(/\b(boundary|boundaries|no|guilt)\b/)) {
      actions.push('Practice setting small boundaries in low-stakes situations');
    }

    if (allText.match(/\b(prioritize|priority|too much|overwhelm)\b/)) {
      actions.push('List current commitments and identify what can be delegated or postponed');
    }

    if (allText.match(/\b(sleep|tired|exhausted|rest)\b/)) {
      actions.push('Establish a consistent sleep schedule for the next week');
    }
  }

  return actions.slice(0, 3); // Return max 3 action items
}

/**
 * Generate a complete session summary
 */
export function generateSummary(
  sessionId: string,
  messages: Message[]
): SessionSummary {
  return {
    sessionId,
    topics: extractTopics(messages),
    insights: extractInsights(messages),
    actionItems: extractActionItems(messages),
    createdAt: new Date(),
  };
}

/**
 * Save summary to localStorage
 */
export function saveSummary(summary: SessionSummary): void {
  try {
    const existing = getAllSummaries();
    const filtered = existing.filter((s) => s.sessionId !== summary.sessionId);
    const updated = [summary, ...filtered];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save summary', error);
  }
}

/**
 * Get summary for a specific session
 */
export function getSummary(sessionId: string): SessionSummary | null {
  try {
    const all = getAllSummaries();
    return all.find((s) => s.sessionId === sessionId) || null;
  } catch (error) {
    console.error('Failed to get summary', error);
    return null;
  }
}

/**
 * Get all summaries sorted by date descending
 */
export function getAllSummaries(): SessionSummary[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data) as SessionSummary[];
    return parsed
      .map((summary) => ({
        ...summary,
        createdAt: new Date(summary.createdAt),
      }))
      .sort(
        (a: SessionSummary, b: SessionSummary) =>
          b.createdAt.getTime() - a.createdAt.getTime()
      );
  } catch (error) {
    console.error('Failed to retrieve summaries', error);
    return [];
  }
}