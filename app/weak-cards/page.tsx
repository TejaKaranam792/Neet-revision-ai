'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FlashCard from '@/components/FlashCard';
import BottomNav from '@/components/BottomNav';
import { WeakCard } from '@/lib/types';
import { getWeakCards, addWeakCard, removeWeakCard, updateProgress } from '@/lib/storage';
import { SUBJECT_COLORS } from '@/lib/topics';

export default function WeakCardsPage() {
  const router = useRouter();
  const [weakCards, setWeakCards] = useState<WeakCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<WeakCard[]>([]);

  useEffect(() => {
    const cards = getWeakCards();
    // Sort by failCount descending (most problematic first)
    cards.sort((a, b) => b.failCount - a.failCount);
    setWeakCards(cards);
  }, []);

  const startReview = () => {
    const queue = [...weakCards];
    setReviewQueue(queue);
    setCurrentIndex(0);
    setCorrect(0);
    setWrong(0);
    setSessionDone(false);
    setIsReviewing(true);
  };

  const handleKnow = () => {
    const card = reviewQueue[currentIndex];
    // Remove from weak cards since they got it right
    removeWeakCard(card.id);
    updateProgress(true, card.topic);
    setCorrect((c) => c + 1);
    advance();
  };

  const handleWrong = () => {
    const card = reviewQueue[currentIndex];
    // Increment fail count
    addWeakCard(card);
    updateProgress(false, card.topic);
    setWrong((w) => w + 1);
    advance();
  };

  const advance = () => {
    if (currentIndex + 1 >= reviewQueue.length) {
      setSessionDone(true);
      // Refresh weak cards
      setWeakCards(getWeakCards());
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  // Group weak cards by subject for the overview
  const bySubject = weakCards.reduce<Record<string, WeakCard[]>>((acc, card) => {
    if (!acc[card.subject]) acc[card.subject] = [];
    acc[card.subject].push(card);
    return acc;
  }, {});

  const totalAccuracy =
    correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

  if (sessionDone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pb-24">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 p-6 space-y-5 text-center">
          <div className="text-5xl">{totalAccuracy >= 70 ? '🎉' : '💪'}</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Weak Card Session Done!</h2>
            <p className="text-sm text-gray-500 mt-1">Keep pushing — you&apos;re getting stronger</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xl font-bold">{correct + wrong}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xl font-bold text-green-600">{correct}</p>
              <p className="text-xs text-gray-500">Fixed ✓</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-xl font-bold text-red-500">{wrong}</p>
              <p className="text-xs text-gray-500">Still Weak</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-blue-600">{totalAccuracy}%</p>
            <p className="text-sm text-gray-500 mt-1">Session Accuracy</p>
          </div>
          {correct > 0 && (
            <p className="text-sm text-green-700 bg-green-50 p-3 rounded-xl">
              ✅ {correct} card{correct > 1 ? 's' : ''} removed from Weak Cards!
            </p>
          )}
          <div className="flex gap-3">
            <button onClick={() => { setIsReviewing(false); setSessionDone(false); }} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-semibold">
              View List
            </button>
            <button onClick={() => router.push('/')} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold">
              Home →
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (isReviewing && reviewQueue[currentIndex]) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setIsReviewing(false)} className="text-gray-500 text-sm font-medium">
              ← Stop
            </button>
            <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              🎯 Weak Cards Revision
            </p>
            <div className="text-right">
              <p className="text-sm font-bold text-green-600">{correct} ✓</p>
              <p className="text-xs text-red-400">{wrong} ✗</p>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <FlashCard
            card={reviewQueue[currentIndex]}
            onKnow={handleKnow}
            onWrong={handleWrong}
            cardNumber={currentIndex + 1}
            total={reviewQueue.length}
          />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-lg font-bold text-gray-900">🎯 Weak Areas</h1>
          <p className="text-xs text-gray-500">{weakCards.length} cards need revision</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        {weakCards.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🌟</p>
            <p className="text-lg font-semibold text-gray-800">No weak cards!</p>
            <p className="text-sm text-gray-500 mt-2 mb-6">
              You haven&apos;t marked any cards as wrong yet.
              <br />Start a flashcard session to track weak areas.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm"
            >
              Start Learning →
            </button>
          </div>
        ) : (
          <>
            {/* Start Revision Button */}
            <button
              onClick={startReview}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-base transition-all active:scale-95 shadow-sm"
            >
              🎯 Revise All {weakCards.length} Weak Cards
            </button>

            {/* Subject breakdown */}
            <div className="space-y-3">
              {Object.entries(bySubject).map(([subj, cards]) => {
                const colors = SUBJECT_COLORS[subj as keyof typeof SUBJECT_COLORS];
                // Group by topic within subject
                const byTopic = cards.reduce<Record<string, WeakCard[]>>((acc, c) => {
                  if (!acc[c.topic]) acc[c.topic] = [];
                  acc[c.topic].push(c);
                  return acc;
                }, {});

                return (
                  <div key={subj} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className={`px-4 py-3 ${colors.light} border-b border-gray-100`}>
                      <p className={`font-semibold text-sm ${colors.text}`}>
                        {subj} · {cards.length} card{cards.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {Object.entries(byTopic).map(([topic, topicCards]) => (
                        <div key={topic} className="px-4 py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{topic}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {topicCards.length} card{topicCards.length > 1 ? 's' : ''} · 
                              Max fails: {Math.max(...topicCards.map(c => c.failCount))}
                            </p>
                          </div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${colors.light} ${colors.text}`}>
                            {topicCards.length}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
