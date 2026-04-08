'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FlashCard from '@/components/FlashCard';
import BottomNav from '@/components/BottomNav';
import { Flashcard, Subject } from '@/lib/types';
import { addWeakCard, updateProgress, getCachedCards, setCachedCards } from '@/lib/storage';

function FlashcardsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subject = (searchParams.get('subject') || 'Biology') as Subject;
  const topic = searchParams.get('topic') || '';

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  const loadCards = useCallback(async () => {
    setLoading(true);
    setError('');

    // Check cache first
    const cached = getCachedCards(subject, topic);
    if (cached && cached.length > 0) {
      setCards(cached);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate flashcards');
      }

      const data = await res.json();
      setCards(data.cards);
      setCachedCards(subject, topic, data.cards);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load flashcards';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [subject, topic]);

  useEffect(() => {
    if (topic) loadCards();
  }, [topic, loadCards]);

  const handleKnow = () => {
    updateProgress(true, topic);
    setCorrect((c) => c + 1);
    if (currentIndex + 1 >= cards.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleWrong = () => {
    const card = cards[currentIndex];
    addWeakCard(card);
    updateProgress(false, topic);
    setWrong((w) => w + 1);
    if (currentIndex + 1 >= cards.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const totalDone = correct + wrong;
  const accuracy = totalDone > 0 ? Math.round((correct / totalDone) * 100) : 0;

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-4xl mb-4">📚</p>
          <p className="text-lg font-semibold text-gray-700 mb-4">No topic selected</p>
          <button onClick={() => router.push('/')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <div>
            <p className="text-base font-semibold text-gray-800">Generating flashcards...</p>
            <p className="text-sm text-gray-500 mt-1">AI is creating NEET-focused cards for</p>
            <p className="text-sm font-semibold text-blue-600">{topic}</p>
          </div>
          <p className="text-xs text-gray-400">This takes 10–15 seconds</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 pb-24">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-4xl">⚠️</p>
          <p className="text-base font-semibold text-gray-800">Failed to generate flashcards</p>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>
          <p className="text-xs text-gray-500">Make sure your OpenAI API key is set in .env.local</p>
          <div className="flex gap-3">
            <button onClick={() => router.push('/')} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700">
              ← Home
            </button>
            <button onClick={loadCards} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sessionDone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 pb-24 bg-gray-50">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 p-6 space-y-5 text-center">
          <div className="text-5xl">{accuracy >= 70 ? '🎉' : accuracy >= 50 ? '💪' : '📖'}</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Session Complete!</h2>
            <p className="text-sm text-gray-500 mt-1">{topic}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xl font-bold text-gray-900">{totalDone}</p>
              <p className="text-xs text-gray-500">Total</p>
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

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-blue-600">{accuracy}%</p>
            <p className="text-sm text-gray-500 mt-1">Accuracy</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          {wrong > 0 && (
            <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-xl">
              ⚠️ {wrong} card{wrong > 1 ? 's' : ''} added to your Weak Cards
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/weak-cards')}
              className="flex-1 py-3 rounded-xl border-2 border-red-200 text-red-600 text-sm font-semibold"
            >
              Revise Weak 🎯
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold"
            >
              New Topic →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-gray-500 hover:text-gray-900 text-sm font-medium">
            ← Back
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">{topic}</p>
            <p className="text-xs text-gray-500">{subject}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-green-600">{correct} ✓</p>
            <p className="text-xs text-red-400">{wrong} ✗</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {cards[currentIndex] && (
          <FlashCard
            card={cards[currentIndex]}
            onKnow={handleKnow}
            onWrong={handleWrong}
            cardNumber={currentIndex + 1}
            total={cards.length}
          />
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    }>
      <FlashcardsContent />
    </Suspense>
  );
}
