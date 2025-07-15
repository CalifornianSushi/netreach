export async function runLatencyTest(pingCount = 10): Promise<{
  latencies: number[];
  averageLatency: number;
  jitter: number;
}> {
  const latencies: number[] = [];

  for (let i = 0; i < pingCount; i++) {
    const start = performance.now();
    try {
      await fetch('https://1.1.1.1/cdn-cgi/trace', { mode: 'no-cors', cache: 'no-store' });
    } catch (e) {
      // If request fails, push -1 to indicate failure
      latencies.push(-1);
      continue;
    }
    const end = performance.now();
    latencies.push(end - start);

    // Wait 200ms between pings to reduce burst error
    await new Promise((res) => setTimeout(res, 200));
  }

  const validLatencies = latencies.filter(l => l >= 0);
  const averageLatency =
    validLatencies.reduce((a, b) => a + b, 0) / validLatencies.length;

  const jitter = Math.sqrt(
    validLatencies.reduce((sum, val) => sum + Math.pow(val - averageLatency, 2), 0) /
    validLatencies.length
  );

  return { latencies, averageLatency, jitter };
}

export async function runBandwidthTest(): Promise<{
  downloadSpeedMbps: number;
  bytesDownloaded: number;
  timeSeconds: number;
}> {
  const fileUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg';

  const startTime = performance.now();
  const response = await fetch(fileUrl, { cache: 'no-store' });
  const data = await response.blob();
  const endTime = performance.now();

  const fileSizeBytes = data.size;
  const timeSeconds = (endTime - startTime) / 1000;

  const downloadSpeedMbps = (fileSizeBytes * 8) / (timeSeconds * 1000000);

  return {
    downloadSpeedMbps,
    bytesDownloaded: fileSizeBytes,
    timeSeconds,
  };
}

export async function runPacketLossTest(pingCount = 20): Promise<{
  successCount: number;
  failCount: number;
  lossPercentage: number;
}> {
  let success = 0;
  let fail = 0;

  for (let i = 0; i < pingCount; i++) {
    try {
      const res = await fetch('https://1.1.1.1/cdn-cgi/trace', { mode: 'no-cors', cache: 'no-store' });
      if (res.ok || res.status === 0) {
        success++;
      } else {
        fail++;
      }
    } catch {
      fail++;
    }

    await new Promise((res) => setTimeout(res, 100));
  }

  const lossPercentage = (fail / pingCount) * 100;

  return {
    successCount: success,
    failCount: fail,
    lossPercentage,
  };
}