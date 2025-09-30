import {
  getCopingToolsForFeeling,
  recordToolUsage,
  getAllToolUsage,
  getToolEffectiveness,
  COPING_TOOLS,
  BREATHING_PATTERNS,
} from '../copingTools';
import { FeelingType } from '@/types';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('copingTools', () => {
  describe('getCopingToolsForFeeling', () => {
    it('should return relevant tools for anxious feeling', () => {
      const tools = getCopingToolsForFeeling('anxious');

      expect(tools.length).toBeGreaterThan(0);
      tools.forEach((tool) => {
        expect(tool.feelings).toContain('anxious');
      });
    });

    it('should return tools for stressed feeling', () => {
      const tools = getCopingToolsForFeeling('stressed');

      expect(tools.length).toBeGreaterThan(0);
      expect(tools.some((t) => t.category === 'breathing')).toBe(true);
    });

    it('should return max 4 tools', () => {
      const tools = getCopingToolsForFeeling('overwhelmed');

      expect(tools.length).toBeLessThanOrEqual(4);
    });

    it('should sort by effectiveness score', () => {
      // Manually set some effectiveness scores
      COPING_TOOLS[0].effectivenessScore = 5;
      COPING_TOOLS[1].effectivenessScore = 3;

      const tools = getCopingToolsForFeeling('anxious');

      // Check that higher scores come first
      for (let i = 0; i < tools.length - 1; i++) {
        expect(tools[i].effectivenessScore).toBeGreaterThanOrEqual(
          tools[i + 1].effectivenessScore
        );
      }
    });

    it('should return at least 2 tools for any feeling', () => {
      const feelings = [
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

      feelings.forEach((feeling) => {
        const tools = getCopingToolsForFeeling(feeling as FeelingType);
        expect(tools.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('recordToolUsage', () => {
    it('should save tool usage to localStorage', () => {
      recordToolUsage('session-123', 'box-breathing', true, 5);

      const usage = getAllToolUsage();
      expect(usage).toHaveLength(1);
      expect(usage[0].toolId).toBe('box-breathing');
      expect(usage[0].sessionId).toBe('session-123');
      expect(usage[0].completed).toBe(true);
      expect(usage[0].helpfulRating).toBe(5);
    });

    it('should store incomplete tool sessions', () => {
      recordToolUsage('session-456', 'grounding-5-4-3-2-1', false);

      const usage = getAllToolUsage();
      expect(usage[0].completed).toBe(false);
      expect(usage[0].helpfulRating).toBeNull();
    });

    it('should limit to 100 most recent usages', () => {
      // Record 105 usages
      for (let i = 0; i < 105; i++) {
        recordToolUsage(`session-${i}`, 'box-breathing', true, 4);
      }

      const usage = getAllToolUsage();
      expect(usage).toHaveLength(100);
    });
  });

  describe('getAllToolUsage', () => {
    it('should return empty array if no data', () => {
      const usage = getAllToolUsage();
      expect(usage).toEqual([]);
    });

    it('should parse dates correctly', () => {
      recordToolUsage('session-789', 'box-breathing', true, 4);

      const usage = getAllToolUsage();
      expect(usage[0].startTime).toBeInstanceOf(Date);
    });

    it('should handle corrupted data', () => {
      localStorage.setItem('wellness_coping_tool_usage', 'corrupted');

      const usage = getAllToolUsage();
      expect(usage).toEqual([]);
    });
  });

  describe('getToolEffectiveness', () => {
    it('should calculate average rating', () => {
      recordToolUsage('session-1', 'box-breathing', true, 5);
      recordToolUsage('session-2', 'box-breathing', true, 3);

      const effectiveness = getToolEffectiveness('box-breathing');
      expect(effectiveness).toBe(4); // (5 + 3) / 2
    });

    it('should return 0 if tool never used', () => {
      const effectiveness = getToolEffectiveness('unused-tool');
      expect(effectiveness).toBe(0);
    });

    it('should ignore incomplete sessions', () => {
      recordToolUsage('session-1', 'box-breathing', true, 5);
      recordToolUsage('session-2', 'box-breathing', false); // incomplete

      const effectiveness = getToolEffectiveness('box-breathing');
      expect(effectiveness).toBe(5); // Only count completed
    });

    it('should ignore sessions without ratings', () => {
      recordToolUsage('session-1', 'box-breathing', true, 5);
      recordToolUsage('session-2', 'box-breathing', true, null); // no rating

      const effectiveness = getToolEffectiveness('box-breathing');
      expect(effectiveness).toBe(5);
    });
  });

  describe('BREATHING_PATTERNS', () => {
    it('should have box breathing pattern', () => {
      expect(BREATHING_PATTERNS.box).toBeDefined();
      expect(BREATHING_PATTERNS.box.inhale).toBe(4);
      expect(BREATHING_PATTERNS.box.exhale).toBe(4);
    });

    it('should have 4-7-8 breathing pattern', () => {
      expect(BREATHING_PATTERNS.fourSevenEight).toBeDefined();
      expect(BREATHING_PATTERNS.fourSevenEight.inhale).toBe(4);
      expect(BREATHING_PATTERNS.fourSevenEight.hold1).toBe(7);
      expect(BREATHING_PATTERNS.fourSevenEight.exhale).toBe(8);
    });
  });

  describe('COPING_TOOLS', () => {
    it('should have at least 5 tools', () => {
      expect(COPING_TOOLS.length).toBeGreaterThanOrEqual(5);
    });

    it('should have tools from each category', () => {
      const categories = COPING_TOOLS.map((t) => t.category);
      expect(categories).toContain('breathing');
      expect(categories).toContain('grounding');
      expect(categories).toContain('physical');
      expect(categories).toContain('cognitive');
    });

    it('should have proper structure for each tool', () => {
      COPING_TOOLS.forEach((tool) => {
        expect(tool.id).toBeDefined();
        expect(tool.name).toBeDefined();
        expect(tool.description).toBeDefined();
        expect(tool.category).toBeDefined();
        expect(Array.isArray(tool.feelings)).toBe(true);
        expect(tool.duration).toBeGreaterThan(0);
        expect(Array.isArray(tool.instructions)).toBe(true);
        expect(typeof tool.isInteractive).toBe('boolean');
      });
    });
  });
});