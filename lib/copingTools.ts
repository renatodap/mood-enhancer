import { CopingTool, BreathingPattern, FeelingType, CopingToolUsage } from '@/types';

const STORAGE_KEY_TOOL_USAGE = 'wellness_coping_tool_usage';

// Breathing Patterns
export const BREATHING_PATTERNS: Record<string, BreathingPattern> = {
  box: {
    name: 'Box Breathing',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    cycles: 5,
  },
  fourSevenEight: {
    name: '4-7-8 Breathing',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    cycles: 4,
  },
  deepBelly: {
    name: 'Deep Belly Breathing',
    inhale: 5,
    hold1: 2,
    exhale: 7,
    hold2: 0,
    cycles: 6,
  },
};

// All Available Coping Tools
export const COPING_TOOLS: CopingTool[] = [
  // Music Therapy - NEW!
  {
    id: 'music-therapy',
    name: 'Music Therapy',
    description: 'Listen to curated songs that match and uplift your mood',
    category: 'cognitive',
    feelings: [
      'overwhelmed',
      'anxious',
      'sad',
      'stressed',
      'lonely',
      'frustrated',
      'tired',
      'confused',
      'angry',
      'worried',
    ],
    duration: 300, // 5 minutes average
    instructions: [
      'Choose a song from the curated playlist',
      'Find a comfortable place to sit or lie down',
      'Listen with headphones for the best experience',
      'Let the music guide your emotions',
      'Notice how your body responds to the music',
    ],
    isInteractive: true,
    effectivenessScore: 0,
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Calm your nervous system with 4-4-4-4 breathing',
    category: 'breathing',
    feelings: ['anxious', 'stressed', 'overwhelmed', 'angry'],
    duration: 120, // seconds
    instructions: [
      'Breathe in for 4 seconds',
      'Hold for 4 seconds',
      'Breathe out for 4 seconds',
      'Hold for 4 seconds',
      'Repeat 5 times',
    ],
    isInteractive: true,
    effectivenessScore: 0,
  },
  {
    id: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    description: 'Fall into relaxation with this powerful technique',
    category: 'breathing',
    feelings: ['anxious', 'worried', 'tired', 'stressed'],
    duration: 90,
    instructions: [
      'Breathe in for 4 seconds',
      'Hold for 7 seconds',
      'Breathe out for 8 seconds',
      'Repeat 4 times',
    ],
    isInteractive: true,
    effectivenessScore: 0,
  },
  {
    id: 'grounding-5-4-3-2-1',
    name: '5-4-3-2-1 Grounding',
    description: 'Anchor yourself in the present moment',
    category: 'grounding',
    feelings: ['anxious', 'overwhelmed', 'confused', 'worried'],
    duration: 180,
    instructions: [
      'Name 5 things you can see',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste',
    ],
    isInteractive: true,
    effectivenessScore: 0,
  },
  {
    id: 'progressive-muscle-relaxation',
    name: 'Progressive Muscle Relaxation',
    description: 'Release physical tension systematically',
    category: 'physical',
    feelings: ['stressed', 'angry', 'frustrated', 'tired'],
    duration: 300,
    instructions: [
      'Tense your fists for 5 seconds, then release',
      'Tense your shoulders for 5 seconds, then release',
      'Tense your face for 5 seconds, then release',
      'Tense your stomach for 5 seconds, then release',
      'Notice the difference between tension and relaxation',
    ],
    isInteractive: false,
    effectivenessScore: 0,
  },
  {
    id: 'worry-dump',
    name: 'Worry Dump',
    description: 'Get worries out of your head and onto paper',
    category: 'cognitive',
    feelings: ['worried', 'overwhelmed', 'anxious', 'confused'],
    duration: 300,
    instructions: [
      'Write down everything you\'re worried about',
      'Don\'t edit, just dump',
      'Circle the things you can control',
      'For those, write one small action',
      'For the rest, practice letting go',
    ],
    isInteractive: false,
    effectivenessScore: 0,
  },
  {
    id: 'gentle-movement',
    name: 'Gentle Movement',
    description: 'Release stuck energy through simple movements',
    category: 'physical',
    feelings: ['sad', 'tired', 'lonely', 'frustrated'],
    duration: 180,
    instructions: [
      'Stand up and stretch your arms overhead',
      'Roll your shoulders back 5 times',
      'Gently shake out your hands and arms',
      'Take a short walk (even just around the room)',
      'Notice how your body feels after movement',
    ],
    isInteractive: false,
    effectivenessScore: 0,
  },
  {
    id: 'self-compassion',
    name: 'Self-Compassion Break',
    description: 'Speak kindly to yourself in this moment',
    category: 'cognitive',
    feelings: ['sad', 'lonely', 'frustrated', 'tired', 'overwhelmed'],
    duration: 120,
    instructions: [
      'Place your hand on your heart',
      'Say: "This is a moment of suffering"',
      'Say: "Suffering is part of life"',
      'Say: "May I be kind to myself in this moment"',
      'Take three deep breaths',
    ],
    isInteractive: false,
    effectivenessScore: 0,
  },
];

/**
 * Get coping tools appropriate for a specific feeling
 */
export function getCopingToolsForFeeling(feeling: FeelingType): CopingTool[] {
  return COPING_TOOLS
    .filter((tool) => tool.feelings.includes(feeling))
    .sort((a, b) => b.effectivenessScore - a.effectivenessScore)
    .slice(0, 4); // Return top 4 tools
}

/**
 * Record that a user used a coping tool
 */
export function recordToolUsage(
  sessionId: string,
  toolId: string,
  completed: boolean,
  rating: number | null = null
): void {
  try {
    const usage: CopingToolUsage = {
      id: `usage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      toolId,
      sessionId,
      startTime: new Date(),
      endTime: completed ? new Date() : null,
      completed,
      helpfulRating: rating,
    };

    const existing = getAllToolUsage();
    const updated = [usage, ...existing].slice(0, 100); // Keep last 100

    localStorage.setItem(STORAGE_KEY_TOOL_USAGE, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to record tool usage', error);
  }
}

/**
 * Get all recorded tool usage
 */
export function getAllToolUsage(): CopingToolUsage[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_TOOL_USAGE);
    if (!data) return [];

    const parsed = JSON.parse(data) as CopingToolUsage[];
    return parsed.map((usage) => ({
      ...usage,
      startTime: new Date(usage.startTime),
      endTime: usage.endTime ? new Date(usage.endTime) : null,
    }));
  } catch (error) {
    console.error('Failed to retrieve tool usage', error);
    return [];
  }
}

/**
 * Calculate effectiveness score for a tool based on user ratings
 */
export function getToolEffectiveness(toolId: string): number {
  const allUsage = getAllToolUsage();
  const toolUsage = allUsage.filter(
    (u) => u.toolId === toolId && u.completed && u.helpfulRating !== null
  );

  if (toolUsage.length === 0) return 0;

  const totalRating = toolUsage.reduce((sum, u) => sum + (u.helpfulRating || 0), 0);
  return totalRating / toolUsage.length;
}

/**
 * Update tool effectiveness scores based on usage
 */
export function updateToolEffectiveness(): void {
  COPING_TOOLS.forEach((tool) => {
    tool.effectivenessScore = getToolEffectiveness(tool.id);
  });
}