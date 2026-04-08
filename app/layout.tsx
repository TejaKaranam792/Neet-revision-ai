import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEET Rapid Revision AI — Last 25 Days Preparation',
  description:
    'AI-powered flashcard system for NEET aspirants. Generate topic-wise flashcards, track weak areas, and ace your revision in the last 25 days.',
  keywords: 'NEET, flashcards, revision, AI, Physics, Chemistry, Biology, exam preparation',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
