'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResultsContent() {
  const searchParams = useSearchParams();

  const latency = searchParams.get('latency');
  const jitter = searchParams.get('jitter');
  const bandwidth = searchParams.get('bandwidth');
  const packetLoss = searchParams.get('loss');

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>📊 NetReach Results Summary</h1>

      <div style={{ marginBottom: '15px' }}>
        <strong>Latency:</strong> {latency} ms
      </div>
      <div style={{ marginBottom: '15px' }}>
        <strong>Jitter:</strong> {jitter} ms
      </div>
      <div style={{ marginBottom: '15px' }}>
        <strong>Bandwidth:</strong> {bandwidth} Mbps
      </div>
      <div style={{ marginBottom: '15px' }}>
        <strong>Packet Loss:</strong> {packetLoss}%
      </div>

      <hr style={{ margin: '30px 0' }} />

      <div>
        <h2>🧠 What this means</h2>
        <p>
          Based on your results, latency and jitter may impact real-time apps. Bandwidth is decent, and packet loss may cause issues in calls or streams.
        </p>
        <p>
          Consider restarting your router, reducing devices, or upgrading your plan.
        </p>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<p>Loading results...</p>}>
      <ResultsContent />
    </Suspense>
  );
}