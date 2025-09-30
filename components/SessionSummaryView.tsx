'use client';

import { SessionSummary } from '@/types';
import { X, Lightbulb, Target, Sparkles } from 'lucide-react';

interface SessionSummaryViewProps {
  summary: SessionSummary;
  onClose: () => void;
  onNewSession?: () => void;
}

export default function SessionSummaryView({
  summary,
  onClose,
  onNewSession,
}: SessionSummaryViewProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 my-8 space-y-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="text-5xl mb-2">📝</div>
          <h2 className="text-3xl font-light text-gray-800">Session Summary</h2>
          <p className="text-gray-600">
            Here's what we explored together today
          </p>
        </div>

        {/* Topics Discussed */}
        {summary.topics.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3>Topics We Explored</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.topics.map((topic, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {summary.insights.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3>Key Insights</h3>
            </div>
            <ul className="space-y-3">
              {summary.insights.map((insight, index) => (
                <li
                  key={index}
                  className="flex gap-3 p-4 bg-amber-50 rounded-xl"
                >
                  <span className="text-amber-600 font-bold text-lg mt-0.5">
                    •
                  </span>
                  <span className="text-gray-800 flex-1">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Items */}
        {summary.actionItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
              <Target className="w-5 h-5 text-emerald-500" />
              <h3>Things to Try</h3>
            </div>
            <ul className="space-y-3">
              {summary.actionItems.map((action, index) => (
                <li
                  key={index}
                  className="flex gap-3 p-4 bg-emerald-50 rounded-xl"
                >
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-gray-800 flex-1">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Empty State */}
        {summary.topics.length === 0 &&
          summary.insights.length === 0 &&
          summary.actionItems.length === 0 && (
            <div className="text-center py-8 space-y-3">
              <p className="text-gray-600">
                This was a brief session. Keep exploring your feelings in future
                sessions to gain more insights.
              </p>
            </div>
          )}

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
          >
            Close
          </button>
          {onNewSession && (
            <button
              onClick={onNewSession}
              className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 transition-all shadow-lg"
            >
              Start New Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}