'use client';

import { MoodRatingScaleProps } from '@/types';

export default function MoodRatingScale({
  value,
  onChange,
  label,
  feeling,
  disabled = false,
}: MoodRatingScaleProps) {
  const ratings = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-light text-gray-800 text-center">{label}</h3>

      <div className="flex justify-center items-center gap-2">
        {ratings.map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            disabled={disabled}
            aria-label={`Rate ${rating} out of 10`}
            className={`
              w-12 h-12 rounded-full font-medium transition-all
              ${
                value === rating
                  ? 'bg-indigo-500 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-700 hover:bg-indigo-100 border border-gray-200'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-indigo-400
            `}
          >
            {rating}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-sm text-gray-500 px-2">
        <span>Not at all</span>
        <span>Extremely</span>
      </div>
    </div>
  );
}