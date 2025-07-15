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

  const [loading, setLoading] = useState(false);

  const [bandwidthResult, setBandwidthResult] = useState<null | {
  downloadSpeedMbps: number;
  bytesDownloaded: number;
  timeSeconds: number;
}>(null);

const [testingBandwidth, setTestingBandwidth] = useState(false);

const [packetLossResult, setPacketLossResult] = useState<null | {
  successCount: number;
  failCount: number;
  lossPercentage: number;
}>(null);
const [testingPacketLoss, setTestingPacketLoss] = useState(false);

const router = useRouter();

  async function handleRunTest() {
    setLoading(true);
    const res = await runLatencyTest();
    setResults(res);
    setLoading(false);
  }

  async function handleRunBandwidthTest() {
  setTestingBandwidth(true);
  const res = await runBandwidthTest();
  setBandwidthResult(res);
  setTestingBandwidth(false);
}

async function handleRunPacketLossTest() {
  setTestingPacketLoss(true);
  const res = await runPacketLossTest();
  setPacketLossResult(res);
  setTestingPacketLoss(false);
}

function goToResults() {
  if (!results || !bandwidthResult || !packetLossResult) return;

  const query = new URLSearchParams({
    latency: results.averageLatency.toFixed(2),
    jitter: results.jitter.toFixed(2),
    bandwidth: bandwidthResult.downloadSpeedMbps.toFixed(2),
    loss: packetLossResult.lossPercentage.toFixed(2),
  });

  router.push(`/results?${query.toString()}`);
}

  return (
    <div>
      <h1>Network Diagnostic Test</h1>
      <button onClick={handleRunTest} disabled={loading}>
        {loading ? 'Testing...' : 'Run Latency Test'}
      </button>

      {results && (
        <div>
          <p><strong>Average Latency:</strong> {results.averageLatency.toFixed(2)} ms</p>
          <p><strong>Jitter:</strong> {results.jitter.toFixed(2)} ms</p>
          <p><strong>Raw Data:</strong> {results.latencies.map((l, i) => `Ping ${i + 1}: ${l.toFixed(2)} ms`).join(', ')}</p>
        </div>
      )}

      <hr style={{ margin: '20px 0' }} />

<button onClick={handleRunBandwidthTest} disabled={testingBandwidth}>
  {testingBandwidth ? 'Testing...' : 'Run Bandwidth Test'}
</button>

{bandwidthResult && (
  <div>
    <p><strong>Download Speed:</strong> {bandwidthResult.downloadSpeedMbps.toFixed(2)} Mbps</p>
    <p><strong>Time Taken:</strong> {bandwidthResult.timeSeconds.toFixed(2)} seconds</p>
    <p><strong>Data Size:</strong> {(bandwidthResult.bytesDownloaded / 1024).toFixed(2)} KB</p>
  </div>
)}

<hr style={{ margin: '20px 0' }} />

<button onClick={handleRunPacketLossTest} disabled={testingPacketLoss}>
  {testingPacketLoss ? 'Testing...' : 'Run Packet Loss Test'}
</button>

{packetLossResult && (
  <div>
    <p><strong>Packets Sent:</strong> {packetLossResult.successCount + packetLossResult.failCount}</p>
    <p><strong>Successful:</strong> {packetLossResult.successCount}</p>
    <p><strong>Failed:</strong> {packetLossResult.failCount}</p>
    <p><strong>Packet Loss:</strong> {packetLossResult.lossPercentage.toFixed(1)}%</p>
  </div>
)}

{results && bandwidthResult && packetLossResult && (
  <div style={{ marginTop: '30px' }}>
    <button onClick={goToResults}>
      Save & View Results →
    </button>
  </div>
)}
    </div>
  );
}