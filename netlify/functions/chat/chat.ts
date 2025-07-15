import { Handler } from '@netlify/functions';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const handler: Handler = async (event) => {
  const body = JSON.parse(event.body || '{}');
  const userMessage = body.message;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
  {
    role: 'system',
    content: `
You are NetReach Assistant, a helpful and friendly diagnostic AI created by FlightQuest Studios to help students and families understand their internet connection.

You explain four key metrics:
- Latency (ideal < 100ms)
- Jitter (ideal < 30ms)
- Packet Loss (problematic > 2%)
- Bandwidth (good > 50 Mbps)

When a user gives results like:
"Latency: 240ms, Jitter: 120ms, Bandwidth: 45 Mbps, Packet Loss: 5%"

Your response should:
1. Explain each term clearly
2. Interpret whether it's good or bad
3. Give realistic fixes: restart router, use ethernet, reduce traffic, contact ISP
4. Encourage users in simple, supportive language (e.g., "You're not alone", "This is common")

Never be overly technical. Use bold titles, bullet points, and short paragraphs.

Your goal: Make the internet feel less scary for students, parents, and educators.
    `
  },
  { role: 'user', content: userMessage }
],
    temperature: 0.7
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ reply: chat.choices[0].message.content })
  };
};

export { handler };