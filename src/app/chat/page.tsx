'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ChatContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const latency = searchParams.get('latency');
  const jitter = searchParams.get('jitter');
  const bandwidth = searchParams.get('bandwidth');
  const loss = searchParams.get('loss');

  const prefillMessage = `Here are my network test results: latency = ${latency}ms, jitter = ${jitter}ms, download speed = ${bandwidth} Mbps, packet loss = ${loss}%. Can you tell me what this means and how to improve it?`;

  useEffect(() => {
    if (latency && jitter && bandwidth && loss) {
      setInput(prefillMessage);
    }
  }, [latency, jitter, bandwidth, loss, prefillMessage]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage.text })
    });

    const data = await res.json();
    const botMessage = { sender: 'bot', text: data.reply };
    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  return (
    <div>
      <h1>NetReach Assistant</h1>
      <div style={{ marginBottom: '1rem' }}>
        {messages.map((msg, i) => (
          <p key={i}><strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Ask about your internet performance..."
        style={{ padding: '10px', width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Thinking...' : 'Send'}
      </button>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<p>Loading assistant...</p>}>
      <ChatContent />
    </Suspense>
  );
}