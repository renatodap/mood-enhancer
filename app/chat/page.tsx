'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FeelingType } from '@/types';
import FeelingSelector from '@/components/FeelingSelector';
import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
  const [userName, setUserName] = useState<string>('');
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingType | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get userName from localStorage
    const storedName = localStorage.getItem('userName');
    if (!storedName) {
      router.push('/');
      return;
    }
    setUserName(storedName);
  }, [router]);

  const handleSelectFeeling = (feeling: FeelingType) => {
    setSelectedFeeling(feeling);
  };

  const handleChangeFeeling = () => {
    setSelectedFeeling(null);
  };

  if (!userName) {
    return null; // Loading state while checking localStorage
  }

  return (
    <div className="min-h-screen">
      {!selectedFeeling ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
          <FeelingSelector userName={userName} onSelectFeeling={handleSelectFeeling} />
        </div>
      ) : (
        <ChatInterface
          feeling={selectedFeeling}
          userName={userName}
          onChangeFeeling={handleChangeFeeling}
        />
      )}
    </div>
  );
}