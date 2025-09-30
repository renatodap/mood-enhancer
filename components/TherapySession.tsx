'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, FeelingType, MoodSession } from '@/types';
import { Loader2, Heart, Activity } from 'lucide-react';
import { generateMessageId } from '@/lib/sessionManager';
import PreSessionRating from './PreSessionRating';
import PostSessionRating from './PostSessionRating';
import SessionImprovement from './SessionImprovement';
import ProgressDashboard from './ProgressDashboard';
import CopingToolModal from './CopingToolModal';
import SessionSummaryView from './SessionSummaryView';
import {
  createSession,
  completeSession,
  saveSessionToStorage,
  getSessionsFromStorage,
  calculateProgressStats,
} from '@/lib/moodTracking';
import { recordToolUsage } from '@/lib/copingTools';
import { generateSummary, saveSummary, getSummary } from '@/lib/sessionSummary';

interface TherapySessionProps {
  feeling: FeelingType;
  userName: string;
  onChangeFeeling: () => void;
}

type ViewState =
  | 'pre-rating'
  | 'session'
  | 'post-rating'
  | 'improvement'
  | 'summary'
  | 'progress';

export default function TherapySession({
  feeling,
  userName,
  onChangeFeeling,
}: TherapySessionProps) {
  const [viewState, setViewState] = useState<ViewState>('pre-rating');
  const [currentSession, setCurrentSession] = useState<MoodSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAIMessage, setCurrentAIMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [showFeelBetter, setShowFeelBetter] = useState(false);
  const [showCopingTools, setShowCopingTools] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  // Pre-Session Rating
  const handlePreRatingComplete = (rating: number) => {
    const session = createSession(feeling, rating);
    setCurrentSession(session);
    setViewState('session');

    // Initial message from therapist
    const initialMessage: Message = {
      id: generateMessageId(),
      role: 'assistant',
      content: `Hi ${userName}. I can see you're feeling ${feeling}. I'm here to listen and help. Can you tell me more about what's going on?`,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    setCurrentAIMessage(initialMessage.content);
    setShowInput(true);
  };

  // Session Message Handling
  const sendMessage = async () => {
    if (!inputValue.trim() || isThinking || !currentSession) return;

    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Update session with new message
    setCurrentSession({
      ...currentSession,
      messages: updatedMessages,
    });

    setInputValue('');
    setShowInput(false);
    setIsThinking(true);
    setShowFeelBetter(false);
    setCurrentAIMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          feeling,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      setCurrentAIMessage(assistantMessage.content);
      setExchangeCount((prev) => prev + 1);
      setShowFeelBetter(true);

      // Update session with AI response
      setCurrentSession({
        ...currentSession,
        messages: finalMessages,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = "I'm having trouble responding right now. Please try again.";
      setCurrentAIMessage(errorMessage);
      const errorMsg: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, errorMsg];
      setMessages(finalMessages);
      setCurrentSession({
        ...currentSession!,
        messages: finalMessages,
      });
    } finally {
      setIsThinking(false);
      setShowInput(true);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFeelBetter = () => {
    setViewState('post-rating');
    setShowFeelBetter(false);
    setShowInput(false);
  };

  // Post-Session Rating
  const handlePostRatingComplete = (rating: number) => {
    if (!currentSession) return;

    const completedSession = completeSession(currentSession, rating);
    saveSessionToStorage(completedSession);
    setCurrentSession(completedSession);

    // Generate and save summary
    const summary = generateSummary(completedSession.id, completedSession.messages);
    saveSummary(summary);

    setViewState('improvement');
  };

  // Coping Tools
  const handleCopingToolComplete = (toolId: string, rating: number | null) => {
    if (currentSession) {
      recordToolUsage(currentSession.id, toolId, true, rating);
      setCurrentSession({
        ...currentSession,
        copingToolsUsed: [...currentSession.copingToolsUsed, toolId],
      });
    }
    setShowCopingTools(false);
  };

  // Progress Dashboard
  const handleViewProgress = () => {
    setViewState('progress');
  };

  const handleCloseProgress = () => {
    if (currentSession?.postRating !== null) {
      setViewState('improvement');
    } else {
      setViewState('session');
    }
  };

  const handleStartNewFromProgress = () => {
    // Reset everything for new session
    onChangeFeeling();
  };

  // Session Improvement
  const handleViewSummary = () => {
    setViewState('summary');
  };

  const handleStartNewFromImprovement = () => {
    onChangeFeeling();
  };

  // Session Summary
  const handleCloseSummary = () => {
    setViewState('improvement');
  };

  const handleStartNewFromSummary = () => {
    onChangeFeeling();
  };

  // Render current view
  if (viewState === 'pre-rating') {
    return (
      <PreSessionRating
        feeling={feeling}
        userName={userName}
        onComplete={handlePreRatingComplete}
      />
    );
  }

  if (viewState === 'post-rating') {
    return (
      <PostSessionRating
        preRating={currentSession?.preRating || 0}
        onComplete={handlePostRatingComplete}
      />
    );
  }

  if (viewState === 'improvement' && currentSession) {
    return (
      <SessionImprovement
        session={currentSession}
        onViewProgress={handleViewProgress}
        onViewSummary={handleViewSummary}
        onNewSession={handleStartNewFromImprovement}
      />
    );
  }

  if (viewState === 'progress') {
    const sessions = getSessionsFromStorage();
    const stats = calculateProgressStats(sessions);
    return (
      <ProgressDashboard
        progressData={{ sessions, stats }}
        onClose={handleCloseProgress}
        onStartNew={handleStartNewFromProgress}
      />
    );
  }

  if (viewState === 'summary' && currentSession) {
    const summary = getSummary(currentSession.id);
    if (summary) {
      return (
        <SessionSummaryView
          summary={summary}
          onClose={handleCloseSummary}
          onNewSession={handleStartNewFromSummary}
        />
      );
    }
  }

  // Main Session View
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-indigo-100/50">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-indigo-600">
            {feeling.charAt(0).toUpperCase() + feeling.slice(1)}
          </div>
          <button
            onClick={() => setShowCopingTools(true)}
            className="text-sm text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <Heart className="w-4 h-4" />
            Coping Tools
          </button>
          <button
            onClick={handleViewProgress}
            className="text-sm text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <Activity className="w-4 h-4" />
            Progress
          </button>
        </div>
        <button
          onClick={onChangeFeeling}
          className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          Change feeling
        </button>
      </div>

      {/* Therapeutic Space */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-xl">
          {isThinking ? (
            <div className="text-center space-y-5 animate-fadeIn">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <p className="text-gray-500 text-sm font-light tracking-wide">
                Listening...
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
              {currentAIMessage && (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-indigo-100/50">
                  <p className="text-lg md:text-xl text-gray-800 leading-relaxed text-center font-light">
                    {currentAIMessage}
                  </p>
                </div>
              )}

              {/* Feel Better Button */}
              {showFeelBetter && !isThinking && (
                <div className="flex justify-center animate-fadeIn">
                  <button
                    onClick={handleFeelBetter}
                    className="px-6 py-2.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 rounded-full transition-all border-2 border-emerald-200 shadow-sm"
                  >
                    I feel better now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      {showInput && (
        <div className="px-6 pb-6 animate-fadeIn">
          <div className="max-w-xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100/50 p-4">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="w-full resize-none border-none outline-none text-gray-800 placeholder-gray-400 bg-transparent font-light"
                rows={1}
                disabled={isThinking}
                style={{ maxHeight: '120px' }}
              />
              <div className="flex justify-end items-center mt-3 pt-3 border-t border-indigo-100/50">
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isThinking}
                  className="px-6 py-2 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crisis Resources */}
      <div className="px-6 py-3 bg-amber-50 border-t border-amber-100">
        <p className="text-xs text-center text-amber-800">
          Crisis? <strong>Call 988</strong> or <strong>Text HOME to 741741</strong>
        </p>
      </div>

      {/* Exchange counter */}
      {exchangeCount > 0 && (
        <div className="absolute top-20 right-6 text-xs text-gray-300">
          {exchangeCount} {exchangeCount === 1 ? 'exchange' : 'exchanges'}
        </div>
      )}

      {/* Coping Tools Modal */}
      {showCopingTools && currentSession && (
        <CopingToolModal
          feeling={feeling}
          onClose={() => setShowCopingTools(false)}
          onToolComplete={handleCopingToolComplete}
        />
      )}
    </div>
  );
}