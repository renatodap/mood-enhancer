'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('userName', name.trim());
      router.push('/chat');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="w-16 h-16 text-pink-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome
          </h1>
          <p className="text-gray-600">
            A safe space to talk about how you&apos;re feeling
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                What should I call you?
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              Continue
            </button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Important:</strong> This is not a substitute for professional mental health care.
              If you&apos;re in crisis, please contact a crisis helpline immediately.
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-sm text-gray-600">
        <div className="space-y-2">
          <p className="font-semibold">Crisis Resources 24/7:</p>
          <p>National Suicide Prevention Lifeline: <strong>988</strong></p>
          <p>Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong></p>
        </div>
      </footer>
    </div>
  );
}