'use client';

import { Flashcard, WeakCard, Progress, SessionSummary } from './types';

const KEYS = {
  WEAK_CARDS: 'neet_weak_cards',
  PROGRESS: 'neet_progress',
  GENERATED_CARDS: 'neet_generated_cards',
};

// ─── Weak Cards ────────────────────────────────────────────────────────────────

export function getWeakCards(): WeakCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.WEAK_CARDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addWeakCard(card: Flashcard): void {
  const cards = getWeakCards();
  const existingIndex = cards.findIndex((c) => c.id === card.id);
  if (existingIndex >= 0) {
    cards[existingIndex].failCount += 1;
    cards[existingIndex].lastAttempted = new Date().toISOString();
  } else {
    const weakCard: WeakCard = {
      ...card,
      failCount: 1,
      lastAttempted: new Date().toISOString(),
    };
    cards.push(weakCard);
  }
  localStorage.setItem(KEYS.WEAK_CARDS, JSON.stringify(cards));
}

export function removeWeakCard(cardId: string): void {
  const cards = getWeakCards().filter((c) => c.id !== cardId);
  localStorage.setItem(KEYS.WEAK_CARDS, JSON.stringify(cards));
}

export function clearWeakCards(): void {
  localStorage.removeItem(KEYS.WEAK_CARDS);
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export function getProgress(): Progress {
  if (typeof window === 'undefined') {
    return { totalAttempted: 0, totalCorrect: 0, weakTopics: {}, sessions: [] };
  }
  try {
    const raw = localStorage.getItem(KEYS.PROGRESS);
    return raw
      ? JSON.parse(raw)
      : { totalAttempted: 0, totalCorrect: 0, weakTopics: {}, sessions: [] };
  } catch {
    return { totalAttempted: 0, totalCorrect: 0, weakTopics: {}, sessions: [] };
  }
}

export function updateProgress(
  correct: boolean,
  topic: string,
  session?: SessionSummary
): void {
  const progress = getProgress();
  progress.totalAttempted += 1;
  if (correct) {
    progress.totalCorrect += 1;
  } else {
    progress.weakTopics[topic] = (progress.weakTopics[topic] || 0) + 1;
  }
  if (session) {
    progress.sessions.push(session);
    // Keep only last 20 sessions
    if (progress.sessions.length > 20) {
      progress.sessions = progress.sessions.slice(-20);
    }
  }
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
}

export function resetProgress(): void {
  localStorage.removeItem(KEYS.PROGRESS);
}

// ─── Generated Cards Cache ────────────────────────────────────────────────────

export function getCachedCards(subject: string, topic: string): Flashcard[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.GENERATED_CARDS);
    const cache = raw ? JSON.parse(raw) : {};
    const key = `${subject}::${topic}`;
    const entry = cache[key];
    if (!entry) return null;
    // Cache valid for 24 hours
    const age = Date.now() - entry.timestamp;
    if (age > 24 * 60 * 60 * 1000) return null;
    return entry.cards;
  } catch {
    return null;
  }
}

export function setCachedCards(subject: string, topic: string, cards: Flashcard[]): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(KEYS.GENERATED_CARDS);
    const cache = raw ? JSON.parse(raw) : {};
    const key = `${subject}::${topic}`;
    cache[key] = { cards, timestamp: Date.now() };
    localStorage.setItem(KEYS.GENERATED_CARDS, JSON.stringify(cache));
  } catch {
    // localStorage full — ignore
  }
}

export function getAllCachedCards(): Flashcard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.GENERATED_CARDS);
    const cache = raw ? JSON.parse(raw) : {};
    const allCards: Flashcard[] = [];
    for (const key in cache) {
      const entry = cache[key];
      if (entry?.cards) allCards.push(...entry.cards);
    }
    return allCards;
  } catch {
    return [];
  }
}
