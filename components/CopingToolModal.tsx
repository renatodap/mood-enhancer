'use client';

import { useState } from 'react';
import { CopingTool, BreathingPattern, FeelingType } from '@/types';
import { X, Clock, Sparkles } from 'lucide-react';
import BreathingExercise from './BreathingExercise';
import GroundingExercise from './GroundingExercise';
import { getCopingToolsForFeeling, BREATHING_PATTERNS } from '@/lib/copingTools';

interface CopingToolModalProps {
  feeling: FeelingType;
  onClose: () => void;
  onToolComplete: (toolId: string, rating: number | null) => void;
}

type ViewState = 'list' | 'instructions' | 'interactive';

export default function CopingToolModal({
  feeling,
  onClose,
  onToolComplete,
}: CopingToolModalProps) {
  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedTool, setSelectedTool] = useState<CopingTool | null>(null);
  const [showRating, setShowRating] = useState(false);

  const tools = getCopingToolsForFeeling(feeling);

  const handleSelectTool = (tool: CopingTool) => {
    setSelectedTool(tool);
    if (tool.isInteractive) {
      setViewState('interactive');
    } else {
      setViewState('instructions');
    }
  };

  const handleBackToList = () => {
    setViewState('list');
    setSelectedTool(null);
    setShowRating(false);
  };

  const handleToolComplete = () => {
    if (selectedTool) {
      setShowRating(true);
    }
  };

  const handleRating = (rating: number) => {
    if (selectedTool) {
      onToolComplete(selectedTool.id, rating);
      onClose();
    }
  };

  const handleSkipRating = () => {
    if (selectedTool) {
      onToolComplete(selectedTool.id, null);
      onClose();
    }
  };

  // List View
  if (viewState === 'list') {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="text-5xl mb-4">🧘</div>
            <h2 className="text-2xl font-light text-gray-800">Coping Tools</h2>
            <p className="text-gray-600">
              Choose a tool to help you feel better right now
            </p>
          </div>

          <div className="space-y-3">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleSelectTool(tool)}
                className="w-full text-left bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-indigo-100 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h3 className="text-lg font-medium text-gray-800">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.ceil(tool.duration / 60)} min
                      </span>
                      <span className="px-2 py-1 bg-white rounded-full capitalize">
                        {tool.category}
                      </span>
                      {tool.isInteractive && (
                        <span className="flex items-center gap-1 text-indigo-600">
                          <Sparkles className="w-3 h-3" />
                          Interactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
          >
            Maybe Later
          </button>
        </div>
      </div>
    );
  }

  // Instructions View (for non-interactive tools)
  if (viewState === 'instructions' && selectedTool) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 relative">
          <button
            onClick={handleBackToList}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-light text-gray-800">
              {selectedTool.name}
            </h2>
            <p className="text-gray-600">{selectedTool.description}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{Math.ceil(selectedTool.duration / 60)} minutes</span>
            </div>
          </div>

          {!showRating ? (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Follow these steps:
                </h3>
                <ol className="space-y-3">
                  {selectedTool.instructions.map((instruction, index) => (
                    <li
                      key={index}
                      className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl"
                    >
                      <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-medium text-sm">
                        {index + 1}
                      </span>
                      <span className="text-gray-800 pt-1">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBackToList}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleToolComplete}
                  className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 transition-all shadow-lg"
                >
                  I&apos;ve Completed This
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-6">
                <h3 className="text-xl font-light text-gray-800 text-center">
                  How helpful was this tool?
                </h3>
                <div className="flex justify-center items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRating(rating)}
                      className="w-14 h-14 rounded-full bg-white hover:bg-indigo-500 hover:text-white border-2 border-gray-300 hover:border-indigo-500 font-medium transition-all text-lg"
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-500 px-2">
                  <span>Not helpful</span>
                  <span>Very helpful</span>
                </div>
              </div>

              <button
                onClick={handleSkipRating}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
              >
                Skip Rating
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Interactive View (breathing or grounding)
  if (viewState === 'interactive' && selectedTool) {
    if (selectedTool.category === 'breathing') {
      const patternKey =
        selectedTool.id === 'box-breathing'
          ? 'box'
          : selectedTool.id === '4-7-8-breathing'
          ? 'fourSevenEight'
          : 'deepBelly';
      const pattern: BreathingPattern = BREATHING_PATTERNS[patternKey];

      return (
        <BreathingExercise
          pattern={pattern}
          onComplete={handleToolComplete}
          onCancel={handleBackToList}
        />
      );
    } else if (selectedTool.id === 'grounding-5-4-3-2-1') {
      return (
        <GroundingExercise
          onComplete={handleToolComplete}
          onCancel={handleBackToList}
        />
      );
    }
  }

  return null;
}