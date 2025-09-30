# Test Design: Session Summary

## Unit Tests

### `lib/sessionSummary.ts`

#### `generateSummary(session: MoodSession): SessionSummary`
```typescript
✓ should extract main topics from messages
✓ should identify key insights from conversation
✓ should extract action items mentioned
✓ should calculate mood improvement
✓ should include coping tools used
✓ should calculate session duration
✓ should handle empty messages array
✓ should handle sessions with no improvement
```

#### `extractTopics(messages: Message[]): string[]`
```typescript
✓ should extract most frequent nouns
✓ should filter out common stopwords
✓ should return max 3 topics
✓ should handle short conversations
✓ should handle empty messages
```

#### `extractInsights(messages: Message[]): string[]`
```typescript
✓ should identify sentences with insight keywords
✓ should prioritize assistant messages
✓ should return max 2 insights
✓ should return generic insight if none found
```

#### `extractActions(messages: Message[]): string[]`
```typescript
✓ should identify action-oriented sentences
✓ should extract suggestions from AI
✓ should return max 3 actions
✓ should include coping tools as actions
```

## Component Tests

### `<SessionSummary />`
```typescript
✓ should render summary sections (topics, insights, actions)
✓ should display mood improvement stats
✓ should format duration correctly (Xm Ys)
✓ should show encouragement for improvement
✓ should show support for no improvement
✓ should have save/export button
✓ should have "start new session" button
✓ should animate in smoothly
```

## Integration Tests
```typescript
describe('Session summary after therapy', () => {
  ✓ User completes therapy session
  ✓ User rates post-mood
  ✓ Summary automatically generated
  ✓ Topics accurately reflect conversation
  ✓ At least one insight shown
  ✓ At least one action item shown
  ✓ Mood improvement displayed correctly
  ✓ User can save summary
  ✓ User can start new session
});
```