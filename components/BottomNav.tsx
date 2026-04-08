'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/flashcards', label: 'Flashcards', icon: '📚' },
  { href: '/weak-cards', label: 'Weak Cards', icon: '🎯' },
  { href: '/quick-revision', label: 'Quick Mode', icon: '⚡' },
  { href: '/physics-helper', label: 'Physics', icon: '🧲' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2.5 px-4 min-w-0 flex-1 transition-all
                ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span className={`text-xl mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-semibold truncate ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
