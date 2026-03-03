'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import config from '@/lib/config';

/**
 * useTimeSync — NTP-style time synchronization hook
 * 
 * Architecture: The backend proxies time from external sources (TimeAPI.io,
 * Cloudflare) and caches the result for 3 seconds. This means only ONE
 * server-side fetch per 2 seconds, no matter how many visitors are on the site.
 * 
 * Each visitor's browser calls our backend /api/time endpoint, measures the
 * round-trip time, and computes the local clock offset vs the upstream time.
 * Multiple sampling rounds with statistical filtering produce a reliable offset.
 */
export default function useTimeSync() {
  const [offset, setOffset] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [syncStatus, setSyncStatus] = useState('syncing');
  const [syncCount, setSyncCount] = useState(0);
  const [lastSync, setLastSync] = useState(null);
  const [samples, setSamples] = useState([]);
  const [sourceResults, setSourceResults] = useState({});
  const offsetRef = useRef(null);

  // ── Fetch time from our backend proxy ──
  const fetchTimeFromProxy = useCallback(async () => {
    const t1Perf = performance.now();
    const t1Date = Date.now();
    const res = await fetch(`${config.apiUrl}/api/time`, {
      cache: 'no-store',
      signal: AbortSignal.timeout?.(config.timeSync.requestTimeout) || undefined,
    });
    const t4Perf = performance.now();
    const rtt = t4Perf - t1Perf;
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    if (!data.sources || data.sources.length === 0) throw new Error('No sources');

    // Build samples from each upstream source the backend fetched
    const results = [];
    for (const src of data.sources) {
      // The upstream time was fetched at data.serverTimestamp on the server.
      // Our local clock at the midpoint of the request was t1Date + rtt/2.
      // The server's own timestamp helps us account for cache age.
      const cacheAge = data.cacheAge || 0;
      const upstreamTime = src.time + cacheAge; // adjust for cache staleness
      const localAtServer = t1Date + rtt / 2;
      results.push({
        source: src.source,
        offset: upstreamTime - localAtServer,
        rtt,
        accuracy: rtt / 2,
        tier: src.source === 'timeapi' ? 1 : src.source === 'cloudflare' ? 2 : 3,
      });
    }
    return results;
  }, []);

  // ── Collect samples across multiple rounds ──
  const collectAllSources = useCallback(async () => {
    try {
      const results = await fetchTimeFromProxy();
      const sourceStatus = {};
      for (const r of results) {
        sourceStatus[r.source] = { status: 'ok', rtt: r.rtt, offset: r.offset };
      }
      return { successes: results, sourceStatus };
    } catch (e) {
      return {
        successes: [],
        sourceStatus: { proxy: { status: 'error', error: e.message || 'Failed' } },
      };
    }
  }, [fetchTimeFromProxy]);

  // ── Statistical filtering: discard outliers, weight by RTT ──
  const computeFinalOffset = useCallback((allSamples) => {
    if (allSamples.length === 0) return null;
    if (allSamples.length === 1) return { offset: allSamples[0].offset, accuracy: allSamples[0].accuracy };
    const highTier = allSamples.filter(s => s.tier <= 1);
    const pool = highTier.length >= 2 ? highTier : allSamples;
    pool.sort((a, b) => a.rtt - b.rtt);
    const offsets = pool.map(s => s.offset);
    const sortedOffsets = [...offsets].sort((a, b) => a - b);
    const median = sortedOffsets[Math.floor(sortedOffsets.length / 2)];
    const deviations = sortedOffsets.map(o => Math.abs(o - median));
    const sortedDev = [...deviations].sort((a, b) => a - b);
    const mad = sortedDev[Math.floor(sortedDev.length / 2)] || 1;
    const threshold = mad * 3;
    const filtered = pool.filter(s => Math.abs(s.offset - median) <= Math.max(threshold, 500));
    if (filtered.length === 0) return { offset: pool[0].offset, accuracy: pool[0].accuracy };
    let totalWeight = 0, weightedSum = 0;
    for (const s of filtered) {
      const w = 1 / Math.max(s.rtt, 1);
      totalWeight += w;
      weightedSum += s.offset * w;
    }
    return { offset: Math.round(weightedSum / totalWeight), accuracy: Math.min(...filtered.map(s => s.accuracy)) };
  }, []);

  // ── Main sync: multiple rounds ──
  const performSync = useCallback(async () => {
    setSyncStatus('syncing');
    const allSamples = [];
    let combinedSourceStatus = {};
    for (let round = 0; round < config.timeSync.sampleRounds; round++) {
      const { successes, sourceStatus } = await collectAllSources();
      allSamples.push(...successes);
      for (const [src, status] of Object.entries(sourceStatus)) {
        if (status.status === 'ok') {
          if (!combinedSourceStatus[src] || combinedSourceStatus[src].status === 'error' || status.rtt < combinedSourceStatus[src].rtt) {
            combinedSourceStatus[src] = status;
          }
        } else if (!combinedSourceStatus[src]) {
          combinedSourceStatus[src] = status;
        }
      }
      if (round < config.timeSync.sampleRounds - 1) await new Promise(r => setTimeout(r, 500));
    }
    setSourceResults(combinedSourceStatus);
    if (allSamples.length === 0) { setSyncStatus('error'); setOffset(0); setAccuracy(null); return; }
    const result = computeFinalOffset(allSamples);
    if (!result) { setSyncStatus('error'); setOffset(0); setAccuracy(null); return; }
    setOffset(result.offset);
    offsetRef.current = result.offset;
    setAccuracy(result.accuracy);
    setSyncStatus('synced');
    setSyncCount(c => c + 1);
    setLastSync(new Date());
    setSamples(allSamples.map(s => ({ ...s, time: Date.now() })));
  }, [collectAllSources, computeFinalOffset]);

  // Run sync on mount + interval
  useEffect(() => {
    performSync();
    const id = setInterval(performSync, config.timeSync.syncInterval);
    return () => clearInterval(id);
  }, [performSync]);

  const getAccurateTime = useCallback(() => {
    const off = offsetRef.current || 0;
    return new Date(Date.now() + off);
  }, []);

  return {
    offset,
    accuracy,
    syncStatus,
    syncCount,
    lastSync,
    samples,
    sourceResults,
    getAccurateTime,
    resync: performSync,
  };
}
