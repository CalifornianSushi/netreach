'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ fontWeight: 600, fontSize: '1.25rem' }}>NetReach</div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '1rem' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#111' }}>Test</Link>
          <Link href="/chat" style={{ textDecoration: 'none', color: '#111' }}>Chat</Link>
          <Link href="/about" style={{ textDecoration: 'none', color: '#111' }}>About</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #ffecd2, #fcb69f)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 2rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '4rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          NetReach
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#333', marginBottom: '2rem' }}>
          Diagnose. Understand. Improve your internet performance.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => router.push('/test')}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.85rem 1.75rem',
              fontWeight: 500,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            Run Network Test
          </button>
          <button
            style={{
              background: 'transparent',
              color: '#2563eb',
              border: '2px solid #2563eb',
              borderRadius: '9999px',
              padding: '0.85rem 1.75rem',
              fontWeight: 500,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'white', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Key Features</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { title: 'Latency Analyzer', desc: 'Measure round-trip delay across networks.' },
            { title: 'Jitter Monitor', desc: 'Track stability and delay variation in your connection.' },
            { title: 'Bandwidth Test', desc: 'Check download performance in real time.' },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                backgroundColor: '#f9fafe',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                maxWidth: '300px',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{item.title}</h3>
              <p style={{ color: '#555', marginTop: '0.5rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#fef6f0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>How It Works</h2>
        <ol
          style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            listStyle: 'none',
            padding: 0,
          }}
        >
          {[
            'Run a test to analyze your network.',
            'Review results on latency, jitter, speed, and loss.',
            'Use our AI assistant to get plain-language fixes.',
          ].map((step, i) => (
            <li
              key={i}
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                maxWidth: '300px',
              }}
            >
              <h3 style={{ fontSize: '1.5rem', color: '#fb923c' }}>{i + 1}</h3>
              <p style={{ color: '#333', marginTop: '0.5rem' }}>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Chat Preview Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'white', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Try the Assistant</h2>
        <div
          style={{
            backgroundColor: '#f1f5f9',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'left',
            fontSize: '1rem',
            lineHeight: 1.5,
          }}
        >
          <p><strong>You:</strong> What does 240ms latency mean?</p>
          <p>
            <strong>NetReach Assistant:</strong> Latency refers to the time it takes for data to
            travel from your device to a server and back. A 240ms latency means there&apos;s a 0.24
            second delay in that process. For online games or video calls, this could lead to
            lag. Try using a wired connection or restarting your router to reduce it.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1e293b', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
          © {new Date().getFullYear()} NetReach by FlightQuest Studios · All rights reserved.
        </p>
      </footer>
    </main>
  );
}