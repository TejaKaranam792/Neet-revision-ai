import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const getGeminiClient = () => {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
};

export async function POST(req: NextRequest) {
  try {
    const { subject, topic } = await req.json();

    if (!subject || !topic) {
      return NextResponse.json({ error: 'Subject and topic are required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = getGeminiClient();
    
    const prompt = `You are a NEET expert tutor. Generate exactly 10 high-yield revision flashcards for the topic: "${topic}" in ${subject}.
Focus on PYQ patterns, extremely short concept names (max 6 words), 1-2 line explanations without fluff, common student traps, and single-correct MCQs (answer must be exactly A, B, C, or D).`;

    const schema = {
      type: SchemaType.ARRAY,
      description: "Array of flashcards",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          concept: { type: SchemaType.STRING, description: "Short concept or formula name" },
          explanation: { type: SchemaType.STRING, description: "Clear 1-2 line explanation focused on NEET" },
          trap: { type: SchemaType.STRING, description: "Common mistake or trap students make" },
          mcq: {
            type: SchemaType.OBJECT,
            properties: {
              question: { type: SchemaType.STRING, description: "NEET-style question" },
              options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "4 options starting with A), B), C), D)" },
              answer: { type: SchemaType.STRING, description: "Correct option letter: A, B, C, or D" },
              explanation: { type: SchemaType.STRING, description: "Why this answer is correct" }
            },
            required: ["question", "options", "answer", "explanation"]
          }
        },
        required: ["concept", "explanation", "trap", "mcq"]
      }
    };

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite-preview',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // Try to safely extract JSON if wrapped in markdown
    let cleanedContent = content.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const firstBracket = cleanedContent.indexOf('[');
    const lastBracket = cleanedContent.lastIndexOf(']');
    
    if (firstBracket === -1 || lastBracket === -1) {
      console.error('Failed to find JSON array brackets. Raw content:', content);
      return NextResponse.json({ error: 'Invalid AI response format: missing brackets' }, { status: 500 });
    }

    cleanedContent = cleanedContent.substring(firstBracket, lastBracket + 1);

    let rawCards;
    try {
      rawCards = JSON.parse(cleanedContent);
    } catch (parseError: any) {
      console.error('JSON Parse error:', parseError.message);
      console.error('Attempted to parse:', cleanedContent);
      return NextResponse.json({ error: `JSON Parse error: ${parseError.message}` }, { status: 500 });
    }

    if (!Array.isArray(rawCards)) {
      return NextResponse.json({ error: 'Invalid AI response format: not an array' }, { status: 500 });
    }

    // Add IDs and metadata
    const cards = rawCards.map((card: Record<string, unknown>, index: number) => ({
      id: `${subject}-${topic}-${Date.now()}-${index}`.replace(/\s+/g, '-').toLowerCase(),
      subject,
      topic,
      ...card,
    }));

    return NextResponse.json({ cards });
  } catch (error: unknown) {
    console.error('Flashcard generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate flashcards';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
