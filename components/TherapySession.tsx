'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, FeelingType } from '@/types';
import { Loader2 } from 'lucide-react';
import { generateMessageId } from '@/lib/sessionManager';

interface TherapySessionProps {
  feeling: FeelingType;
  userName: string;
  onChangeFeeling: () => void;
}

export default function TherapySession({ feeling, userName, onChangeFeeling }: TherapySessionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAIMessage, setCurrentAIMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [showFeelBetter, setShowFeelBetter] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
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
  }, [feeling, userName]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isThinking) return;

    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    // Add to message history
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Clear input and show thinking state
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

      // Add to history and display
      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentAIMessage(assistantMessage.content);
      setExchangeCount((prev) => prev + 1);
      setShowFeelBetter(true);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = "I'm having trouble responding right now. Please try again.";
      setCurrentAIMessage(errorMessage);
      setMessages((prev) => [...prev, {
        id: generateMessageId(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      }]);
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
    const message: Message = {
      id: generateMessageId(),
      role: 'assistant',
      content: "I'm really glad to hear that. Remember, you can come back anytime you need support. Take care of yourself.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    setCurrentAIMessage(message.content);
    setShowFeelBetter(false);
    setShowInput(false);

    // Option to change feeling after feeling better
    setTimeout(() => {
      setShowInput(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Minimal Header */}
      <div className="px-6 py-5 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-indigo-100/50">
        <div className="text-sm font-medium text-indigo-600">
          {feeling.charAt(0).toUpperCase() + feeling.slice(1)}
        </div>
        <button
          onClick={onChangeFeeling}
          className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          Change feeling
        </button>
      </div>

      {/* Therapeutic Space - Centered Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-xl">
          {/* AI Message Display */}
          {isThinking ? (
            <div className="text-center space-y-5 animate-fadeIn">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <p className="text-gray-500 text-sm font-light tracking-wide">Listening...</p>
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

      {/* Input Area - Simple and Clean */}
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

      {/* Crisis Resources - Subtle */}
      <div className="px-6 py-3 bg-amber-50 border-t border-amber-100">
        <p className="text-xs text-center text-amber-800">
          Crisis? <strong>Call 988</strong> or <strong>Text HOME to 741741</strong>
        </p>
      </div>

      {/* Exchange counter - very subtle */}
      {exchangeCount > 0 && (
        <div className="absolute top-20 right-6 text-xs text-gray-300">
          {exchangeCount} {exchangeCount === 1 ? 'exchange' : 'exchanges'}
        </div>
      )}
    </div>
  );
}