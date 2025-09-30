import { FeelingType, MoodSession, ProgressStats } from '@/types';

const STORAGE_KEY = 'wellness_progress';
const MAX_SESSIONS = 30;
const VALID_FEELINGS: FeelingType[] = [
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
];

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate rating is within acceptable range
 */
function validateRating(rating: number): void {
  if (rating < 0 || rating > 10) {
    throw new Error('Rating must be between 0 and 10');
  }
}

/**
 * Validate feeling type
 */
function validateFeeling(feeling: FeelingType): void {
  if (!VALID_FEELINGS.includes(feeling)) {
    throw new Error('Invalid feeling type');
  }
}

/**
 * Create a new mood tracking session
 */
export function createSession(feeling: FeelingType, preRating: number): MoodSession {
  validateFeeling(feeling);
  validateRating(preRating);

  return {
    id: generateSessionId(),
    feeling,
    preRating,
    postRating: null,
    improvement: null,
    improvementPercent: null,
    startTime: new Date(),
    endTime: null,
    sessionDuration: null,
    messages: [],
    copingToolsUsed: [],
  };
}

/**
 * Complete a session with post-rating
 */
export function completeSession(session: MoodSession, postRating: number): MoodSession {
  if (session.postRating !== null) {
    throw new Error('Session already completed');
  }

  validateRating(postRating);

  const endTime = new Date();
  const sessionDuration = endTime.getTime() - session.startTime.getTime();
  const improvement = session.preRating - postRating;
  const improvementPercent = session.preRating === 0
    ? 0
    : Math.round((improvement / session.preRating) * 100);

  return {
    ...session,
    postRating,
    improvement,
    improvementPercent,
    endTime,
    sessionDuration,
  };
}

/**
 * Serialize dates for localStorage
 */
function serializeSessions(sessions: MoodSession[]): string {
  return JSON.stringify(sessions);
}

/**
 * Deserialize sessions from localStorage
 */
function deserializeSessions(data: string): MoodSession[] {
  try {
    const parsed = JSON.parse(data);
    return parsed.map((session: any) => ({
      ...session,
      startTime: new Date(session.startTime),
      endTime: session.endTime ? new Date(session.endTime) : null,
    }));
  } catch (error) {
    console.error('Failed to parse sessions from localStorage', error);
    return [];
  }
}

/**
 * Save session to localStorage
 */
export function saveSessionToStorage(session: MoodSession): void {
  try {
    const existing = getSessionsFromStorage();
    const updated = [session, ...existing];

    // Limit to max sessions (keep newest)
    const limited = updated.slice(0, MAX_SESSIONS);

    localStorage.setItem(STORAGE_KEY, serializeSessions(limited));
  } catch (error) {
    console.error('Failed to save session to localStorage', error);
  }
}

/**
 * Get all sessions from localStorage
 */
export function getSessionsFromStorage(): MoodSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }

    const sessions = deserializeSessions(data);

    // Sort by start time (newest first)
    return sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  } catch (error) {
    console.error('Failed to retrieve sessions from localStorage', error);
    return [];
  }
}

/**
 * Calculate time of day from date
 */
function getTimeOfDay(date: Date): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

/**
 * Calculate progress statistics from sessions
 */
export function calculateProgressStats(sessions: MoodSession[]): ProgressStats {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      completedSessions: 0,
      averageImprovement: 0,
      averageImprovementPercent: 0,
      mostCommonFeeling: null,
      bestTimeOfDay: null,
      sessionsLast7Days: 0,
      sessionsLast30Days: 0,
      feelingBreakdown: {} as Record<FeelingType, number>,
    };
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const completedSessions = sessions.filter((s) => s.postRating !== null);

  // Calculate averages
  const totalImprovement = completedSessions.reduce((sum, s) => sum + (s.improvement || 0), 0);
  const totalImprovementPercent = completedSessions.reduce(
    (sum, s) => sum + (s.improvementPercent || 0),
    0
  );
  const averageImprovement =
    completedSessions.length > 0 ? totalImprovement / completedSessions.length : 0;
  const averageImprovementPercent =
    completedSessions.length > 0 ? totalImprovementPercent / completedSessions.length : 0;

  // Find most common feeling
  const feelingCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    feelingCounts[s.feeling] = (feelingCounts[s.feeling] || 0) + 1;
  });
  const mostCommonFeeling = Object.entries(feelingCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as FeelingType | null;

  // Find best time of day (by improvement)
  const timeOfDayStats: Record<string, { improvement: number; count: number }> = {};
  completedSessions.forEach((s) => {
    const time = getTimeOfDay(s.startTime);
    if (!timeOfDayStats[time]) {
      timeOfDayStats[time] = { improvement: 0, count: 0 };
    }
    timeOfDayStats[time].improvement += s.improvement || 0;
    timeOfDayStats[time].count += 1;
  });

  const bestTimeOfDay = Object.entries(timeOfDayStats)
    .map(([time, stats]) => ({ time, avgImprovement: stats.improvement / stats.count }))
    .sort((a, b) => b.avgImprovement - a.avgImprovement)[0]?.time as
    | 'morning'
    | 'afternoon'
    | 'evening'
    | 'night'
    | null;

  // Count recent sessions
  const sessionsLast7Days = sessions.filter((s) => s.startTime >= sevenDaysAgo).length;
  const sessionsLast30Days = sessions.filter((s) => s.startTime >= thirtyDaysAgo).length;

  // Feeling breakdown
  const feelingBreakdown = VALID_FEELINGS.reduce((acc, feeling) => {
    acc[feeling] = sessions.filter((s) => s.feeling === feeling).length;
    return acc;
  }, {} as Record<FeelingType, number>);

  return {
    totalSessions: sessions.length,
    completedSessions: completedSessions.length,
    averageImprovement: Math.round(averageImprovement * 10) / 10,
    averageImprovementPercent: Math.round(averageImprovementPercent * 10) / 10,
    mostCommonFeeling,
    bestTimeOfDay,
    sessionsLast7Days,
    sessionsLast30Days,
    feelingBreakdown,
  };
}

/**
 * Remove sessions older than 30 days
 */
export function clearOldSessions(): void {
  const sessions = getSessionsFromStorage();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const recentSessions = sessions.filter((s) => s.startTime >= thirtyDaysAgo);

  localStorage.setItem(STORAGE_KEY, serializeSessions(recentSessions));
}