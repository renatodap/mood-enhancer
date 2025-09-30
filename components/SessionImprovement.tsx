'use client';

import { SessionImprovementProps } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function SessionImprovement({
  preRating,
  postRating,
  feeling,
  onViewProgress,
  onStartNew,
}: SessionImprovementProps) {
  const improvement = preRating - postRating;
  const improvementPercent = preRating === 0 ? 0 : Math.round((improvement / preRating) * 100);

  const getEncouragementMessage = () => {
    if (improvement > 3) {
      return "That&apos;s significant progress! You did great work today.";
    } else if (improvement > 0) {
      return "Real progress. Every step forward counts.";
    } else if (improvement === 0) {
      return "Sometimes just showing up and talking is enough. You did that.";
    } else {
      return "It&apos;s okay that things feel harder right now. Please consider reaching out to a professional for additional support.";
    }
  };

  const getTrendIcon = () => {
    if (improvement > 0) return <TrendingUp className="w-8 h-8 text-emerald-500" />;
    if (improvement < 0) return <TrendingDown className="w-8 h-8 text-amber-500" />;
    return <Minus className="w-8 h-8 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 space-y-8 animate-fadeIn">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {getTrendIcon()}
          </div>

          <h2 className="text-3xl font-light text-gray-800">
            {improvement > 0 ? '✨ Progress Made' : improvement < 0 ? 'Tough Session' : 'You Showed Up'}
          </h2>

          <div className="flex justify-center items-center gap-4 text-4xl font-light">
            <span className="text-gray-400">{preRating}</span>
            <span className="text-gray-300">→</span>
            <span className={improvement > 0 ? 'text-emerald-600' : improvement < 0 ? 'text-amber-600' : 'text-gray-600'}>
              {postRating}
            </span>
          </div>

          {improvement !== 0 && (
            <p className="text-lg text-gray-600">
              {Math.abs(improvementPercent)}% {improvement > 0 ? 'improvement' : 'increase'}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {improvement > 0 && (
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000"
                style={{ width: `${improvementPercent}%` }}
              />
            </div>
          </div>
        )}

        <p className="text-center text-gray-700 leading-relaxed px-4">
          {getEncouragementMessage()}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={onViewProgress}
            className="flex-1 px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-200 rounded-full font-medium hover:bg-indigo-50 transition-all"
          >
            View Progress
          </button>
          <button
            onClick={onStartNew}
            className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 transition-all shadow-lg"
          >
            Start New Session
          </button>
        </div>

        {improvement < 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p className="font-medium">Consider Professional Support</p>
            <p className="mt-1">
              If you're consistently not feeling better or feeling worse, please reach out to a mental health professional.
              <span className="block mt-2 font-semibold">Crisis: Call 988 or text HOME to 741741</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}