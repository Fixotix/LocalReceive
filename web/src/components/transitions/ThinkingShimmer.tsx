import React, { useState, useEffect } from 'react';

interface ThinkingShimmerProps {
  states?: string[];
  intervalMs?: number;
  className?: string;
  isDark?: boolean;
}

/**
 * Prototype 28 — Thinking State Shimmer from transitions.dev
 * Sweeps a high-contrast shimmer across the text, then transitions smoothly
 * between operational states with subtle blur and translateY.
 */
export const ThinkingShimmer: React.FC<ThinkingShimmerProps> = ({
  states = [
    'Scanning local subnet for active devices...',
    'Establishing zero-cloud WebRTC DataChannel...',
    '1 Gbps wire throughput initialized...',
    'Air-gapped P2P pipe ready for gigabytes...',
  ],
  intervalMs = 3200,
  className = '',
  isDark = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (states.length <= 1) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % states.length);
        setIsTransitioning(false);
      }, 200);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [states, intervalMs]);

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border text-xs font-mono font-medium overflow-hidden transition-colors ${
        isDark
          ? 'bg-[#111111] border-[#222222] text-zinc-300'
          : 'bg-[#f4f4f4] border-[#e2e2e2] text-zinc-700'
      } ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
      <span
        className={`transition-all duration-200 ${
          isTransitioning ? 'opacity-0 blur-[2px] -translate-y-1' : 'opacity-100 blur-0 translate-y-0'
        } shimmer-sweep-continuous`}
      >
        {states[currentIndex]}
      </span>
    </div>
  );
};
