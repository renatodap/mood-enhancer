# Test Design: Mood Rating & Progress Tracking

## Test Coverage Requirements
- ≥80% code coverage
- All user flows tested
- Edge cases handled
- LocalStorage mocked

## Unit Tests

### `lib/moodTracking.ts`

#### `createSession(feeling: FeelingType, preRating: number): MoodSession`
```typescript
✓ should create session with valid feeling and rating
✓ should generate unique session ID
✓ should set startTime to current timestamp
✓ should throw error if preRating < 0
✓ should throw error if preRating > 10
✓ should throw error if invalid feeling type
✓ should initialize postRating as null
✓ should initialize messages as empty array
```

#### `completeSession(sessionId: string, postRating: number): MoodSession`
```typescript
✓ should update session with postRating
✓ should calculate improvement (pre - post)
✓ should set endTime
✓ should calculate sessionDuration
✓ should throw error if session not found
✓ should throw error if postRating < 0
✓ should throw error if postRating > 10
✓ should throw error if session already completed
```

#### `saveSessionToStorage(session: MoodSession): void`
```typescript
✓ should save session to localStorage
✓ should append to existing sessions array
✓ should limit to max 30 sessions (remove oldest)
✓ should handle localStorage quota exceeded
✓ should serialize dates correctly
```

#### `getSessionsFromStorage(): MoodSession[]`
```typescript
✓ should retrieve all sessions from localStorage
✓ should return empty array if no data
✓ should parse dates correctly
✓ should handle corrupted data gracefully
✓ should sort sessions by startTime (newest first)
```

#### `calculateProgressStats(sessions: MoodSession[]): ProgressStats`
```typescript
✓ should calculate average improvement across all sessions
✓ should identify most common feeling
✓ should determine best time of day
✓ should return 0 stats for empty sessions array
✓ should ignore incomplete sessions
✓ should handle sessions with no improvement
✓ should calculate sessions in last 7 days
✓ should calculate sessions in last 30 days
```

## Component Tests

### `<MoodRatingScale />`

```typescript
✓ should render 11 rating buttons (0-10)
✓ should call onChange when button clicked
✓ should highlight selected rating
✓ should show feeling-specific color theme
✓ should display label text
✓ should be keyboard accessible (arrow keys)
✓ should have proper ARIA labels
✓ should show hover state on buttons
```

### `<PreSessionRating />`

```typescript
✓ should display feeling-specific question
✓ should render MoodRatingScale component
✓ should disable continue button until rating selected
✓ should call onComplete with rating when continue clicked
✓ should animate in smoothly
✓ should prevent going back once rating selected
```

### `<PostSessionRating />`

```typescript
✓ should show previous rating for reference
✓ should render MoodRatingScale component
✓ should calculate improvement on submit
✓ should call onComplete with postRating
✓ should show encouragement message
✓ should handle same or worse rating gracefully
```

### `<SessionImprovement />`

```typescript
✓ should display pre and post ratings
✓ should calculate percentage improvement
✓ should show encouraging message for improvement
✓ should show supportive message for no/negative improvement
✓ should render progress bar visualization
✓ should have buttons to view progress or start new session
✓ should recommend professional help if consistently no improvement
```

### `<ProgressDashboard />`

```typescript
✓ should display total sessions count
✓ should show average improvement
✓ should list recent sessions with details
✓ should show most common feeling
✓ should display best time of day insight
✓ should render empty state when no sessions
✓ should format dates/times correctly
✓ should show improvement trend chart
✓ should filter sessions by date range
✓ should filter sessions by feeling type
```

## Integration Tests

### Full Mood Rating Flow

```typescript
describe('Complete therapy session with mood tracking', () => {
  ✓ User selects feeling 'overwhelmed'
  ✓ Pre-rating screen appears
  ✓ User rates mood as 8/10
  ✓ Therapy session begins
  ✓ User has conversation (mocked)
  ✓ User clicks "I feel better"
  ✓ Post-rating screen appears
  ✓ User rates mood as 4/10
  ✓ Improvement screen shows 50% improvement
  ✓ Session saved to localStorage
  ✓ User can access progress dashboard
  ✓ Progress dashboard shows new session
});
```

### LocalStorage Persistence

```typescript
describe('Data persistence across sessions', () => {
  ✓ Should save session data
  ✓ Should retrieve session data on reload
  ✓ Should handle max session limit (30)
  ✓ Should handle localStorage clear
  ✓ Should handle concurrent tab updates
  ✓ Should handle localStorage quota exceeded
});
```

## Edge Case Tests

```typescript
describe('Edge cases', () => {
  ✓ User closes app mid-session → incomplete session saved
  ✓ User rates post-session same as pre → show validation message
  ✓ User rates post-session worse → show support, suggest help
  ✓ Multiple sessions with no improvement → recommend professional therapy
  ✓ localStorage is full → delete oldest, save newest
  ✓ corrupted localStorage data → clear and start fresh
  ✓ User completes 0 messages but rates → valid session
  ✓ Timezone changes between sessions → handle correctly
});
```

## Performance Tests

```typescript
describe('Performance', () => {
  ✓ Rendering 30 sessions in dashboard < 100ms
  ✓ Calculating stats for 30 sessions < 50ms
  ✓ Saving session to localStorage < 10ms
  ✓ Loading sessions from localStorage < 20ms
});
```

## Accessibility Tests

```typescript
describe('Accessibility', () => {
  ✓ All interactive elements keyboard accessible
  ✓ Proper ARIA labels on rating scale
  ✓ Screen reader announces rating changes
  ✓ Focus management through modal flows
  ✓ Color contrast meets WCAG AA standards
  ✓ Touch targets ≥ 44x44px
});
```

## Test Data Fixtures

```typescript
export const mockSessions: MoodSession[] = [
  {
    id: 'session-1',
    feeling: 'overwhelmed',
    preRating: 8,
    postRating: 4,
    improvement: 4,
    startTime: new Date('2025-01-01T10:00:00'),
    endTime: new Date('2025-01-01T10:15:00'),
    sessionDuration: 900000, // 15 min
    messages: [/* mock messages */],
  },
  // ... more mock sessions
];
```

## Coverage Goals
- Statements: ≥80%
- Branches: ≥75%
- Functions: ≥85%
- Lines: ≥80%