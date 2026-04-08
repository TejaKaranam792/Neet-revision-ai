import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiClient = () => {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
};

export async function POST(req: NextRequest) {
  try {
    const { mode, input } = await req.json();

    if (!mode || !input) {
      return NextResponse.json({ error: 'Mode and input are required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = getGeminiClient();
    
    let prompt = '';

    switch (mode) {
      case 'explain':
        prompt = `You are a NEET Physics teacher teaching a student who is weak in mathematics.
Explain the topic: ${input}
Rules:
- Use very simple language
- Start with a real-life analogy
- Avoid formulas initially
- Then introduce the main formula step-by-step
- Explain where students typically get confused
End with:
- 2 easy questions
- 1 medium question
- Step-by-step solutions for all questions`;
        break;

      case 'solver':
        prompt = `You are solving a NEET Physics numerical.
Solve this question: ${input}
Rules:
- Show every step clearly
- Write the formula first
- Substitute values explicitly
- Solve the math slowly and visibly
- Explain each step in very simple English
- Highlight common calculation or conceptual mistakes students make here
End with:
- A shortcut trick to solve similar questions faster if applicable`;
        break;

      case 'pyq':
        prompt = `You are a NEET Physics expert focusing on past year trends.
For the topic: ${input}
Give:
- 3 to 5 most common PYQ (Previous Year Question) patterns strictly for NEET
- 1 clear example for each pattern
- Step-by-step solution for each example
- Shortcut trick or memory aid for each pattern`;
        break;

      case 'mistake':
        prompt = `A student made this mistake in Physics:
${input}
Analyze:
- What exactly went wrong
- What weak concept does this indicate
- Why is this a common error
Then:
- Re-explain the concept simply
- Give 2 similar check questions
- Give 1 exam trick to avoid doing this ever again`;
        break;

      case 'rapid':
        prompt = `You are a NEET Physics rapid revision coach.
Create a lightning-fast quick revision sheet for the topic: ${input}
Include ONLY:
- Key formulas (list them tightly)
- 3 biggest traps to avoid
- 5 extremely quick rapid-fire theoretical MCQs with answers at the very bottom
Keep the entire output extremely concise and scannable.`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid mode provided' }, { status: 400 });
    }

    // Use Gemini 3.1 Flash Lite Preview as heavily requested by user
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite-preview',
      // We don't use strict JSON here; we want natural educational text/markdown
    });
    
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    return NextResponse.json({ result: content });
  } catch (error: unknown) {
    console.error('Physics Helper generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate response';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
