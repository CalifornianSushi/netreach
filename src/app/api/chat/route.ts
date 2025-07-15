import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // put this in .env.local
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userMessage = body.message;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are NetReach Assistant, an expert in internet performance. Explain latency, jitter, bandwidth, and packet loss in simple terms. Be helpful and not too technical.'
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    temperature: 0.7
  });

  const reply = chat.choices[0].message.content;
  return NextResponse.json({ reply });
}