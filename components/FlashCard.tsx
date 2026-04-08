'use client';

import { useState } from 'react';
import { Flashcard } from '@/lib/types';
import { SUBJECT_COLORS } from '@/lib/topics';

interface FlashCardProps {
  card: Flashcard;
  onKnow: () => void;
  onWrong: () => void;
  cardNumber: number;
  total: number;
}

export default function FlashCard({ card, onKnow, onWrong, cardNumber, total }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const colors = SUBJECT_COLORS[card.subject];

  const handleFlip = () => setIsFlipped(true);

  const handleAction = (fn: () => void) => {
    fn();
    setIsFlipped(false);
    setSelectedOption(null);
  };

  const getOptionClass = (optionLetter: string) => {
    if (!selectedOption) return 'mcq-option';
    if (optionLetter === card.mcq.answer) return 'mcq-option correct';
    if (optionLetter === selectedOption && optionLetter !== card.mcq.answer)
      return 'mcq-option incorrect';
    return 'mcq-option';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-sm text-gray-500 font-medium">
          Card {cardNumber} of {total}
        </span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colors.light} ${colors.text}`}>
          {card.subject} · {card.topic}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-5">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${colors.bg}`}
          style={{ width: `${(cardNumber / total) * 100}%` }}
        />
      </div>

      {/* Card Scene */}
      <div className="card-scene">
        <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
          
          {/* FRONT */}
          <div className="card-face w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[320px] flex flex-col">
              {/* Label */}
              <div className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${colors.text} mb-4`}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                Concept
              </div>

              {/* Concept */}
              <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                {card.concept}
              </h2>

              {/* MCQ Question preview */}
              <div className="mt-auto pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-1.5">💡 NEET Question:</p>
                <p className="text-sm font-medium text-gray-700 leading-snug">{card.mcq.question}</p>
              </div>

              {/* Flip button */}
              <button
                onClick={handleFlip}
                className={`mt-5 w-full py-3 rounded-xl font-semibold text-white transition-all active:scale-95 ${colors.bg} hover:opacity-90`}
              >
                Flip to see answer →
              </button>
            </div>
          </div>

          {/* BACK */}
          <div className="card-face card-back w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {/* Explanation */}
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Explanation</p>
                <p className="text-base text-gray-800 leading-relaxed">{card.explanation}</p>
              </div>

              {/* Trap */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ Common Trap</p>
                <p className="text-sm text-amber-800">{card.trap}</p>
              </div>

              {/* MCQ */}
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">MCQ</p>
                <p className="text-sm font-medium text-gray-800 mb-3">{card.mcq.question}</p>
                <div className="space-y-2">
                  {card.mcq.options.map((opt, i) => {
                    const letter = ['A', 'B', 'C', 'D'][i];
                    return (
                      <button
                        key={i}
                        onClick={() => !selectedOption && setSelectedOption(letter)}
                        className={`${getOptionClass(letter)} w-full text-left p-2.5 rounded-lg border border-gray-200 text-sm transition-all`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {selectedOption && card.mcq.explanation && (
                  <div className="mt-3 p-2.5 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium">Correct answer: {card.mcq.answer}</p>
                    <p className="text-xs text-blue-600 mt-1">{card.mcq.explanation}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(onWrong)}
                  className="flex-1 py-3 rounded-xl font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all active:scale-95"
                >
                  ❌ Got it Wrong
                </button>
                <button
                  onClick={() => handleAction(onKnow)}
                  className="flex-1 py-3 rounded-xl font-semibold bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-all active:scale-95"
                >
                  ✅ I Know This
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
