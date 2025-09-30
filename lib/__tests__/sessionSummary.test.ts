import {
  extractTopics,
  extractInsights,
  extractActionItems,
  generateSummary,
  saveSummary,
  getSummary,
  getAllSummaries,
} from '../sessionSummary';
import { Message } from '@/types';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('sessionSummary', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      role: 'user',
      content: "I'm feeling overwhelmed with work and personal responsibilities.",
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'assistant',
      content:
        "It sounds like you're juggling a lot right now. Let's explore what's causing the most stress.",
      timestamp: new Date(),
    },
    {
      id: '3',
      role: 'user',
      content:
        "I have three project deadlines this week and I'm also helping my family move.",
      timestamp: new Date(),
    },
    {
      id: '4',
      role: 'assistant',
      content:
        "Those are significant commitments. It's understandable you feel overwhelmed. Have you been able to set any boundaries?",
      timestamp: new Date(),
    },
    {
      id: '5',
      role: 'user',
      content:
        "Not really. I feel guilty saying no to anyone. Maybe I need to start prioritizing.",
      timestamp: new Date(),
    },
  ];

  describe('extractTopics', () => {
    it('should extract key topics from conversation', () => {
      const topics = extractTopics(mockMessages);

      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBeGreaterThan(0);
      expect(topics.length).toBeLessThanOrEqual(3);
      topics.forEach((topic) => {
        expect(typeof topic).toBe('string');
        expect(topic.length).toBeGreaterThan(0);
      });
    });

    it('should handle empty messages', () => {
      const topics = extractTopics([]);

      expect(topics).toEqual([]);
    });

    it('should extract work-related topics', () => {
      const topics = extractTopics(mockMessages);

      const topicsLowerCase = topics.map((t) => t.toLowerCase());
      const hasWorkTopic = topicsLowerCase.some(
        (t) =>
          t.includes('work') ||
          t.includes('deadline') ||
          t.includes('project') ||
          t.includes('stress')
      );

      expect(hasWorkTopic).toBe(true);
    });
  });

  describe('extractInsights', () => {
    it('should extract meaningful insights', () => {
      const insights = extractInsights(mockMessages);

      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.length).toBeLessThanOrEqual(3);
      insights.forEach((insight) => {
        expect(typeof insight).toBe('string');
        expect(insight.length).toBeGreaterThan(10);
      });
    });

    it('should identify patterns in conversation', () => {
      const insights = extractInsights(mockMessages);

      const insightsLowerCase = insights.map((i) => i.toLowerCase());
      const hasPattern = insightsLowerCase.some(
        (i) =>
          i.includes('boundary') ||
          i.includes('guilt') ||
          i.includes('priorit') ||
          i.includes('overwhelm')
      );

      expect(hasPattern).toBe(true);
    });

    it('should handle single message', () => {
      const singleMessage = [mockMessages[0]];
      const insights = extractInsights(singleMessage);

      expect(insights.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('extractActionItems', () => {
    it('should extract actionable items', () => {
      const actions = extractActionItems(mockMessages);

      expect(Array.isArray(actions)).toBe(true);
      expect(actions.length).toBeGreaterThan(0);
      expect(actions.length).toBeLessThanOrEqual(3);
      actions.forEach((action) => {
        expect(typeof action).toBe('string');
        expect(action.length).toBeGreaterThan(5);
      });
    });

    it('should extract boundary-related actions', () => {
      const actions = extractActionItems(mockMessages);

      const actionsLowerCase = actions.map((a) => a.toLowerCase());
      const hasBoundaryAction = actionsLowerCase.some(
        (a) =>
          a.includes('boundary') ||
          a.includes('prioritiz') ||
          a.includes('no') ||
          a.includes('limit')
      );

      expect(hasBoundaryAction).toBe(true);
    });

    it('should return empty array for no actionable content', () => {
      const nonActionableMessages: Message[] = [
        {
          id: '1',
          role: 'user',
          content: 'Hello',
          timestamp: new Date(),
        },
      ];

      const actions = extractActionItems(nonActionableMessages);

      expect(actions).toEqual([]);
    });
  });

  describe('generateSummary', () => {
    it('should generate complete summary', () => {
      const summary = generateSummary('session-123', mockMessages);

      expect(summary.sessionId).toBe('session-123');
      expect(Array.isArray(summary.topics)).toBe(true);
      expect(Array.isArray(summary.insights)).toBe(true);
      expect(Array.isArray(summary.actionItems)).toBe(true);
      expect(summary.createdAt).toBeInstanceOf(Date);
    });

    it('should include at least one topic', () => {
      const summary = generateSummary('session-456', mockMessages);

      expect(summary.topics.length).toBeGreaterThan(0);
    });

    it('should include at least one insight', () => {
      const summary = generateSummary('session-789', mockMessages);

      expect(summary.insights.length).toBeGreaterThan(0);
    });

    it('should handle minimal conversation', () => {
      const minimalMessages: Message[] = [
        {
          id: '1',
          role: 'user',
          content: "I'm feeling anxious.",
          timestamp: new Date(),
        },
        {
          id: '2',
          role: 'assistant',
          content: 'Tell me more about that.',
          timestamp: new Date(),
        },
      ];

      const summary = generateSummary('session-min', minimalMessages);

      expect(summary.topics.length).toBeGreaterThanOrEqual(0);
      expect(summary.insights.length).toBeGreaterThanOrEqual(0);
      expect(summary.actionItems.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('saveSummary', () => {
    it('should save summary to localStorage', () => {
      const summary = generateSummary('session-save', mockMessages);

      saveSummary(summary);

      const saved = getSummary('session-save');
      expect(saved).not.toBeNull();
      expect(saved?.sessionId).toBe('session-save');
    });

    it('should overwrite existing summary', () => {
      const summary1 = generateSummary('session-over', mockMessages);
      const summary2 = {
        ...summary1,
        topics: ['Updated topic'],
      };

      saveSummary(summary1);
      saveSummary(summary2);

      const saved = getSummary('session-over');
      expect(saved?.topics).toEqual(['Updated topic']);
    });

    it('should handle save errors gracefully', () => {
      const summary = generateSummary('session-error', mockMessages);

      jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new Error('Storage full');
      });

      expect(() => saveSummary(summary)).not.toThrow();
    });
  });

  describe('getSummary', () => {
    it('should retrieve saved summary', () => {
      const summary = generateSummary('session-get', mockMessages);
      saveSummary(summary);

      const retrieved = getSummary('session-get');

      expect(retrieved).not.toBeNull();
      expect(retrieved?.sessionId).toBe('session-get');
      expect(retrieved?.topics).toEqual(summary.topics);
    });

    it('should return null for non-existent summary', () => {
      const retrieved = getSummary('non-existent');

      expect(retrieved).toBeNull();
    });

    it('should parse dates correctly', () => {
      const summary = generateSummary('session-date', mockMessages);
      saveSummary(summary);

      const retrieved = getSummary('session-date');

      expect(retrieved?.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('getAllSummaries', () => {
    it('should retrieve all summaries', () => {
      const summary1 = generateSummary('session-1', mockMessages);
      const summary2 = generateSummary('session-2', mockMessages);

      saveSummary(summary1);
      saveSummary(summary2);

      const all = getAllSummaries();

      expect(all.length).toBe(2);
      expect(all.map((s) => s.sessionId)).toContain('session-1');
      expect(all.map((s) => s.sessionId)).toContain('session-2');
    });

    it('should return empty array when no summaries', () => {
      const all = getAllSummaries();

      expect(all).toEqual([]);
    });

    it('should sort by date descending', () => {
      const summary1 = generateSummary('session-old', mockMessages);
      summary1.createdAt = new Date('2024-01-01');

      const summary2 = generateSummary('session-new', mockMessages);
      summary2.createdAt = new Date('2024-12-01');

      saveSummary(summary1);
      saveSummary(summary2);

      const all = getAllSummaries();

      expect(all[0].sessionId).toBe('session-new');
      expect(all[1].sessionId).toBe('session-old');
    });
  });
});