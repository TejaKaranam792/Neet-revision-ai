'use client';

import { useState, useRef } from 'react';
import { Subject } from '@/lib/types';
import { TOPICS, SUBJECT_COLORS } from '@/lib/topics';

interface TopicSelectorProps {
  subject: Subject;
  value: string;
  onChange: (topic: string) => void;
}

export default function TopicSelector({ subject, value, onChange }: TopicSelectorProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const colors = SUBJECT_COLORS[subject];

  const filtered = TOPICS[subject].filter((t) =>
    t.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (topic: string) => {
    onChange(topic);
    setSearch(topic);
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
    setSearch('');
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={isOpen ? search : value}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder="Search or select a topic..."
        className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium bg-white outline-none transition-all
          ${value ? `${colors.border} ${colors.text}` : 'border-gray-200 text-gray-700'}
          focus:border-blue-400`}
      />
      {value && !isOpen && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg">✓</span>
      )}

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-56 overflow-y-auto">
          {filtered.map((topic) => (
            <button
              key={topic}
              onMouseDown={() => handleSelect(topic)}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors font-medium
                ${topic === value ? `${colors.light} ${colors.text}` : 'text-gray-700'}`}
            >
              {topic}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
