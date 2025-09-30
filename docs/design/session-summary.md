# Feature: Session Summary

## Problem
After therapy, users forget key insights and action items.
ChatGPT conversations disappear into history.

## Solution
Auto-generated session summary with key takeaways and next steps.

## When It Appears
After user clicks "I feel better" and completes post-rating.

## What It Includes

### 1. What You Talked About
- Main topics discussed (extracted from conversation)
- Core concern identified

### 2. Key Insights
- Realizations or reframes that emerged
- Patterns noticed
- What seemed to resonate

### 3. Action Items
- Concrete next steps mentioned
- Coping tools used
- Suggestions to try

### 4. Progress
- Mood improvement (pre → post rating)
- Time spent
- What helped most

## Data Model

```typescript
interface SessionSummary {
  sessionId: string;
  feeling: FeelingType;
  topics: string[]; // extracted keywords/themes
  keyInsights: string[]; // important realizations
  actionItems: string[]; // suggested next steps
  copingToolsUsed: string[];
  moodImprovement: {
    pre: number;
    post: number;
    change: number;
    percentChange: number;
  };
  duration: number; // milliseconds
  createdAt: Date;
}
```

## Generation Strategy

### Option A: AI-Generated (requires tokens)
Send conversation to LLM with prompt:
```
Analyze this therapy conversation and extract:
1. Main topic (1 sentence)
2. Key insight (1 sentence)
3. One action item (1 sentence)

Be brief and specific.
```

### Option B: Rule-Based (MVP - no extra tokens)
```typescript
// Extract from conversation:
- Topics: Most frequent nouns/keywords
- Insights: Sentences with "realize", "understand", "notice"
- Actions: Sentences with "try", "could", "might", "suggest"
```

## UI Design

```
┌─────────────────────────────────────────┐
│  Session Summary                         │
│  ────────────────                        │
│                                          │
│  📝 What we explored:                    │
│  Work stress and deadlines               │
│                                          │
│  💡 Key insight:                         │
│  Not everything needs to be done today   │
│                                          │
│  ✅ To try:                              │
│  • Break tasks into smaller pieces       │
│  • Use box breathing when overwhelmed    │
│                                          │
│  📊 Your progress:                       │
│  Started at 8/10 → Ended at 4/10         │
│  50% improvement in 12 minutes           │
│                                          │
│  [Save Summary] [Start New Session]      │
└─────────────────────────────────────────┘
```

## Storage
- Save to localStorage with session
- Allow export as text/PDF
- Future: Email summary to user

## Why This Beats ChatGPT
- **Structured takeaways** vs scrolling through chat
- **Persistent record** of progress
- **Actionable** - clear next steps
- **Motivating** - see concrete improvement
- **Shareable** - can show therapist if desired