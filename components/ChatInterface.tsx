'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, FeelingType } from '@/types';
import MessageBubble from './MessageBubble';
import { Send, Loader2, Smile, RefreshCw } from 'lucide-react';
import { generateMessageId } from '@/lib/sessionManager';

interface ChatInterfaceProps {
  feeling: FeelingType;
  userName: string;
  onChangeFeeling: () => void;
}

export default function ChatInterface({ feeling, userName, onChangeFeeling }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFeelBetter, setShowFeelBetter] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initial greeting from assistant
    const initialMessage: Message = {
      id: generateMessageId(),
      role: 'assistant',
      content: `Hi ${userName}! I can see you're feeling ${feeling}. I'm here to listen and help. Can you tell me more about what's going on?`,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [feeling, userName]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
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

      setMessages((prev) => [...prev, assistantMessage]);
      setShowFeelBetter(true);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
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
      content: "That's wonderful to hear! I'm glad I could help. Remember, you can come back anytime you need to talk. Take care of yourself! 💜",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    setShowFeelBetter(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-md px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smile className="w-6 h-6 text-purple-500" />
          <div>
            <h2 className="font-semibold text-gray-800">Wellness Chat</h2>
            <p className="text-xs text-gray-500">Feeling: {feeling}</p>
          </div>
        </div>
        <button
          onClick={onChangeFeeling}
          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Change feeling
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <p className="text-sm text-gray-500">Typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Action Buttons */}
      {showFeelBetter && !isLoading && (
        <div className="px-4 pb-2">
          <button
            onClick={handleFeelBetter}
            className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <Smile className="w-5 h-5" />
            I feel better now
          </button>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Footer with crisis resources */}
      <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-2">
        <p className="text-xs text-center text-yellow-800">
          <strong>Crisis?</strong> Call 988 or Text HOME to 741741
        </p>
      </div>
    </div>
  );
}