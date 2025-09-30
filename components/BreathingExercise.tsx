'use client';

import { useState, useEffect } from 'react';
import { BreathingExerciseProps } from '@/types';
import { X } from 'lucide-react';

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export default function BreathingExercise({
  pattern,
  onComplete,
  onCancel,
}: BreathingExerciseProps) {
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<Phase>('inhale');
  const [timeLeft, setTimeLeft] = useState(pattern.inhale);
  const [isPaused, setIsPaused] = useState(false);

  const phaseLabels = {
    inhale: 'Breathe In',
    hold1: 'Hold',
    exhale: 'Breathe Out',
    hold2: 'Hold',
  };

  useEffect(() => {
    if (isPaused || currentCycle >= pattern.cycles) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          // Move to next phase
          const nextPhaseMap: Record<Phase, Phase> = {
            inhale: 'hold1',
            hold1: 'exhale',
            exhale: 'hold2',
            hold2: 'inhale',
          };

          const nextPhase = nextPhaseMap[currentPhase];

          // If returning to inhale, increment cycle
          if (nextPhase === 'inhale' && currentPhase === 'hold2') {
            setCurrentCycle((c) => c + 1);
          }

          // Skip phase if duration is 0
          if (pattern[nextPhase as keyof typeof pattern] === 0) {
            const skipMap: Record<Phase, Phase> = {
              hold1: 'exhale',
              hold2: 'inhale',
              inhale: 'hold1',
              exhale: 'hold2',
            };
            setCurrentPhase(skipMap[nextPhase]);
            return pattern[skipMap[nextPhase] as keyof typeof pattern] as number;
          }

          setCurrentPhase(nextPhase);
          return pattern[nextPhase as keyof typeof pattern] as number;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentPhase, isPaused, currentCycle, pattern]);

  useEffect(() => {
    if (currentCycle >= pattern.cycles) {
      onComplete();
    }
  }, [currentCycle, pattern.cycles, onComplete]);

  const progress = (currentCycle / pattern.cycles) * 100;
  const circleScale = currentPhase === 'inhale' ? 1.5 : currentPhase === 'exhale' ? 0.7 : 1.2;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 relative">
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-light text-gray-800">{pattern.name}</h2>
          <p className="text-gray-600">
            Cycle {currentCycle + 1} of {pattern.cycles}
          </p>
        </div>

        {/* Animated Breathing Circle */}
        <div className="flex items-center justify-center py-12">
          <div
            className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 transition-transform duration-[4000ms] ease-in-out flex items-center justify-center shadow-2xl"
            style={{
              transform: `scale(${circleScale})`,
            }}
          >
            <div className="text-center text-white">
              <p className="text-3xl font-light mb-2">{phaseLabels[currentPhase]}</p>
              <p className="text-5xl font-bold">{Math.ceil(timeLeft)}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium hover:bg-indigo-200 transition-all"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}