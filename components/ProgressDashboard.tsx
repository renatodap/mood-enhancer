'use client';

import { ProgressDashboardProps } from '@/types';
import { X, TrendingUp, Calendar, Clock, Heart } from 'lucide-react';
import { format } from 'date-fns';

export default function ProgressDashboard({
  progressData,
  onClose,
  onStartNew,
}: ProgressDashboardProps) {
  const { sessions, stats } = progressData;
  const recentSessions = sessions.slice(0, 5);

  if (sessions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-light text-gray-800">Your Progress</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center py-12 space-y-4">
            <div className="text-6xl">📊</div>
            <p className="text-xl text-gray-600">No sessions yet</p>
            <p className="text-gray-500">
              Complete a therapy session to start tracking your progress
            </p>
            <button
              onClick={onStartNew}
              className="mt-6 px-6 py-3 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 transition-all"
            >
              Start Your First Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 my-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-light text-gray-800">Your Progress</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Total Sessions</span>
            </div>
            <p className="text-3xl font-light text-indigo-900">{stats.totalSessions}</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Avg Improvement</span>
            </div>
            <p className="text-3xl font-light text-emerald-900">
              {stats.averageImprovement.toFixed(1)} pts
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-purple-600">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">Most Common</span>
            </div>
            <p className="text-lg font-light text-purple-900 capitalize">
              {stats.mostCommonFeeling || 'N/A'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Best Time</span>
            </div>
            <p className="text-lg font-light text-amber-900 capitalize">
              {stats.bestTimeOfDay || 'N/A'}
            </p>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="space-y-4">
          <h3 className="text-xl font-light text-gray-800">Recent Sessions</h3>
          <div className="space-y-3">
            {recentSessions.map((session) => {
              const improvement = session.improvement || 0;
              const hasCompleted = session.postRating !== null;

              return (
                <div
                  key={session.id}
                  className="bg-gray-50 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {session.feeling === 'overwhelmed' && '🌊'}
                      {session.feeling === 'anxious' && '😰'}
                      {session.feeling === 'sad' && '😢'}
                      {session.feeling === 'stressed' && '😫'}
                      {session.feeling === 'lonely' && '😔'}
                      {session.feeling === 'frustrated' && '😤'}
                      {session.feeling === 'tired' && '😴'}
                      {session.feeling === 'confused' && '😕'}
                      {session.feeling === 'angry' && '😠'}
                      {session.feeling === 'worried' && '😟'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 capitalize">{session.feeling}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(session.startTime), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>

                  {hasCompleted ? (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {session.preRating} → {session.postRating}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          improvement > 0
                            ? 'text-emerald-600'
                            : improvement < 0
                            ? 'text-amber-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {improvement > 0 && '+'}
                        {improvement} pts
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Incomplete</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
          >
            Close
          </button>
          <button
            onClick={onStartNew}
            className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 transition-all shadow-lg"
          >
            Start New Session
          </button>
        </div>
      </div>
    </div>
  );
}