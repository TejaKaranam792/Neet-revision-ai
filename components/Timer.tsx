'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  totalSeconds: number;
  onExpire: () => void;
}

export default function Timer({ totalSeconds, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = remaining / totalSeconds;
  const strokeDashoffset = circumference * (1 - progress);

  const isWarning = remaining <= 60;
  const color = isWarning ? '#ef4444' : '#3bf664ff';

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, onExpire]);

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg width="80" height="80" viewBox="0 0 80 80">
          {/* Background ring */}
          <circle
            cx="40" cy="40" r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="6"
          />
          {/* Progress ring */}
          <circle
            cx="40" cy="40" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="timer-ring timer-ring-progress"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold tabular-nums ${isWarning ? 'text-red-500' : 'text-gray-800'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">Time Left</p>
        <p className="text-sm font-semibold text-gray-700">Quick Revision</p>
      </div>
    </div>
  );
}
