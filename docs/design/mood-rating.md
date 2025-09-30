# Feature: Mood Rating & Progress Tracking

## Problem
Users have no way to:
- Measure if the conversation actually helped them
- Track emotional progress over time
- See concrete evidence of improvement

ChatGPT doesn't do this. We will.

## Solution
Before/after mood rating system with persistent progress tracking.

## User Flow

### 1. Pre-Session Rating (After feeling selection, before conversation)
```
User selects "Overwhelmed"
↓
SCREEN: "On a scale of 0-10, how overwhelmed do you feel right now?"
[0] [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]
    ↑ Not at all              ↑ Extremely
↓
User selects "8"
↓
Store: { feeling: 'overwhelmed', preRating: 8, timestamp: Date }
↓
Begin therapy session
```

### 2. Post-Session Rating (After user clicks "I feel better")
```
User clicks "I feel better now"
↓
SCREEN: "How do you feel now on that same scale?"
[0] [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]
↓
User selects "4"
↓
Calculate improvement: 8 → 4 = -4 (50% improvement)
↓
Show encouragement: "That's real progress. You went from 8/10 to 4/10."
↓
Store session data
```

### 3. Progress History (Accessible from main screen)
```
SCREEN: Progress
━━━━━━━━━━━━━━━━━━━
📊 Your Journey

Last 7 Days:
🌊 Overwhelmed: 8→4, 7→3, 9→5
😰 Anxious: 6→2
Average improvement: 45%

Insights:
• You've improved in 5/5 sessions
• Best time: Mornings (avg improvement 52%)
• Most common feeling: Overwhelmed (3 times)
```

## Data Model

```typescript
interface MoodSession {
  id: string;
  feeling: FeelingType;
  preRating: number; // 0-10
  postRating: number | null; // 0-10, null if session incomplete
  improvement: number | null; // calculated: preRating - postRating
  startTime: Date;
  endTime: Date | null;
  messages: Message[]; // conversation history
  sessionDuration: number | null; // milliseconds
}

interface ProgressData {
  sessions: MoodSession[];
  stats: {
    totalSessions: number;
    averageImprovement: number;
    mostCommonFeeling: FeelingType;
    bestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  };
}
```

## Storage Strategy
- **LocalStorage** for MVP (client-side only)
- Key: `wellness_progress`
- Max storage: Last 30 sessions
- Future: Supabase for multi-device sync

## UI Components Needed

### 1. MoodRatingScale Component
```typescript
interface MoodRatingScaleProps {
  value: number | null;
  onChange: (rating: number) => void;
  label: string;
  feeling: FeelingType;
}
```

### 2. ProgressDashboard Component
```typescript
interface ProgressDashboardProps {
  progressData: ProgressData;
  onClose: () => void;
}
```

### 3. SessionImprovement Component (shown after post-rating)
```typescript
interface SessionImprovementProps {
  preRating: number;
  postRating: number;
  feeling: FeelingType;
  onContinue: () => void;
}
```

## Success Metrics
- 80%+ of users complete both pre and post ratings
- Average improvement ≥ 2 points
- Users return to check progress dashboard
- Positive feedback on seeing concrete improvement

## Visual Design

### Pre-Rating Screen
```
┌─────────────────────────────────────────┐
│  Before we begin...                     │
│                                         │
│  How overwhelmed do you feel right now? │
│                                         │
│  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐              │
│  │0│1│2│3│4│5│6│7│8│9│10│              │
│  └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘              │
│                                         │
│  Not at all ←─────────→ Extremely      │
│                                         │
│           [Continue]                    │
└─────────────────────────────────────────┘
```

### Improvement Feedback
```
┌─────────────────────────────────────────┐
│  ✨ Real Progress                       │
│                                         │
│  You went from 8/10 to 4/10             │
│  That's a 50% improvement!              │
│                                         │
│  ┌────────────┐                         │
│  │  8 → 4     │                         │
│  │  ████░░░░  │ (improvement bar)       │
│  └────────────┘                         │
│                                         │
│  This is meaningful. You did the work.  │
│                                         │
│  [See Progress] [Start New Session]     │
└─────────────────────────────────────────┘
```

## Edge Cases
- User closes app mid-session → Save incomplete session, allow resume
- User rates same or worse → Validate feelings, suggest professional help
- No improvement over multiple sessions → Recommend professional therapy
- LocalStorage full → Delete oldest sessions (keep last 30)

## Why This Beats ChatGPT
1. **Concrete evidence** - Not just "I feel better", but measurable improvement
2. **Pattern recognition** - See what times/feelings are hardest
3. **Motivation** - Visual progress encourages return visits
4. **Accountability** - Track if this actually helps
5. **Personalized insights** - Data-driven recommendations