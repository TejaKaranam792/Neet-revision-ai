'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopicSelector from '@/components/TopicSelector';
import BottomNav from '@/components/BottomNav';
import { Subject } from '@/lib/types';
import { SUBJECT_COLORS, SUBJECT_ICONS } from '@/lib/topics';
import { getProgress, getWeakCards } from '@/lib/storage';

const SUBJECTS: Subject[] = ['Physics', 'Chemistry', 'Biology'];

const DAYS_LEFT = 25;

export default function HomePage() {
  const router = useRouter();
  const [subject, setSubject] = useState<Subject>('Biology');
  const [topic, setTopic] = useState('');
  const [progress, setProgress] = useState({ totalAttempted: 0, totalCorrect: 0 });
  const [weakCount, setWeakCount] = useState(0);

  useEffect(() => {
    const p = getProgress();
    setProgress({ totalAttempted: p.totalAttempted, totalCorrect: p.totalCorrect });
    setWeakCount(getWeakCards().length);
  }, []);

  const accuracy =
    progress.totalAttempted > 0
      ? Math.round((progress.totalCorrect / progress.totalAttempted) * 100)
      : 0;

  const handleGenerate = () => {
    if (!topic) return;
    router.push(`/flashcards?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">🧠 NEET Rapid Revision</h1>
              <p className="text-xs text-gray-500">AI-powered flashcards for last 25 days</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{DAYS_LEFT}</div>
              <div className="text-[10px] text-gray-500 font-medium">days left</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">{progress.totalAttempted}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Cards Done</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Accuracy</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-red-500">{weakCount}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Weak Cards</p>
          </div>
        </div>

        {/* Generate Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Generate Flashcards</h2>
            <p className="text-xs text-gray-500">Select a subject and topic to start revising</p>
          </div>

          {/* Subject Selector */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Subject</p>
            <div className="flex gap-2">
              {SUBJECTS.map((s) => {
                const colors = SUBJECT_COLORS[s];
                const isSelected = subject === s;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      setSubject(s);
                      setTopic('');
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 flex flex-col items-center gap-1
                      ${isSelected
                        ? `${colors.bg} text-white shadow-sm`
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-base">{SUBJECT_ICONS[s]}</span>
                    <span className="text-xs">{s}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topic Selector */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Topic</p>
            <TopicSelector subject={subject} value={topic} onChange={setTopic} />
          </div>

          {/* CTA Button */}
          <button
            onClick={handleGenerate}
            disabled={!topic}
            className={`w-full py-4 rounded-xl font-semibold text-white text-base transition-all active:scale-95
              ${topic
                ? 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {topic ? `Generate Flashcards for "${topic}" →` : 'Select a topic first'}
          </button>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push('/weak-cards')}
            className="bg-white rounded-2xl p-4 border border-red-100 text-left hover:border-red-200 transition-all active:scale-95"
          >
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm font-semibold text-gray-900">Revise Weak Areas</p>
            <p className="text-xs text-gray-500 mt-0.5">{weakCount} cards to review</p>
          </button>
          <button
            onClick={() => router.push('/quick-revision')}
            className="bg-white rounded-2xl p-4 border border-blue-100 text-left hover:border-blue-200 transition-all active:scale-95"
          >
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm font-semibold text-gray-900">15-Min Quick Mode</p>
            <p className="text-xs text-gray-500 mt-0.5">Mixed topics revision</p>
          </button>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-xs font-semibold text-blue-700 mb-2">💡 Today&apos;s Tip</p>
          <p className="text-sm text-blue-800">
            Focus on your weak cards first. Revising what you&apos;ve gotten wrong is 3× more effective than re-reading what you already know.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
