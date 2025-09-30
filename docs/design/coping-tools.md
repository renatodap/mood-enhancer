# Feature: Instant Coping Tools

## Problem
Users in distress need IMMEDIATE relief tools, not just conversation.
ChatGPT gives advice in text. We provide interactive tools.

## Solution
Feeling-specific interactive coping tools accessible at any time.

## Tool Categories

### 1. Breathing Exercises
**Visual, guided, interactive**

Types:
- Box Breathing (4-4-4-4) - for anxiety, stress
- 4-7-8 Breathing - for sleep, calm
- Deep Belly Breathing - for overwhelm

UI: Animated circle that expands/contracts with breathing rhythm

### 2. Grounding Techniques
**5-4-3-2-1 Sensory Exercise**
- Interactive checklist
- Name 5 things you see
- Name 4 things you can touch
- Name 3 things you hear
- Name 2 things you smell
- Name 1 thing you taste

### 3. Physical Release
**For anger, frustration, stress**
- Progressive muscle relaxation guide
- Movement suggestions (shake, stretch, walk)
- Ice/cold water technique

### 4. Thought Reframing
**For anxious, worried, overwhelmed**
- Worry dump (write it out)
- Evidence for/against fear
- Best/worst/likely outcome

## Data Model

```typescript
interface CopingTool {
  id: string;
  name: string;
  category: 'breathing' | 'grounding' | 'physical' | 'cognitive';
  feelings: FeelingType[]; // which feelings this helps
  duration: number; // seconds
  instructions: string[];
  isInteractive: boolean;
}

interface CopingToolUsage {
  toolId: string;
  sessionId: string;
  startTime: Date;
  completed: boolean;
  helpfulRating: number | null; // 1-5 stars
}
```

## UI Flow

```
Therapy session in progress
↓
User sees button: "Need immediate relief? Try a coping tool"
↓
Modal opens with 3 tools specific to their feeling
↓
User selects "Box Breathing"
↓
Interactive breathing guide starts
↓
After completion: "Did this help?" [Not much 1-5 Helped a lot]
↓
Return to conversation with tool recorded
```

## Why This Beats ChatGPT
- **Interactive, not just text**
- **Immediate, requires no reading**
- **Guided experience**
- **Tracks what actually helps**
- **Always accessible**