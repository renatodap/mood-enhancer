'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface GroundingExerciseProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface GroundingStep {
  id: string;
  prompt: string;
  count: number;
  icon: string;
}

const GROUNDING_STEPS: GroundingStep[] = [
  { id: 'see', prompt: 'things you can see', count: 5, icon: '👁️' },
  { id: 'touch', prompt: 'things you can touch', count: 4, icon: '✋' },
  { id: 'hear', prompt: 'things you can hear', count: 3, icon: '👂' },
  { id: 'smell', prompt: 'things you can smell', count: 2, icon: '👃' },
  { id: 'taste', prompt: 'things you can taste', count: 1, icon: '👅' },
];

export default function GroundingExercise({
  onComplete,
  onCancel,
}: GroundingExerciseProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string[]>>({
    see: [],
    touch: [],
    hear: [],
    smell: [],
    taste: [],
  });
  const [currentInput, setCurrentInput] = useState('');

  const currentStep = GROUNDING_STEPS[currentStepIndex];
  const currentResponses = responses[currentStep.id];
  const isStepComplete = currentResponses.length >= currentStep.count;
  const isLastStep = currentStepIndex === GROUNDING_STEPS.length - 1;
  const totalProgress =
    (currentStepIndex * 100) / GROUNDING_STEPS.length +
    (currentResponses.length / currentStep.count) * (100 / GROUNDING_STEPS.length);

  const handleAddResponse = () => {
    if (currentInput.trim() && currentResponses.length < currentStep.count) {
      setResponses({
        ...responses,
        [currentStep.id]: [...currentResponses, currentInput.trim()],
      });
      setCurrentInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddResponse();
    }
  };

  const handleRemoveResponse = (index: number) => {
    setResponses({
      ...responses,
      [currentStep.id]: currentResponses.filter((_, i) => i !== index),
    });
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

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
          <h2 className="text-2xl font-light text-gray-800">5-4-3-2-1 Grounding</h2>
          <p className="text-gray-600">Anchor yourself in the present moment</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 text-center">
            Step {currentStepIndex + 1} of {GROUNDING_STEPS.length}
          </p>
        </div>

        {/* Current Step */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-5xl">{currentStep.icon}</div>
            <h3 className="text-xl font-medium text-gray-800">
              Name {currentStep.count} {currentStep.prompt}
            </h3>
          </div>

          {/* Input Area */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Enter something you can ${currentStep.id}...`}
                disabled={isStepComplete}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleAddResponse}
                disabled={!currentInput.trim() || isStepComplete}
                className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>

            {/* Response List */}
            <div className="space-y-2">
              {currentResponses.map((response, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-indigo-50 rounded-lg p-3"
                >
                  <span className="text-gray-800">
                    {index + 1}. {response}
                  </span>
                  <button
                    onClick={() => handleRemoveResponse(index)}
                    className="p-1 hover:bg-indigo-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}

              {/* Empty Slots */}
              {Array.from({ length: currentStep.count - currentResponses.length }).map(
                (_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="flex items-center bg-gray-50 rounded-lg p-3 border-2 border-dashed border-gray-300"
                  >
                    <span className="text-gray-400">
                      {currentResponses.length + index + 1}. ...
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentStepIndex > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
          >
            Exit
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepComplete}
            className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLastStep ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}