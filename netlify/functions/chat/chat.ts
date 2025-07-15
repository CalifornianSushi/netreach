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

  return {
    statusCode: 200,
    body: JSON.stringify({ reply: chat.choices[0].message.content })
  };
};

export { handler };