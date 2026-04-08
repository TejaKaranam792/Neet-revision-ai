# NEET Rapid Revision AI 🧠⚡

A high-performance, mobile-first web application designed specifically for NEET (National Eligibility cum Entrance Test) aspirants. This tool enables rapid recall and revision in the crucial final 25 days before the exam via AI-generated, structured flashcards.

## 🚀 Features

- **Topic-Based Flashcard Generator**: Instantly generate highly accurate, PYQ-focused (Previous Year Questions) flashcards for Physics, Chemistry, and Biology.
- **AI-Powered Structured Data**: Utilizes Gemini 3.1 Flash Lite API with strict `SchemaType` validation to consistently fetch exactly 10 comprehensive cards without syntax hallucination.
- **Interactive 3D Flip UI**: Beautifully designed CSS Grid-based flashcards, ensuring perfect rendering on mobile screens without overflow issues. Needs-based flipping tests student recall.
- **Weak Cards Tracking**: Localized algorithm tracks flashcards a student gets wrong. These enter a targeted "Weak Areas" directory, encouraging spaced repetition over hard topics until mastery.
- **15-Minute 'Quick Revision' Timer**: A rapid scramble session simulating high-pressure exam environments mixing random topics across subjects. 
- **100% Stateless & Fast**: Requires exactly zero user authentication. Progress persistence relies exclusively on lightweight HTML5 `localStorage`.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI Integration**: Google Generative AI SDK (`@google/generative-ai`)
- **Language**: TypeScript throughout
- **State Management**: React Hooks + LocalStorage

## ⚙️ Local Development

### Prerequisites

You need [Node.js](https://nodejs.org/) (version 18+ recommended) and `npm` installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/neet-rapid-revision.git
   cd neet-rapid-revision
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory by inserting your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser. (We strongly recommend using Mobile Device Emulation in Chrome DevTools to visualize intended layout constraints).

## 🏢 Production Deployment

This project is fully optimized for immediate edge deployment on platforms like Vercel. 

### Vercel (Recommended)

1. Connect your GitHub repository to [Vercel](https://vercel.com/).
2. In the Vercel dashboard, navigate to **Settings > Environment Variables**.
3. Add `GEMINI_API_KEY` mapping to your production API key.
4. Deploy the project. The Next.js builder will automatically statically render all applicable pages aside from the dynamic `generate-flashcards` API route.

## 📁 Repository Anatomy

- `app/`: Next.js App Router root layout, styles, and page entry margins.
- `app/api/`: Secure serverless edge functions abstracting AI fetches.
- `components/`: Modular React components including `FlashCard`, `TopicSelector`, `Timer`, and `BottomNav`.
- `lib/`: Type declarations, local storage utilities, and static NEET Biology/Chemistry/Physics topic seeds.

## 🤝 Contribution Guidelines

We focus on **Speed > Features** and **Clarity > Fancy UI**. If proposing a pull request:
1. Ensure the feature operates fully offline or client-side where possible.
2. Confirm that changes render properly on screen widths of `320px` (low-end mobile devices).
3. Do not introduce heavy javascript animation libraries.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
