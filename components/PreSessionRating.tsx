'use client';

import { useState } from 'react';
import { FeelingType } from '@/types';
import MoodRatingScale from './MoodRatingScale';

interface PreSessionRatingProps {
  feeling: FeelingType;
  userName: string;
  onComplete: (rating: number) => void;
}

const FEELING_QUESTIONS: Record<FeelingType, string> = {
  overwhelmed: 'How overwhelmed do you feel right now?',
  anxious: 'How anxious are you feeling?',
  sad: 'How sad are you feeling?',
  stressed: 'How stressed do you feel?',
  lonely: 'How lonely are you feeling?',
  frustrated: 'How frustrated do you feel?',
  tired: 'How tired are you feeling?',
  confused: 'How confused do you feel?',
  angry: 'How angry are you feeling?',
  worried: 'How worried do you feel?',
};

export default function PreSessionRating({
  feeling,
  userName,
  onComplete,
}: PreSessionRatingProps) {
  const [rating, setRating] = useState<number | null>(null);

  const handleContinue = () => {
    if (rating !== null) {
      onComplete(rating);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 space-y-8 animate-fadeIn">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-light text-gray-800">
            Before we begin, {userName}...
          </h2>
          <p className="text-lg text-gray-600">
            {FEELING_QUESTIONS[feeling]}
          </p>
        </div>

        <MoodRatingScale
          value={rating}
          onChange={setRating}
          label=""
          feeling={feeling}
        />

        <div className="flex justify-center pt-4">
          <button
            onClick={handleContinue}
            disabled={rating === null}
            className="px-8 py-3 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none"
          >
            Continue
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center">
          This helps us track your progress
        </p>
      </div>
    </div>
  );
}