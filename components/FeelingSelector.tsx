'use client';

import { FeelingOption, FeelingType } from '@/types';
import {
  Cloud,
  Frown,
  Zap,
  Heart,
  UserX,
  AlertCircle,
  BatteryLow,
  HelpCircle,
  Angry,
  CloudRain
} from 'lucide-react';

const FEELING_OPTIONS: FeelingOption[] = [
  {
    type: 'overwhelmed',
    label: 'Overwhelmed',
    emoji: '🌊',
    description: 'Too much on your plate',
    color: 'from-blue-400 to-blue-600',
  },
  {
    type: 'anxious',
    label: 'Anxious',
    emoji: '😰',
    description: 'Worried or nervous',
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    type: 'sad',
    label: 'Sad',
    emoji: '😢',
    description: 'Feeling down',
    color: 'from-indigo-400 to-indigo-600',
  },
  {
    type: 'stressed',
    label: 'Stressed',
    emoji: '😫',
    description: 'Under pressure',
    color: 'from-orange-400 to-orange-600',
  },
  {
    type: 'lonely',
    label: 'Lonely',
    emoji: '😔',
    description: 'Feeling disconnected',
    color: 'from-purple-400 to-purple-600',
  },
  {
    type: 'frustrated',
    label: 'Frustrated',
    emoji: '😤',
    description: 'Things aren\'t working out',
    color: 'from-red-400 to-red-600',
  },
  {
    type: 'tired',
    label: 'Tired',
    emoji: '😴',
    description: 'Exhausted or drained',
    color: 'from-gray-400 to-gray-600',
  },
  {
    type: 'confused',
    label: 'Confused',
    emoji: '😕',
    description: 'Uncertain or unclear',
    color: 'from-teal-400 to-teal-600',
  },
  {
    type: 'angry',
    label: 'Angry',
    emoji: '😠',
    description: 'Upset or irritated',
    color: 'from-rose-400 to-rose-600',
  },
  {
    type: 'worried',
    label: 'Worried',
    emoji: '😟',
    description: 'Concerned about something',
    color: 'from-cyan-400 to-cyan-600',
  },
];

interface FeelingSelectorProps {
  userName: string;
  onSelectFeeling: (feeling: FeelingType) => void;
}

export default function FeelingSelector({ userName, onSelectFeeling }: FeelingSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Hi {userName} 👋
        </h1>
        <p className="text-xl text-gray-600">
          How are you feeling today?
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {FEELING_OPTIONS.map((feeling) => (
          <button
            key={feeling.type}
            onClick={() => onSelectFeeling(feeling.type)}
            className={`bg-gradient-to-br ${feeling.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center space-y-2`}
          >
            <span className="text-4xl">{feeling.emoji}</span>
            <span className="font-semibold text-lg">{feeling.label}</span>
            <span className="text-xs opacity-90 text-center">
              {feeling.description}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Select the feeling that resonates most with you right now
        </p>
      </div>
    </div>
  );
}