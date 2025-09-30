'use client';

import { useState } from 'react';
import MoodRatingScale from './MoodRatingScale';

interface PostSessionRatingProps {
  preRating: number;
  onComplete: (postRating: number) => void;
}

export default function PostSessionRating({
  preRating,
  onComplete,
}: PostSessionRatingProps) {
  const [rating, setRating] = useState<number | null>(null);

  const handleSubmit = () => {
    if (rating !== null) {
      onComplete(rating);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 space-y-8 animate-fadeIn">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-light text-gray-800">
            How do you feel now?
          </h2>
          <p className="text-gray-600">
            You started at <span className="font-semibold text-indigo-600">{preRating}/10</span>
          </p>
        </div>

        <MoodRatingScale
          value={rating}
          onChange={setRating}
          label=""
        />

        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={rating === null}
            className="px-8 py-3 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none"
          >
            Complete Session
          </button>
        </div>
      </div>
    </div>
  );
}