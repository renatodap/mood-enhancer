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
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Minimal Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="text-sm text-gray-500">
          {feeling.charAt(0).toUpperCase() + feeling.slice(1)}
        </div>
        <button
          onClick={onChangeFeeling}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Change feeling
        </button>
      </div>

      {/* Therapeutic Space - Centered Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-xl">
          {/* AI Message Display */}
          {isThinking ? (
            <div className="text-center space-y-4 animate-fadeIn">
              <Loader2 className="w-7 h-7 text-purple-400 animate-spin mx-auto" />
              <p className="text-gray-400 text-sm">Listening...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {currentAIMessage && (
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center">
                  {currentAIMessage}
                </p>
              )}

              {/* Feel Better Button */}
              {showFeelBetter && !isThinking && (
                <div className="flex justify-center pt-4 animate-fadeIn">
                  <button
                    onClick={handleFeelBetter}
                    className="px-5 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-all border border-green-200"
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="w-full resize-none border-none outline-none text-gray-700 placeholder-gray-400"
                rows={1}
                disabled={isThinking}
                style={{ maxHeight: '120px' }}
              />
              <div className="flex justify-end items-center mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isThinking}
                  className="px-5 py-1.5 bg-purple-500 text-white text-sm rounded-full hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
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