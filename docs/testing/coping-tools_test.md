# Test Design: Coping Tools

## Unit Tests

### `lib/copingTools.ts`

#### `getCopingToolsForFeeling(feeling: FeelingType): CopingTool[]`
```typescript
✓ should return 3-4 relevant tools for 'anxious'
✓ should return breathing exercises for 'stressed'
✓ should return physical release for 'angry'
✓ should return grounding for 'overwhelmed'
✓ should return at least 2 tools for any feeling
✓ should prioritize most effective tools first
```

#### `recordToolUsage(sessionId: string, toolId: string, completed: boolean, rating: number): void`
```typescript
✓ should save tool usage to localStorage
✓ should associate with current session
✓ should store completion status
✓ should store helpfulness rating
✓ should handle missing session gracefully
```

#### `getToolEffectiveness(toolId: string): number`
```typescript
✓ should calculate average rating from all uses
✓ should return 0 if tool never used
✓ should weight recent uses more heavily
✓ should ignore incomplete tool sessions
```

## Component Tests

### `<BreathingExercise />`
```typescript
✓ should render animated breathing circle
✓ should expand/contract with correct timing (4-4-4-4)
✓ should show "Breathe in" / "Hold" / "Breathe out" instructions
✓ should count cycles completed
✓ should allow user to pause/resume
✓ should call onComplete after 5 cycles
✓ should be responsive to screen size
✓ should have smooth animations
```

### `<GroundingExercise />`
```typescript
✓ should show 5-4-3-2-1 checklist
✓ should allow text input for each sense
✓ should mark items as complete
✓ should show progress (e.g., "2 of 5 complete")
✓ should call onComplete when all items filled
✓ should allow skipping items
```

### `<CopingToolModal />`
```typescript
✓ should display feeling-appropriate tools
✓ should render tool cards with name/description/duration
✓ should open tool when card clicked
✓ should show "Did this help?" rating after completion
✓ should close on backdrop click
✓ should be keyboard accessible (Esc to close)
```

## Integration Tests
```typescript
describe('Coping tools in therapy session', () => {
  ✓ User clicks "Need relief?" button
  ✓ Modal shows 3 tools for their feeling
  ✓ User selects "Box Breathing"
  ✓ Breathing exercise starts
  ✓ User completes 5 cycles
  ✓ "Did this help?" prompt appears
  ✓ User rates 4/5 stars
  ✓ Tool usage recorded
  ✓ User returns to conversation
  ✓ Tool availability increased for future sessions
});
```