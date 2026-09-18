import React, { useState } from 'react';
import { SolarIcon } from './SolarIcon';
import { SpringToggle } from './SpringToggle';

interface LandingHeroProps {
  isDark: boolean;
  onOpenQR: () => void;
  peerCount: number;
  autoAccept?: boolean;
  onToggleAutoAccept?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  isDark,
  onOpenQR,
  peerCount,
  autoAccept = false,
  onToggleAutoAccept,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-20 overflow-hidden">
      {/* Hairline Grid Guides on Left and Right (efferd.com style) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className={`absolute inset-y-0 left-4 md:left-8 w-px bg-gradient-to-b from-transparent ${isDark ? 'via-white/10 to-transparent' : 'via-black/10 to-transparent'}`} />
        <div className={`absolute inset-y-0 right-4 md:right-8 w-px bg-gradient-to-b from-transparent ${isDark ? 'via-white/10 to-transparent' : 'via-black/10 to-transparent'}`} />
      </div>

      {/* Top Background Spotlight Radial Blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-20 z-0 h-96 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(229,169,60,0.12),transparent_65%)] blur-[40px]"
      />

      {/* Hero Header Section */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center text-center pt-8 pb-12">
        {/* efferd.com Top Announcement Pill */}
        <div
          className={`top-shade inline-flex h-8 items-center gap-2.5 rounded-full border px-3.5 text-xs shadow-xs backdrop-blur-md mb-6 ${
            isDark
              ? 'border-white/15 bg-white/[0.04] text-zinc-300'
              : 'border-black/10 bg-white/70 text-zinc-700'
          }`}
        >
          <div className={`flex h-full items-center border-r pr-2.5 font-medium ${isDark ? 'border-white/15' : 'border-black/10'}`}>
            <span className="w-2 h-2 rounded-full bg-accent animate-ping mr-1.5" />
            <span>LocalReceive v2.0 Released</span>
          </div>
          <a
            href="https://razorpay.me/@prepsnap"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full items-center gap-1 font-semibold text-accent hover:underline"
          >
            <span>Wire Speed: 120MB/s</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
        </div>

        {/* Big Bold Headline with Crisp Linear Gradient */}
        <h1 className="relative font-bold tracking-tight text-3xl sm:text-5xl md:text-6xl lg:text-6xl text-center leading-[1.12]">
          <span className={`block ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Ultra-Fast Local P2P Sharing
          </span>
          <span className="bg-gradient-to-r from-amber-400 via-accent to-amber-500 bg-clip-text text-transparent">
            for Busy &amp; Smart Devices.
          </span>
        </h1>

        {/* Balanced Subtitle */}
        <p className={`mt-5 max-w-xl text-xs sm:text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Transfer gigabytes across Mac, Android, iPhone, Windows &amp; Linux in seconds over your local Wi-Fi. 
          100% air-gapped, zero cloud relays, and zero mobile data consumed.
        </p>

        {/* Action Button Group */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {/* Explore Network / Radar Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`spring-press inline-flex items-center justify-center gap-2 h-10 px-5 rounded-apple-lg text-xs font-bold transition-all border ${
              isDark
                ? 'bg-white text-black hover:bg-zinc-200 border-white/20 shadow-glass-glow'
                : 'bg-zinc-900 text-white hover:bg-black border-black/10'
            }`}
          >
            <SolarIcon name="radio" size={16} color={isDark ? '#000' : '#fff'} />
            <span>Open AirDrop Radar</span>
          </button>

          {/* Android APK Download Button */}
          <a
            href="/LocalReceive.apk"
            download="LocalReceive.apk"
            className={`spring-press shimmer-sweep inline-flex items-center justify-center gap-2 h-10 px-5 rounded-apple-lg text-xs font-bold transition-all border ${
              isDark
                ? 'border-accent/40 bg-accent/15 text-accent hover:bg-accent/25'
                : 'border-accent bg-accent/20 text-amber-900 hover:bg-accent/30'
            }`}
          >
            <SolarIcon name="download" size={16} color="#E5A93C" />
            <span>Download APK</span>
          </a>

          {/* Phone QR Button */}
          <button
            onClick={onOpenQR}
            className={`spring-press inline-flex items-center justify-center gap-2 h-10 px-4 rounded-apple-lg text-xs font-semibold border transition-all ${
              isDark
                ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                : 'border-black/10 bg-black/5 hover:bg-black/10 text-zinc-900'
            }`}
          >
            <SolarIcon name="qrcode" size={16} />
            <span>Connect Phone</span>
          </button>

          {/* Donate for Grow Razorpay Button */}
          <a
            href="https://razorpay.me/@prepsnap"
            target="_blank"
            rel="noopener noreferrer"
            className="spring-press inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-apple-lg text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-accent shadow-glass-glow hover:opacity-90 transition-all"
            title="Support & Donate for Grow"
          >
            <SolarIcon name="heart" size={16} color="#000" />
            <span>Donate to Grow</span>
          </a>
        </div>
      </div>

      {/* Horizontal Divider with efferd.com Crosshairs */}
      <div className="relative my-8 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent">
        <div
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 text-zinc-400 opacity-60 hidden md:block"
        >
          <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5v14" />
          </svg>
        </div>
        <div
          aria-hidden="true"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-zinc-400 opacity-60 hidden md:block"
        >
          <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5v14" />
          </svg>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 12-Card Architectural Wireframe Bento Grid (efferd.com style) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
        {/* Card 1: Auth / Synchronized Handshake */}
        <div
          className={`group top-shade aspect-[16/11] sm:aspect-video rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
            isDark
              ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] dark:bg-[radial-gradient(80%_100%_at_50%_0%,rgba(229,169,60,0.06),transparent)]'
              : 'border-black/10 bg-white/80 hover:bg-white'
          }`}
        >
          <div className="grid grid-cols-2 h-full gap-2 items-center">
            <div className="border-r border-border/60 pr-3 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-accent uppercase tracking-wider font-semibold">01 • Handshake</span>
              <h3 className={`font-bold text-sm sm:text-base mt-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Peer Approval
              </h3>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                No unsolicited drops
              </p>
            </div>
            {/* Wireframe Mockup */}
            <div className="flex flex-col items-center justify-center p-2">
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent mb-2">
                <SolarIcon name="shield-check" size={20} color="#E5A93C" />
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-500/20 mb-1" />
              <div className="w-3/4 h-1.5 rounded-full bg-accent/30" />
            </div>
          </div>
        </div>

        {/* Card 2: Hero Sections / Wire Speed */}
        <div
          className={`group top-shade aspect-[16/11] sm:aspect-video rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
            isDark
              ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] dark:bg-[radial-gradient(80%_100%_at_50%_0%,rgba(48,209,88,0.06),transparent)]'
              : 'border-black/10 bg-white/80 hover:bg-white'
          }`}
        >
          <div className="flex flex-col items-center justify-center text-center h-full relative">
            <div className="absolute inset-y-0 left-3 w-px bg-gradient-to-b from-transparent via-border/50 to-transparent" />
            <div className="absolute inset-y-0 right-3 w-px bg-gradient-to-b from-transparent via-border/50 to-transparent" />
            <span className="text-[10px] font-mono text-success uppercase tracking-wider font-semibold">02 • Speed</span>
            <h3 className={`font-bold text-sm sm:text-base mt-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              120+ MB/s Wire
            </h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Pure Gigabit LAN
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-4 px-2.5 rounded-full bg-success/20 text-success text-[10px] font-mono font-bold flex items-center">
                0ms Internet Ping
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Features / Dual Engine */}
        <div
          className={`group top-shade aspect-[16/11] sm:aspect-video rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
            isDark
              ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              : 'border-black/10 bg-white/80 hover:bg-white'
          }`}
        >
          <div className="flex flex-col justify-center h-full">
            <div className="text-center mb-2.5">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-semibold">03 • Architecture</span>
              <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Dual Transfer Engines
              </h3>
            </div>
            {/* 3 Columns Wireframe */}
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="flex flex-col items-center border-r border-border/40 pr-1">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500/40 mb-1" />
                <span className="text-[9px] font-mono opacity-80">WebRTC</span>
                <span className="text-[8px] text-zinc-500">P2P Pipe</span>
              </div>
              <div className="flex flex-col items-center border-r border-border/40 px-1">
                <div className="w-2.5 h-2.5 rounded-full bg-accent/40 mb-1" />
                <span className="text-[9px] font-mono opacity-80">HTTP 2.0</span>
                <span className="text-[8px] text-zinc-500">Zero Copy</span>
              </div>
              <div className="flex flex-col items-center pl-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 mb-1" />
                <span className="text-[9px] font-mono opacity-80">WebSocket</span>
                <span className="text-[8px] text-zinc-500">Fast Signaling</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Dashboard / Wire-Speed Sparkline */}
        <div
          className={`group top-shade aspect-[16/11] sm:aspect-video rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
            isDark
              ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              : 'border-black/10 bg-white/80 hover:bg-white'
          }`}
        >
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider font-semibold">04 • Telemetry</span>
                <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Live Speedometer
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-accent">1.2 Gbps</span>
            </div>
            {/* Wireframe Sparkline / Equalizer bars */}
            <div className="flex items-end gap-1 h-12 pt-2">
              {[30, 45, 60, 40, 85, 95, 75, 90, 100, 85, 95, 70, 80, 100, 90, 85, 95, 100].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="flex-1 rounded-t-xs bg-gradient-to-t from-accent/20 to-accent transition-all duration-300"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Card 5: App Shell / Zero Friction Dropzone */}
        <div
          className={`group top-shade aspect-[16/11] sm:aspect-video rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
            isDark
              ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              : 'border-black/10 bg-white/80 hover:bg-white'
          }`}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-semibold">05 • Drop Zone</span>
              <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Universal File Drag
              </h3>
            </div>
            {/* Wireframe Browser / Dropzone */}
            <div className="border border-dashed border-purple-400/40 rounded-lg p-2.5 flex items-center justify-center gap-2 bg-purple-500/5">
              <SolarIcon name="upload" size={18} color="#C084FC" />
              <span className="text-[10px] font-medium text-purple-300">Drop 10GB 4K Video or Zip</span>
            </div>
          </div>
        </div>

        {/* Card 6: Header / Peer Status */}
        <div
          className={`group top-shade aspect-[16/11] sm:aspect-video rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
            isDark
              ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              : 'border-black/10 bg-white/80 hover:bg-white'
          }`}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">06 • Discovery</span>
              <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Zero-Config Pairing
              </h3>
            </div>
            {/* Wireframe Header Pill */}
            <div className="border border-border/70 rounded-full py-1.5 px-3 flex items-center justify-between bg-black/5 dark:bg-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-semibold">Local LAN Active</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">{peerCount} Connected</span>
            </div>
          </div>
        </div>

        {/* Card 7: Call to Action / Auto-Receive Switch (transitions.dev Prototype 27 Switch!) */}
        <div
          className={`group top-shade aspect-[16/11] sm:aspect-video rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] border-accent/40 ${
            isDark
              ? 'bg-accent/[0.04] dark:bg-[radial-gradient(80%_100%_at_50%_0%,rgba(229,169,60,0.1),transparent)]'
              : 'bg-amber-50/80 hover:bg-amber-50'
          }`}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] font-mono text-accent uppercase tracking-wider font-semibold">07 • transitions.dev</span>
              <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Direct Auto-Receive
              </h3>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Double-bounce spring switch
              </p>
            </div>
            {/* Interactive Spring Toggle from transitions.dev */}
            <div className="flex items-center justify-between pt-2 border-t border-accent/20">
              <span className="text-[11px] font-medium">
                {autoAccept ? 'Auto-Download: ON' : 'Auto-Download: OFF'}
              </span>
              <SpringToggle
                checked={autoAccept}
                onChange={onToggleAutoAccept || (() => {})}
                ariaLabel="Toggle Direct Auto-Receive"
              />
            </div>
          </div>
        </div>

        {/* Card 8: Footer / Air-Gapped Zero Cloud */}
        <div
          className={`group top-shade aspect-[16/11] sm:aspect-video rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
            isDark
              ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              : 'border-black/10 bg-white/80 hover:bg-white'
          }`}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">08 • Security</span>
              <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                100% Air-Gapped LAN
              </h3>
            </div>
            {/* Wireframe Subnet Lines */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>Cloud Uplink</span>
                <span className="text-red-400 font-bold">0 KB Blocked</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>Local Subnet</span>
                <span className="text-cyan-400 font-bold">192.168.x.x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 9: Integrations / Radar Topology */}
        <div
          className={`group top-shade aspect-[16/11] sm:aspect-video rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
            isDark
              ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              : 'border-black/10 bg-white/80 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between h-full">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">09 • Ecosystem</span>
              <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Cross-Platform
              </h3>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Mac • Android • iOS • PC
              </p>
            </div>
            {/* Wireframe Connected Node Cluster */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-accent/40 border border-accent flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div className="absolute -top-1 left-2 w-3.5 h-3.5 rounded-full bg-zinc-500/40 border border-white/20" />
              <div className="absolute -bottom-1 right-2 w-3.5 h-3.5 rounded-full bg-zinc-500/40 border border-white/20" />
              <div className="absolute top-2 -right-1 w-3.5 h-3.5 rounded-full bg-zinc-500/40 border border-white/20" />
            </div>
          </div>
        </div>

        {/* Card 10: Clipboard / Instant Text Sync */}
        <div
          className={`group top-shade aspect-[16/11] sm:aspect-video rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
            isDark
              ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              : 'border-black/10 bg-white/80 hover:bg-white'
          }`}
        >
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">10 • Clipboard</span>
                <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Instant Text Sync
                </h3>
              </div>
              <SolarIcon name="clipboard" size={18} color="#818CF8" />
            </div>
            {/* Wireframe Text Paragraph Lines */}
            <div className="space-y-1.5 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border/40">
              <div className="w-full h-1.5 rounded-full bg-zinc-500/30" />
              <div className="w-4/5 h-1.5 rounded-full bg-zinc-500/20" />
              <div className="w-2/3 h-1.5 rounded-full bg-indigo-400/40" />
            </div>
          </div>
        </div>

        {/* Card 11: Support & Donate for Grow (Razorpay) */}
        <div
          className={`group top-shade aspect-[16/11] sm:aspect-video rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-accent/5 to-transparent shadow-glass-glow`}
        >
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider font-semibold">11 • Support</span>
                <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Donate for Grow
                </h3>
              </div>
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent animate-pulse">
                <SolarIcon name="heart" size={15} color="#E5A93C" />
              </div>
            </div>
            <a
              href="https://razorpay.me/@prepsnap"
              target="_blank"
              rel="noopener noreferrer"
              className="spring-press w-full py-2 px-3 rounded-lg bg-accent text-black font-extrabold text-[11px] text-center shadow-glass-glow hover:opacity-90 transition-all"
            >
              Support on Razorpay ↗
            </a>
          </div>
        </div>

        {/* Card 12: Native Android APK (Under 5 MB) */}
        <div
          className={`group top-shade aspect-[16/11] sm:aspect-video rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] border-emerald-500/40 bg-emerald-500/5`}
        >
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">12 • Native Android</span>
                <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Lightweight APK
                </h3>
                <p className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Native Android Package
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <SolarIcon name="smartphone" size={18} color="#30D158" />
              </div>
            </div>
            <a
              href="/LocalReceive.apk"
              download="LocalReceive.apk"
              className="spring-press shimmer-sweep w-full py-2 px-3 rounded-lg bg-emerald-500 text-black font-extrabold text-[11px] text-center hover:bg-emerald-400 transition-all"
            >
              Direct APK Download ⤓
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Architectural Signature (efferd.com style) */}
      <div className="mt-14 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>LocalReceive</span>
          <span className="text-zinc-500">— Zero-Cloud High Speed File Relay</span>
        </div>
        <div className="flex items-center space-x-4 font-medium text-zinc-500">
          <button onClick={handleCopyLink} className="hover:text-accent transition-colors">
            {copiedLink ? '✓ Copied Link' : 'Copy Web Link'}
          </button>
          <span>•</span>
          <a
            href="https://razorpay.me/@prepsnap"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            Donate on Razorpay
          </a>
          <span>•</span>
          <a
            href="/LocalReceive.apk"
            download="LocalReceive.apk"
            className="hover:text-accent transition-colors font-semibold text-emerald-500"
          >
            Android APK
          </a>
        </div>
      </div>
    </section>
  );
};
