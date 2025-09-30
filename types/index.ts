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

// ============================================================================
// MOOD TRACKING & PROGRESS
// ============================================================================

export interface MoodSession {
  id: string;
  feeling: FeelingType;
  preRating: number; // 0-10
  postRating: number | null; // 0-10, null if incomplete
  improvement: number | null; // calculated: preRating - postRating
  improvementPercent: number | null; // percentage improvement
  startTime: Date;
  endTime: Date | null;
  sessionDuration: number | null; // milliseconds
  messages: Message[];
  copingToolsUsed: string[]; // tool IDs
}

export interface ProgressStats {
  totalSessions: number;
  completedSessions: number;
  averageImprovement: number;
  averageImprovementPercent: number;
  mostCommonFeeling: FeelingType | null;
  bestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | null;
  sessionsLast7Days: number;
  sessionsLast30Days: number;
  feelingBreakdown: Record<FeelingType, number>;
}

export interface ProgressData {
  sessions: MoodSession[];
  stats: ProgressStats;
}

// ============================================================================
// COPING TOOLS
// ============================================================================

export type CopingToolCategory = 'breathing' | 'grounding' | 'physical' | 'cognitive';

export interface CopingTool {
  id: string;
  name: string;
  description: string;
  category: CopingToolCategory;
  feelings: FeelingType[]; // which feelings this helps
  duration: number; // seconds
  instructions: string[];
  isInteractive: boolean;
  effectivenessScore: number; // 0-5, based on user ratings
}

export interface CopingToolUsage {
  id: string;
  toolId: string;
  sessionId: string;
  startTime: Date;
  endTime: Date | null;
  completed: boolean;
  helpfulRating: number | null; // 1-5 stars
}

export interface BreathingPattern {
  name: string;
  inhale: number; // seconds
  hold1: number; // seconds (after inhale)
  exhale: number; // seconds
  hold2: number; // seconds (after exhale)
  cycles: number; // recommended number of cycles
}

// ============================================================================
// SESSION SUMMARY
// ============================================================================

export interface SessionSummary {
  sessionId: string;
  feeling: FeelingType;
  topics: string[]; // main topics discussed
  keyInsights: string[]; // important realizations
  actionItems: string[]; // suggested next steps
  copingToolsUsed: string[]; // tool names
  moodImprovement: {
    pre: number;
    post: number;
    change: number;
    percentChange: number;
  };
  duration: number; // milliseconds
  createdAt: Date;
}

// ============================================================================
// UI COMPONENT PROPS
// ============================================================================

export interface MoodRatingScaleProps {
  value: number | null;
  onChange: (rating: number) => void;
  label: string;
  feeling: FeelingType;
  disabled?: boolean;
}

export interface SessionImprovementProps {
  preRating: number;
  postRating: number;
  feeling: FeelingType;
  onViewProgress: () => void;
  onStartNew: () => void;
}

export interface ProgressDashboardProps {
  progressData: ProgressData;
  onClose: () => void;
  onStartNew: () => void;
}

export interface CopingToolCardProps {
  tool: CopingTool;
  onSelect: (toolId: string) => void;
}

export interface BreathingExerciseProps {
  pattern: BreathingPattern;
  onComplete: () => void;
  onCancel: () => void;
}

export interface SessionSummaryProps {
  summary: SessionSummary;
  onSave: () => void;
  onStartNew: () => void;
  onClose: () => void;
}