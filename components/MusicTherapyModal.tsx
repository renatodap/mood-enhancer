'use client';

import { useState } from 'react';
import { FeelingType } from '@/types';
import { X, Music, Heart, Sparkles } from 'lucide-react';
import { getMusicForFeeling, Song, recordMusicUsage } from '@/lib/musicTherapy';

interface MusicTherapyModalProps {
  feeling: FeelingType;
  sessionId?: string;
  onClose: () => void;
}

type PhaseType = 'meet' | 'transition' | 'uplift';

const PHASE_INFO = {
  meet: {
    title: 'Meet You Where You Are',
    icon: Heart,
    description: 'Songs that validate and acknowledge your current feelings',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  transition: {
    title: 'Gentle Transition',
    icon: Sparkles,
    description: 'Songs that gently shift your emotional state',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  uplift: {
    title: 'Hope & Energy',
    icon: Music,
    description: 'Uplifting songs that inspire and energize',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
};

export default function MusicTherapyModal({
  feeling,
  sessionId,
  onClose,
}: MusicTherapyModalProps) {
  const [expandedPhase, setExpandedPhase] = useState<PhaseType | null>('meet');
  const [playingSong, setPlayingSong] = useState<string | null>(null);

  const musicSelection = getMusicForFeeling(feeling);
  const hasMusic =
    musicSelection.meet.length > 0 ||
    musicSelection.transition.length > 0 ||
    musicSelection.uplift.length > 0;

  const handleSongPlay = (songId: string) => {
    setPlayingSong(songId);
    if (sessionId) {
      recordMusicUsage(sessionId, songId, false);
    }
  };

  const renderSongCard = (song: Song) => {
    const isPlaying = playingSong === song.id;

    return (
      <div
        key={song.id}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{song.title}</h4>
              <p className="text-sm text-gray-600">{song.artist}</p>
            </div>
            <button
              onClick={() =>
                isPlaying ? setPlayingSong(null) : handleSongPlay(song.id)
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isPlaying
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isPlaying ? 'Hide' : 'Play'}
            </button>
          </div>

          {isPlaying && (
            <div className="mt-3 rounded-lg overflow-hidden animate-fadeIn">
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`}
                title={`${song.title} by ${song.artist}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPhaseSection = (phase: PhaseType, songs: Song[]) => {
    if (songs.length === 0) return null;

    const info = PHASE_INFO[phase];
    const Icon = info.icon;
    const isExpanded = expandedPhase === phase;

    return (
      <div key={phase} className="space-y-3">
        <button
          onClick={() => setExpandedPhase(isExpanded ? null : phase)}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
            isExpanded
              ? `${info.bgColor} ${info.borderColor}`
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${info.color}`} />
            <div className="text-left">
              <h3 className={`font-medium ${info.color}`}>{info.title}</h3>
              <p className="text-sm text-gray-600">{info.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{songs.length} songs</span>
            <span
              className={`text-gray-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </div>
        </button>

        {isExpanded && (
          <div className="space-y-3 pl-4 animate-fadeIn">
            {songs.map(renderSongCard)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50 overflow-y-auto">
      <div className="w-full max-w-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl shadow-2xl p-8 md:p-12 space-y-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/50 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="text-5xl mb-4">🎵</div>
          <h2 className="text-2xl md:text-3xl font-light text-gray-800">
            Music Therapy
          </h2>
          <p className="text-gray-600">
            Songs curated for when you&apos;re feeling{' '}
            <span className="font-medium text-indigo-600">
              {feeling}
            </span>
          </p>
        </div>

        {/* Therapeutic Approach Explanation */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-indigo-100">
          <h3 className="font-medium text-gray-800 mb-2">
            How Music Therapy Works
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            This playlist is designed with a therapeutic progression:{' '}
            <span className="font-medium">First</span>, we meet you where you are
            with songs that validate your feelings.{' '}
            <span className="font-medium">Then</span>, we gently transition your
            mood. <span className="font-medium">Finally</span>, we uplift you
            with hope and energy. Listen in order, or jump to what feels right.
          </p>
        </div>

        {hasMusic ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {renderPhaseSection('meet', musicSelection.meet)}
            {renderPhaseSection('transition', musicSelection.transition)}
            {renderPhaseSection('uplift', musicSelection.uplift)}
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <p className="text-gray-600">
              No music recommendations available for this feeling yet.
            </p>
            <p className="text-sm text-gray-500">
              We&apos;re constantly adding more songs!
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-100 transition-all border border-gray-200"
          >
            Close
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-center text-gray-500">
          Music can be a powerful tool for emotional regulation. Listen at a
          comfortable volume.
        </p>
      </div>
    </div>
  );
}