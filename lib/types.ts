// TypeScript types for NEET Rapid Revision AI

export interface MCQ {
  question: string;
  options: string[];
  answer: string; // e.g. "A", "B", "C", "D"
  explanation?: string;
}

export interface Flashcard {
  id: string;
  subject: 'Physics' | 'Chemistry' | 'Biology';
  topic: string;
  concept: string;
  explanation: string;
  trap: string;
  mcq: MCQ;
}

export interface WeakCard extends Flashcard {
  failCount: number;
  lastAttempted: string; // ISO date string
}

export interface Progress {
  totalAttempted: number;
  totalCorrect: number;
  weakTopics: Record<string, number>; // topic -> fail count
  sessions: SessionSummary[];
}

export interface SessionSummary {
  date: string;
  subject: string;
  topic: string;
  totalCards: number;
  correctCards: number;
  accuracy: number;
}

export type Subject = 'Physics' | 'Chemistry' | 'Biology';
