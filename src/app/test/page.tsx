'use client';

import { useState } from 'react';
import { runLatencyTest, runBandwidthTest, runPacketLossTest } from '@/lib/networkTest';
import { useRouter } from 'next/navigation';

export default function Test() {
  const [results, setResults] = useState<null | {
    averageLatency: number;
    jitter: number;
    latencies: number[];
  }>(null);

  const [bandwidthResult, setBandwidthResult] = useState<null | {
    downloadSpeedMbps: number;
    bytesDownloaded: number;
    timeSeconds: number;
  }>(null);

  const [packetLossResult, setPacketLossResult] = useState<null | {
    successCount: number;
    failCount: number;
    lossPercentage: number;
  }>(null);

  const [loading, setLoading] = useState(false);
  const [testingBandwidth, setTestingBandwidth] = useState(false);
  const [testingPacketLoss, setTestingPacketLoss] = useState(false);

  const router = useRouter();

  function goToChatWithMessage(message: string) {
    const encoded = encodeURIComponent(message);
    router.push(`/chat?preset=${encoded}`);
  }

  return (
    <main style={mainStyle}>
      <h1 style={titleStyle}>Network Diagnostic Test</h1>

      {/* LATENCY */}
      <div style={cardStyle}>
        <h2 style={cardTitle}>Latency Test</h2>
        <button style={buttonStyle} onClick={async () => {
          setLoading(true);
          const res = await runLatencyTest();
          setResults(res);
          setLoading(false);
        }} disabled={loading}>
          {loading ? 'Testing...' : 'Run Latency Test'}
        </button>
        {results && (
          <div style={resultText}>
            <p><strong>Average Latency:</strong> {results.averageLatency.toFixed(2)} ms</p>
            <p><strong>Jitter:</strong> {results.jitter.toFixed(2)} ms</p>
            <p><strong>Raw Data:</strong> {results.latencies.map((l, i) => `Ping ${i + 1}: ${l.toFixed(2)} ms`).join(', ')}</p>
            <button
              style={explainButtonStyle}
              onClick={() => {
                const msg = `Latency Test Results:\nAverage Latency: ${results.averageLatency.toFixed(2)} ms\nJitter: ${results.jitter.toFixed(2)} ms\nRaw Data: ${results.latencies.map((l, i) => `Ping ${i + 1}: ${l.toFixed(2)} ms`).join(', ')}\n\nWhat does this mean?`;
                goToChatWithMessage(msg);
              }}
            >
              What does this mean?
            </button>
          </div>
        )}
      </div>

      {/* BANDWIDTH */}
      <div style={cardStyle}>
        <h2 style={cardTitle}>Bandwidth Test</h2>
        <button style={buttonStyle} onClick={async () => {
          setTestingBandwidth(true);
          const res = await runBandwidthTest();
          setBandwidthResult(res);
          setTestingBandwidth(false);
        }} disabled={testingBandwidth}>
          {testingBandwidth ? 'Testing...' : 'Run Bandwidth Test'}
        </button>
        {bandwidthResult && (
          <div style={resultText}>
            <p><strong>Download Speed:</strong> {bandwidthResult.downloadSpeedMbps.toFixed(2)} Mbps</p>
            <p><strong>Time Taken:</strong> {bandwidthResult.timeSeconds.toFixed(2)} seconds</p>
            <p><strong>Data Size:</strong> {(bandwidthResult.bytesDownloaded / 1024).toFixed(2)} KB</p>
            <button
              style={explainButtonStyle}
              onClick={() => {
                const msg = `Bandwidth Test Results:\nDownload Speed: ${bandwidthResult.downloadSpeedMbps.toFixed(2)} Mbps\nTime Taken: ${bandwidthResult.timeSeconds.toFixed(2)} sec\nData Size: ${(bandwidthResult.bytesDownloaded / 1024).toFixed(2)} KB\n\nWhat does this mean?`;
                goToChatWithMessage(msg);
              }}
            >
              What does this mean?
            </button>
          </div>
        )}
      </div>

      {/* PACKET LOSS */}
      <div style={cardStyle}>
        <h2 style={cardTitle}>Packet Loss Test</h2>
        <button style={buttonStyle} onClick={async () => {
          setTestingPacketLoss(true);
          const res = await runPacketLossTest();
          setPacketLossResult(res);
          setTestingPacketLoss(false);
        }} disabled={testingPacketLoss}>
          {testingPacketLoss ? 'Testing...' : 'Run Packet Loss Test'}
        </button>
        {packetLossResult && (
          <div style={resultText}>
            <p><strong>Packets Sent:</strong> {packetLossResult.successCount + packetLossResult.failCount}</p>
            <p><strong>Successful:</strong> {packetLossResult.successCount}</p>
            <p><strong>Failed:</strong> {packetLossResult.failCount}</p>
            <p><strong>Packet Loss:</strong> {packetLossResult.lossPercentage.toFixed(2)}%</p>
            <button
              style={explainButtonStyle}
              onClick={() => {
                const msg = `Packet Loss Test Results:\nPackets Sent: ${packetLossResult.successCount + packetLossResult.failCount}\nSuccessful: ${packetLossResult.successCount}\nFailed: ${packetLossResult.failCount}\nLoss: ${packetLossResult.lossPercentage.toFixed(2)}%\n\nWhat does this mean?`;
                goToChatWithMessage(msg);
              }}
            >
              What does this mean?
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// === STYLES ===
const mainStyle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  minHeight: '100vh',
  background: 'linear-gradient(to bottom, #fff1eb, #ace0f9)',
  padding: '4rem 2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2.75rem',
  fontWeight: 800,
  marginBottom: '1.5rem',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '1rem',
  padding: '2rem',
  margin: '1.5rem 0',
  width: '100%',
  maxWidth: '600px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  textAlign: 'left',
};

const cardTitle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 700,
  marginBottom: '1rem',
  textAlign: 'center',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  padding: '0.75rem 1.5rem',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
};

const explainButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  marginTop: '1rem',
};

const resultText: React.CSSProperties = {
  marginTop: '1rem',
  lineHeight: 1.5,
  fontSize: '1rem',
  color: '#333',
};