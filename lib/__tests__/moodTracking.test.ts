import {
  createSession,
  completeSession,
  saveSessionToStorage,
  getSessionsFromStorage,
  calculateProgressStats,
  clearOldSessions,
} from '../moodTracking';
import { FeelingType, MoodSession } from '@/types';

// Mock localStorage
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('moodTracking', () => {
  describe('createSession', () => {
    it('should create session with valid feeling and rating', () => {
      const session = createSession('overwhelmed', 8);

      expect(session.id).toBeDefined();
      expect(session.feeling).toBe('overwhelmed');
      expect(session.preRating).toBe(8);
      expect(session.postRating).toBeNull();
      expect(session.improvement).toBeNull();
      expect(session.improvementPercent).toBeNull();
      expect(session.startTime).toBeInstanceOf(Date);
      expect(session.endTime).toBeNull();
      expect(session.sessionDuration).toBeNull();
      expect(session.messages).toEqual([]);
      expect(session.copingToolsUsed).toEqual([]);
    });

    it('should generate unique session IDs', () => {
      const session1 = createSession('anxious', 5);
      const session2 = createSession('sad', 7);

      expect(session1.id).not.toBe(session2.id);
    });

    it('should throw error if preRating < 0', () => {
      expect(() => createSession('stressed', -1)).toThrow('Rating must be between 0 and 10');
    });

    it('should throw error if preRating > 10', () => {
      expect(() => createSession('stressed', 11)).toThrow('Rating must be between 0 and 10');
    });

    it('should throw error if invalid feeling type', () => {
      expect(() => createSession('invalid' as FeelingType, 5)).toThrow('Invalid feeling type');
    });
  });

  describe('completeSession', () => {
    let session: MoodSession;

    beforeEach(() => {
      session = createSession('overwhelmed', 8);
    });

    it('should update session with postRating', () => {
      const completed = completeSession(session, 4);

      expect(completed.postRating).toBe(4);
      expect(completed.improvement).toBe(4); // 8 - 4
      expect(completed.improvementPercent).toBe(50); // 4/8 * 100
      expect(completed.endTime).toBeInstanceOf(Date);
      expect(completed.sessionDuration).toBeGreaterThanOrEqual(0); // Can be 0 if instant
    });

    it('should calculate negative improvement for worse rating', () => {
      const completed = completeSession(session, 9);

      expect(completed.improvement).toBe(-1); // 8 - 9
      expect(completed.improvementPercent).toBeLessThan(0);
    });

    it('should handle zero improvement', () => {
      const completed = completeSession(session, 8);

      expect(completed.improvement).toBe(0);
      expect(completed.improvementPercent).toBe(0);
    });

    it('should throw error if postRating < 0', () => {
      expect(() => completeSession(session, -1)).toThrow('Rating must be between 0 and 10');
    });

    it('should throw error if postRating > 10', () => {
      expect(() => completeSession(session, 11)).toThrow('Rating must be between 0 and 10');
    });

    it('should throw error if session already completed', () => {
      const completed = completeSession(session, 4);
      expect(() => completeSession(completed, 5)).toThrow('Session already completed');
    });
  });

  describe('saveSessionToStorage', () => {
    it('should save session to localStorage', () => {
      const session = createSession('anxious', 7);
      saveSessionToStorage(session);

      // Verify session was saved
      const savedSessions = getSessionsFromStorage();
      expect(savedSessions).toHaveLength(1);
      expect(savedSessions[0].id).toBe(session.id);
    });

    it('should append to existing sessions', () => {
      const session1 = createSession('sad', 6);
      const session2 = createSession('stressed', 8);

      saveSessionToStorage(session1);
      saveSessionToStorage(session2);

      const savedSessions = getSessionsFromStorage();
      expect(savedSessions).toHaveLength(2);
    });

    it('should limit to max 30 sessions', () => {
      // Create 35 sessions
      for (let i = 0; i < 35; i++) {
        const session = createSession('overwhelmed', 5);
        saveSessionToStorage(session);
      }

      const savedSessions = getSessionsFromStorage();
      expect(savedSessions).toHaveLength(30);
    });

    it('should serialize dates correctly', () => {
      const session = createSession('angry', 9);
      saveSessionToStorage(session);

      // Check that it was stored as string
      const rawData = localStorage.getItem('wellness_progress');
      expect(rawData).toBeDefined();
      const parsed = JSON.parse(rawData!);
      expect(typeof parsed[0].startTime).toBe('string');
    });
  });

  describe('getSessionsFromStorage', () => {
    it('should retrieve all sessions from localStorage', () => {
      const session1 = createSession('lonely', 7);
      const session2 = createSession('confused', 5);

      saveSessionToStorage(session1);
      saveSessionToStorage(session2);

      const sessions = getSessionsFromStorage();
      expect(sessions).toHaveLength(2);
    });

    it('should return empty array if no data', () => {
      const sessions = getSessionsFromStorage();
      expect(sessions).toEqual([]);
    });

    it('should parse dates correctly', () => {
      const session = createSession('worried', 6);
      saveSessionToStorage(session);

      const sessions = getSessionsFromStorage();
      expect(sessions[0].startTime).toBeInstanceOf(Date);
    });

    it('should handle corrupted data gracefully', () => {
      // Manually set corrupted data
      localStorage.setItem('wellness_progress', 'corrupted data');

      const sessions = getSessionsFromStorage();
      expect(sessions).toEqual([]);
    });

    it('should sort sessions by startTime (newest first)', () => {
      // Create sessions with slight time difference
      const old = createSession('sad', 5);
      setTimeout(() => {}, 10); // Small delay
      const recent = createSession('stressed', 7);

      saveSessionToStorage(old);
      saveSessionToStorage(recent);

      const sessions = getSessionsFromStorage();
      // Recent should be first (newest first)
      expect(sessions[0].id).toBe(recent.id);
    });
  });

  describe('calculateProgressStats', () => {
    it('should calculate average improvement', () => {
      const sessions: MoodSession[] = [
        { ...createSession('overwhelmed', 8), postRating: 4, improvement: 4, improvementPercent: 50 } as MoodSession,
        { ...createSession('anxious', 6), postRating: 2, improvement: 4, improvementPercent: 66.67 } as MoodSession,
      ];

      const stats = calculateProgressStats(sessions);
      expect(stats.averageImprovement).toBe(4);
    });

    it('should identify most common feeling', () => {
      const sessions: MoodSession[] = [
        createSession('overwhelmed', 8) as MoodSession,
        createSession('overwhelmed', 7) as MoodSession,
        createSession('anxious', 6) as MoodSession,
      ];

      const stats = calculateProgressStats(sessions);
      expect(stats.mostCommonFeeling).toBe('overwhelmed');
    });

    it('should return zero stats for empty array', () => {
      const stats = calculateProgressStats([]);
      expect(stats.totalSessions).toBe(0);
      expect(stats.averageImprovement).toBe(0);
    });

    it('should ignore incomplete sessions in calculations', () => {
      const sessions: MoodSession[] = [
        { ...createSession('sad', 8), postRating: 4, improvement: 4 } as MoodSession,
        createSession('stressed', 7) as MoodSession, // incomplete
      ];

      const stats = calculateProgressStats(sessions);
      expect(stats.completedSessions).toBe(1);
      expect(stats.totalSessions).toBe(2);
    });

    it('should calculate sessions in last 7 days', () => {
      const now = new Date();
      const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      const eightDaysAgo = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);

      const sessions: MoodSession[] = [
        { ...createSession('sad', 5), startTime: sixDaysAgo } as MoodSession,
        { ...createSession('stressed', 6), startTime: eightDaysAgo } as MoodSession,
      ];

      const stats = calculateProgressStats(sessions);
      expect(stats.sessionsLast7Days).toBe(1);
    });
  });

  describe('clearOldSessions', () => {
    it('should remove sessions older than 30 days', () => {
      const now = new Date();
      const twentyDaysAgo = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000);
      const fortyDaysAgo = new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000);

      const sessions: MoodSession[] = [
        { ...createSession('sad', 5), startTime: twentyDaysAgo } as MoodSession,
        { ...createSession('stressed', 6), startTime: fortyDaysAgo } as MoodSession,
      ];

      saveSessionToStorage(sessions[0]);
      saveSessionToStorage(sessions[1]);

      clearOldSessions();

      const remaining = getSessionsFromStorage();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].startTime).toEqual(twentyDaysAgo);
    });
  });
});