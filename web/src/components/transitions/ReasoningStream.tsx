import React, { useState, useEffect } from 'react';

interface StreamItem {
  id: string;
  time: string;
  badge: string;
  message: string;
}

interface ReasoningStreamProps {
  className?: string;
  isDark?: boolean;
}

/**
 * Prototype 29 — Reasoning Stream Viewport from transitions.dev
 * A card that is a viewport onto live event streams, stepping up smoothly
 * with soft top/bottom blur masks.
 */
export const ReasoningStream: React.FC<ReasoningStreamProps> = ({
  className = '',
  isDark = true,
}) => {
  const [items, setItems] = useState<StreamItem[]>([
    { id: '1', time: '18:50:01', badge: 'NET', message: 'Local network interface en0 detected (192.168.1.10)' },
    { id: '2', time: '18:50:04', badge: 'PEER', message: 'Handshake completed with Android device over LAN' },
    { id: '3', time: '18:50:09', badge: 'PIPE', message: 'Zero-copy direct HTTP streaming channel verified' },
    { id: '4', time: '18:50:15', badge: 'SYNC', message: 'Direct Auto-Receive enabled — 0ms wait time' },
  ]);

  useEffect(() => {
    const streamTemplates = [
      { badge: 'RADAR', message: 'Peer beacon broadcasting on port 5050' },
      { badge: 'SPEED', message: 'Local loop throughput benchmark: 118.4 MB/s' },
      { badge: 'SEC', message: 'Air-gapped verification: 0 external packets sent' },
      { badge: 'CHUNK', message: '64MB chunk buffer stream allocated for fast I/O' },
    ];

    const timer = setInterval(() => {
      const template = streamTemplates[Math.floor(Math.random() * streamTemplates.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setItems((prev) => [
        ...prev.slice(-6),
        {
          id: Math.random().toString(),
          time: timeStr,
          badge: template.badge,
          message: template.message,
        },
      ]);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`relative rounded-xl border p-4 font-mono text-xs overflow-hidden ${
        isDark ? 'bg-[#0A0A0A] border-[#222222] text-zinc-300' : 'bg-[#FAFAFA] border-[#E5E5E5] text-zinc-800'
      } ${className}`}
    >
      {/* Soft Top and Bottom Edge Fades (transitions.dev P29) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#0A0A0A] dark:from-[#0A0A0A] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#0A0A0A] dark:from-[#0A0A0A] to-transparent z-10" />

      <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 text-[10px] uppercase text-zinc-500 font-bold">
        <span>LAN Telemetry Stream</span>
        <span className="flex items-center gap-1.5 text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Live Wire
        </span>
      </div>

      <div className="space-y-2 py-1 max-h-36 overflow-y-auto no-scrollbar">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-1"
          >
            <span className="text-[10px] text-zinc-500 shrink-0">{item.time}</span>
            <span className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[9px] font-bold shrink-0">
              {item.badge}
            </span>
            <span className="text-[11px] leading-tight text-zinc-400 truncate">{item.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
