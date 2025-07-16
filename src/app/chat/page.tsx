'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

function ChatContent() {
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<{ sender: string; text: string; animate?: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const prefillSentRef = useRef(false);

  const latency = searchParams.get('latency');
  const jitter = searchParams.get('jitter');
  const bandwidth = searchParams.get('bandwidth');
  const loss = searchParams.get('loss');
  const rawData = searchParams.get('rawData');
  const preset = searchParams.get('preset');

  const prefillMessage = preset
    ? decodeURIComponent(preset)
    : latency && jitter && bandwidth && loss
    ? `Latency Test Results: Average Latency: ${latency} ms Jitter: ${jitter} ms Raw Data: ${rawData || ''} What does this mean?`
    : null;

  useEffect(() => {
    if (prefillMessage && !prefillSentRef.current) {
      handleSend(prefillMessage);
      prefillSentRef.current = true;
    }
  }, [prefillMessage]);

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend) return;

    const userMessage = { sender: 'user', text: messageToSend, animate: true };
    setMessages((prev) => [...prev, userMessage]);
    if (!customMessage) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.reply || 'Sorry, I could not understand that.' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'There was an error connecting to the assistant. Please try again later.' }]);
    }

    setLoading(false);
  };

  const suggestions = ['Explain what does bandwidth mean', 'What are ways to fix my slow internet', 'Help me with internet issues'];

  return (
    <div style={{ height: '100vh', width: '100%', padding: '1rem', fontFamily: 'Inter, sans-serif', background: '#ffffff', display: 'flex', flexDirection: 'column', color: '#000000' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#000000', fontWeight: 600, textAlign: 'center', letterSpacing: '-0.5px' }}>NetReach Assistant</h1>
      <div style={{ flex: 1, background: 'rgba(240, 240, 240, 0.5)', padding: '1.5rem', borderRadius: '1.5rem', overflowY: 'auto', border: '1px solid #e0e0e0' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', // Reverted to flex-start for bot messages
              opacity: msg.animate ? 0 : 1,
              animation: msg.animate ? 'fadeIn 0.5s forwards' : 'none',
            }}
          >
            <div
              style={{
                background: msg.sender === 'user' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                color: msg.sender === 'user' ? '#ffffff' : '#000000',
                padding: '1rem',
                borderRadius: '1rem',
                maxWidth: '70%',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'left', // Reset to left alignment
              }}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p style={{ margin: 0, lineHeight: '1.6', color: 'inherit', fontWeight: 'normal' }}>{children}</p>, // Removed bolding
                  li: ({ children }) => <li style={{ margin: '0.75rem 0', lineHeight: '1.6', color: 'inherit', fontWeight: 'normal' }}>{children}</li>, // Removed bolding
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#000000',
                padding: '1rem',
                borderRadius: '1rem',
                maxWidth: '70%',
                border: '1px solid #e0e0e0',
                textAlign: 'left',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-start' }}>
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
              <style>
                {`
                  @keyframes blink {
                    0% { opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { opacity: 0.3; }
                  }
                  .dot {
                    animation: blink 1.4s infinite;
                    fontSize: '1.5rem';
                    color: #000000;
                  }
                  .dot:nth-child(2) { animation-delay: 0.2s; }
                  .dot:nth-child(3) { animation-delay: 0.4s; }
                `}
              </style>
            </div>
          </div>
        )}
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => setInput(suggestion)}
            style={{
              background: '#f0f0f0',
              color: '#000000',
              padding: '0.75rem 1.5rem', // Increased padding for bigger buttons
              borderRadius: '0.75rem',
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'background-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = '#e0e0e0';
              target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = '#f0f0f0';
              target.style.transform = 'scale(1)';
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', alignItems: 'flex-start' }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..." // Updated placeholder
          style={{
            flex: 1,
            padding: '0.8rem', // Matched padding to Send button
            borderRadius: '1.5rem',
            border: '1px solid #e0e0e0',
            fontSize: '1rem',
            outline: 'none',
            minHeight: '2.0rem', // Matched to Send button height (0.8rem * 2 + 1rem font-size)
            resize: 'vertical',
            fontFamily: 'Inter, sans-serif',
            background: '#ffffff',
            color: '#000000',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#ffffff',
            padding: '0.8rem 1.5rem',
            borderRadius: '1.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s, background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.transform = 'scale(1.1)';
            target.style.background = 'rgba(0, 0, 0, 0.9)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.transform = 'scale(1)';
            target.style.background = 'rgba(0, 0, 0, 0.8)';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', transform: 'rotate(90deg)' }}>
            <path d="M12 2L2 12L12 22" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes liquidWave {
            0% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
          }
          .message-container div {
            animation: liquidWave 3s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<p style={{ padding: '2rem', color: '#000000', fontFamily: 'Inter, sans-serif', background: '#ffffff' }}>Loading NetReach Assistant...</p>}>
      <ChatContent />
    </Suspense>
  );
}