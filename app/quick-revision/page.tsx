'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FlashCard from '@/components/FlashCard';
import BottomNav from '@/components/BottomNav';
import Timer from '@/components/Timer';
import { Flashcard } from '@/lib/types';
import { getWeakCards, getAllCachedCards, updateProgress, addWeakCard, removeWeakCard } from '@/lib/storage';

const TIME_LIMIT = 15 * 60; // 15 minutes in seconds

export default function QuickRevisionPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [weakTopicsFound, setWeakTopicsFound] = useState<Set<string>>(new Set());

  // Prepare a mixed deck of cards
  const mixDeck = useCallback(() => {
    const weak = getWeakCards();
    const cached = getAllCachedCards();
    
    // De-duplicate cards based on ID
    const cardMap = new Map<string, Flashcard>();
    cached.forEach(c => cardMap.set(c.id, c));
    weak.forEach(c => cardMap.set(c.id, c as Flashcard));
    
    let mixed = Array.from(cardMap.values());
    
    // Shuffle
    for (let i = mixed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mixed[i], mixed[j]] = [mixed[j], mixed[i]];
    }
    
    setCards(mixed);
  }, []);

  useEffect(() => {
    mixDeck();
  }, [mixDeck]);

  const startSession = () => {
    setCorrect(0);
    setWrong(0);
    setCurrentIndex(0);
    setSessionDone(false);
    setWeakTopicsFound(new Set());
    setIsActive(true);
  };

  const endSession = useCallback(() => {
    setIsActive(false);
    setSessionDone(true);
  }, []);

  const handleKnow = () => {
    const card = cards[currentIndex];
    updateProgress(true, card.topic);
    removeWeakCard(card.id);
    setCorrect(c => c + 1);
    advance();
  };

  const handleWrong = () => {
    const card = cards[currentIndex];
    updateProgress(false, card.topic);
    addWeakCard(card);
    setWeakTopicsFound(prev => new Set(prev).add(card.topic));
    setWrong(w => w + 1);
    advance();
  };

  const advance = () => {
    if (currentIndex + 1 >= cards.length) {
      endSession();
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const totalDone = correct + wrong;
  const accuracy = totalDone > 0 ? Math.round((correct / totalDone) * 100) : 0;

  if (sessionDone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pb-24">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 p-6 space-y-5 text-center">
          <div className="text-5xl">{accuracy >= 70 ? '🎯' : '💪'}</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">15-Min Session Done!</h2>
            <p className="text-sm text-gray-500 mt-1">Great job pushing through.</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xl font-bold">{totalDone}</p>
              <p className="text-xs text-gray-500">Total Done</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xl font-bold text-green-600">{correct}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-xl font-bold text-red-500">{wrong}</p>
              <p className="text-xs text-gray-500">Wrong</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-blue-600">{accuracy}%</p>
            <p className="text-sm text-gray-500 mt-1">Accuracy</p>
          </div>

          {weakTopicsFound.size > 0 && (
            <div className="text-left mt-4 border border-amber-100 bg-amber-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-800 uppercase mb-2">Needs Review</p>
              <ul className="list-disc pl-4 text-sm text-amber-700 space-y-1">
                {Array.from(weakTopicsFound).map(t => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Home
            </button>
            <button
              onClick={() => {
                mixDeck();
                startSession();
              }}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all"
            >
              Go Again
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (isActive && cards[currentIndex]) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={endSession} className="text-gray-500 text-sm font-medium hover:text-gray-900">
              End Early
            </button>
            <Timer totalSeconds={TIME_LIMIT} onExpire={endSession} />
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{totalDone} done</p>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <FlashCard
            card={cards[currentIndex]}
            onKnow={handleKnow}
            onWrong={handleWrong}
            cardNumber={currentIndex + 1}
            total={cards.length}
          />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pb-24">
      <div className="w-full max-w-sm text-center">
        <div className="text-6xl mb-6">⏱️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">15-Minute Revision</h1>
        <p className="text-sm text-gray-500 mb-8 max-w-[280px] mx-auto">
          Test your memory across mixed subjects and topics. It&apos;s a race against the clock!
        </p>

        {cards.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-xl mb-3">📭</p>
            <p className="text-sm font-semibold text-gray-800 mb-1">No cards available</p>
            <p className="text-xs text-gray-500 mb-5">
              You need to generate some flashcards before starting quick mode.
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all"
            >
              Go Generate Cards →
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-center gap-6 mb-6">
              <div>
                <p className="text-xl font-bold text-gray-900">{cards.length}</p>
                <p className="text-xs text-gray-500">Cards In Deck</p>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div>
                <p className="text-xl font-bold text-gray-900">15</p>
                <p className="text-xs text-gray-500">Minutes</p>
              </div>
            </div>
            <button
              onClick={startSession}
              className="w-full py-4 text-white rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Start Timer ⚡
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
