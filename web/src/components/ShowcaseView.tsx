import React, { useState, useEffect } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { FaqsSection } from './faqs-page';
import { GithubIcon } from '@/components/icons/github-icon';
import { copyToClipboard } from '../utils/clipboard';
import {
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  SmartphoneIcon,
  LaptopIcon,
  TerminalIcon,
  ArrowRightIcon,
  StarIcon,
  ExternalLinkIcon,
  HeartIcon,
} from 'lucide-react';

interface ShowcaseViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onLaunchApp?: () => void;
}

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({
  isDark,
  onToggleTheme,
  onLaunchApp,
}) => {
  const [starCount, setStarCount] = useState<number | null>(null);
  const [copiedCommand, setCopiedCommand] = useState(false);

  // Fetch real-time GitHub stars count
  useEffect(() => {
    let isMounted = true;
    fetch('https://api.github.com/repos/Fixotix/LocalReceive')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted && typeof data.stargazers_count === "number") {
          setStarCount(data.stargazers_count);
        }
      })
      .catch((err) => {
        console.debug('Failed to fetch GitHub stars:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const quickStartSnippet = `git clone https://github.com/Fixotix/LocalReceive.git\ncd LocalReceive\nnpm install\nnpm start`;

  const handleCopyCommand = async () => {
    const success = await copyToClipboard(quickStartSnippet);
    if (success) {
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2500);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans selection:bg-accent/30 ${
        isDark ? 'bg-[#0B0C10] text-[#ededed]' : 'bg-[#FAFAFB] text-[#0d0d0d]'
      }`}
    >
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. Header with Live GitHub Stars & Theme Toggle               */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Header isDark={isDark} onToggleTheme={onToggleTheme} />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. Hero Section: Open-Source Offline AirDrop                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section
        id="overview"
        className="relative w-full overflow-hidden -mt-16 sm:-mt-20 pt-32 sm:pt-38 md:pt-42 pb-16 transition-all duration-300"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 75% 55% at 15% 15%, rgba(147, 51, 234, 0.22), transparent 65%), radial-gradient(ellipse 70% 50% at 85% 20%, rgba(20, 184, 166, 0.16), transparent 65%), linear-gradient(180deg, #12131A 0%, #0E0F15 60%, #0A0B0E 100%)'
            : 'radial-gradient(ellipse 75% 55% at 15% 15%, rgba(168, 85, 247, 0.16), transparent 65%), radial-gradient(ellipse 70% 50% at 85% 20%, rgba(20, 184, 166, 0.13), transparent 65%), linear-gradient(180deg, #F6F6F9 0%, #EDEDF3 60%, #E3E4EA 100%)',
        }}
      >
        {/* SVG Noise Texture Overlay */}
        <div className="absolute inset-0 bg-noise pointer-events-none opacity-40" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 pt-2 sm:pt-6">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/40 bg-accent/10 text-accent text-xs font-mono font-bold tracking-wide mb-4 shadow-xs">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            <span>100% Free &amp; Open Source • Wire-Speed Offline LAN</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.15]">
            <span className="block font-serif italic font-light text-foreground/85">
              AirDrop for Everyone
            </span>
            <span className="block font-sans font-extrabold text-foreground tracking-tight mt-1 sm:mt-1.5">
              LocalReceive
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            Wire-speed peer-to-peer file sharing across <b>Mac, Windows, Linux, Android &amp; iOS</b> over
            your local Wi-Fi or mobile hotspot. Zero internet connection required. Zero cloud servers.
            Pure device-to-device speed up to <b>120+ MB/s</b>.
          </p>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/Fixotix/LocalReceive"
              target="_blank"
              rel="noopener noreferrer"
              className="spring-press h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-accent text-black font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-[0_4px_24px_rgba(229,169,60,0.35)] hover:bg-accent/90 active:scale-95 transition-all group"
            >
              <GithubIcon className="size-4 sm:size-5 fill-current group-hover:scale-110 transition-transform" />
              <span>Star on GitHub</span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/15 font-mono text-xs font-black">
                <StarIcon className="size-3.5 fill-black text-black" />
                <span>{starCount !== null ? starCount.toLocaleString() : '0'}</span>
              </span>
            </a>

            {onLaunchApp ? (
              <button
                onClick={onLaunchApp}
                className="spring-press h-11 sm:h-12 px-5 sm:px-6 rounded-full border border-border/80 bg-background/80 hover:bg-background text-foreground font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs active:scale-95 transition-all backdrop-blur-xs"
              >
                <LaptopIcon className="size-4 text-emerald-500" />
                <span>Open AirDrop Dashboard</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 text-[11px] font-mono font-bold">
                  Local LAN
                </span>
              </button>
            ) : (
              <a
                href="#quickstart"
                className="spring-press h-11 sm:h-12 px-5 sm:px-6 rounded-full border border-border/80 bg-background/80 hover:bg-background text-foreground font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs active:scale-95 transition-all backdrop-blur-xs"
              >
                <TerminalIcon className="size-4 text-amber-500" />
                <span>Run Offline Guide</span>
              </a>
            )}

            <a
              href="#quickstart"
              className="spring-press h-11 sm:h-12 px-5 rounded-full border border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all"
            >
              <TerminalIcon className="size-4 text-accent" />
              <span>Run Offline Guide</span>
              <ArrowRightIcon className="size-3.5 opacity-70" />
            </a>
          </div>

          {/* Quick Stats Strip */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3 rounded-2xl border border-border/60 bg-background/50 backdrop-blur-xs">
              <span className="block text-xl sm:text-2xl font-black text-foreground font-mono">120+ MB/s</span>
              <span className="text-[11px] text-muted-foreground">Wire-Speed Transfer</span>
            </div>
            <div className="p-3 rounded-2xl border border-border/60 bg-background/50 backdrop-blur-xs">
              <span className="block text-xl sm:text-2xl font-black text-emerald-500 font-mono">0 KB</span>
              <span className="text-[11px] text-muted-foreground">Internet Data Used</span>
            </div>
            <div className="p-3 rounded-2xl border border-border/60 bg-background/50 backdrop-blur-xs">
              <span className="block text-xl sm:text-2xl font-black text-accent font-mono">328 KB</span>
              <span className="text-[11px] text-muted-foreground">Native Android APK</span>
            </div>
            <div className="p-3 rounded-2xl border border-border/60 bg-background/50 backdrop-blur-xs">
              <span className="block text-xl sm:text-2xl font-black text-purple-400 font-mono">MIT</span>
              <span className="text-[11px] text-muted-foreground">100% Open Source</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. Quick Start Interactive Terminal Window (#quickstart)     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="quickstart" className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
            Quick Start
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mt-1 text-foreground">
            Run LocalReceive Offline in 60 Seconds
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Run a single command on your Mac, Windows, or Linux laptop. No cloud account or configuration needed.
          </p>
        </div>

        {/* macOS Terminal Mockup */}
        <div className="rounded-2xl border border-border/80 bg-[#0E1017] shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
          {/* Terminal Window Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#161822] border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#FF5F56]" />
              <span className="size-3 rounded-full bg-[#FFBD2E]" />
              <span className="size-3 rounded-full bg-[#27C93F]" />
              <span className="text-[11px] text-zinc-400 font-sans pl-2 hidden sm:inline">
                Fixotix/LocalReceive — zsh (Offline LAN Engine)
              </span>
            </div>

            <button
              onClick={handleCopyCommand}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-sans font-medium transition-all active:scale-95"
            >
              {copiedCommand ? (
                <>
                  <CheckIcon className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="size-3.5" />
                  <span>Copy Commands</span>
                </>
              )}
            </button>
          </div>

          {/* Terminal Body */}
          <div className="p-4 sm:p-6 text-zinc-300 space-y-4 leading-relaxed overflow-x-auto">
            <div>
              <p className="text-zinc-500"># 1. Clone the open-source repository</p>
              <p className="text-emerald-400">
                <span className="text-accent">&gt; </span>git clone https://github.com/Fixotix/LocalReceive.git
              </p>
              <p className="text-emerald-400">
                <span className="text-accent">&gt; </span>cd LocalReceive
              </p>
            </div>

            <div>
              <p className="text-zinc-500"># 2. Start the standalone offline LAN hub</p>
              <p className="text-emerald-400">
                <span className="text-accent">&gt; </span>npm install &amp;&amp; npm start
              </p>
            </div>

            {/* Simulated Terminal Output */}
            <div className="mt-4 p-4 rounded-xl bg-[#090A0E] border border-white/[0.05] text-[11px] sm:text-xs text-zinc-400 space-y-1">
              <p className="text-zinc-500">╔═══════════════════════════════════════════════════════════╗</p>
              <p className="text-accent font-bold">║                ⚡ LOCALRECEIVE LAN HUB ⚡                 ║</p>
              <p className="text-zinc-500">╚═══════════════════════════════════════════════════════════╝</p>
              <p className="text-emerald-400">📡 Local:       http://localhost:5050</p>
              <p className="text-cyan-400">🌐 Wi-Fi (LAN): http://192.168.1.10:5050</p>
              <p className="text-purple-400">🔒 Mode:        100% Offline LAN • Zero Cloud Overhead</p>
              <p className="text-zinc-500 pt-2">📲 Terminal ASCII QR Code generated automatically!</p>
              <p className="text-zinc-300">Point your iPhone or Android camera to connect in 1 second.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. How It Works (Step-by-Step Visual Cards)                  */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
            Workflow
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mt-1 text-foreground">
            How Local AirDrop Works Without Internet
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Traditional AirDrop requires Apple hardware. LocalReceive brings that same instant magical experience to every platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#111218] border-white/[0.08]' : 'bg-white border-black/[0.06] shadow-sm'
          }`}>
            <div className="size-12 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-mono font-bold text-lg mb-4">
              01
            </div>
            <h3 className="font-bold text-lg text-foreground">Start LAN Engine</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Run <code className="px-1.5 py-0.5 rounded bg-muted text-accent font-mono text-xs">npm start</code> on your laptop. LocalReceive automatically detects your local Wi-Fi router IP and prints an ASCII QR code.
            </p>
          </div>

          {/* Step 2 */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#111218] border-white/[0.08]' : 'bg-white border-black/[0.06] shadow-sm'
          }`}>
            <div className="size-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-mono font-bold text-lg mb-4">
              02
            </div>
            <h3 className="font-bold text-lg text-foreground">Scan with Phone</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Open your phone camera and scan the QR code. The interface opens instantly in Safari or Chrome without installing an app. Both devices discover each other in milliseconds.
            </p>
          </div>

          {/* Step 3 */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#111218] border-white/[0.08]' : 'bg-white border-black/[0.06] shadow-sm'
          }`}>
            <div className="size-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-mono font-bold text-lg mb-4">
              03
            </div>
            <h3 className="font-bold text-lg text-foreground">Beam at Wire-Speed</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Select files or whole folders and beam them at 50 to 120+ MB/s over 5GHz Wi-Fi. With Direct Auto-Receive, files save automatically without clicking accept.
            </p>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. 3D Concentric Radar Dome (Interactive Interface Preview)   */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="demo" className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-mono font-semibold mb-2">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span>Interactive Offline UI Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            The Concentric Radar Dome Experience
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            This is the real user interface that launches on your local network when you run LocalReceive.
          </p>
        </div>

        {/* Concentric Dome Showcase */}
        <div className="relative overflow-hidden flex flex-col items-center">
          {/* Telemetry Badges */}
          <div className="w-full max-w-4xl px-8 flex items-center justify-between z-20 mb-2">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-medium text-muted-foreground">
              <span className="size-2 rounded-full bg-[#E5A93C] animate-pulse" />
              <span className="font-bold text-foreground">Direct LAN</span>
              <span className="opacity-70">#100% Offline</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-medium text-muted-foreground">
              <span className="size-2 rounded-full bg-[#0891B2]" />
              <span className="font-bold text-foreground">Dual WebRTC</span>
              <span className="opacity-70">#1.2 Gbps</span>
            </div>
          </div>

          {/* Dome Stage */}
          <div className="relative w-full max-w-4xl h-[320px] sm:h-[380px] md:h-[400px] flex justify-center items-end">
            {/* Outer Tier 1 */}
            <div
              className={`absolute bottom-0 w-[740px] sm:w-[880px] md:w-[940px] h-[370px] sm:h-[440px] md:h-[470px] rounded-t-full radial-disc-1 transition-all border-t border-x ${
                isDark
                  ? 'bg-[#151620]/75 border-white/[0.07]'
                  : 'bg-[#DADCE2]/75 border-white/60'
              }`}
            />

            {/* Middle Tier 2 */}
            <div
              className={`absolute bottom-0 w-[550px] sm:w-[680px] md:w-[720px] h-[275px] sm:h-[340px] md:h-[360px] rounded-t-full radial-disc-2 transition-all border-t border-x ${
                isDark
                  ? 'bg-[#191A26]/85 border-white/[0.08]'
                  : 'bg-[#E1E3E9]/85 border-white/70'
              }`}
            />

            {/* Real Big Device Cards Showcase on Dome */}
            <div className="absolute top-4 sm:top-8 inset-x-4 sm:inset-x-8 z-30 flex flex-wrap items-center justify-center gap-4">
              {/* Device 1: Host Computer */}
              <div
                className={`flex items-center justify-between gap-4 p-4 rounded-2xl border shadow-xl ${
                  isDark
                    ? 'bg-[#181A26]/95 border-white/10 text-white'
                    : 'bg-white/95 border-black/10 text-zinc-900'
                } min-w-[270px] sm:min-w-[320px] backdrop-blur-md`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center size-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                    <LaptopIcon className="size-6" />
                    <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm sm:text-base">Devendra's MacBook</span>
                    <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                      <span className="text-emerald-400 font-semibold">● LAN Active</span>
                      <span>•</span>
                      <span>192.168.1.10</span>
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-accent/20 text-accent font-mono text-xs font-bold">
                  Host
                </span>
              </div>

              {/* Device 2: Paired Phone */}
              <div
                className={`flex items-center justify-between gap-4 p-4 rounded-2xl border shadow-xl ${
                  isDark
                    ? 'bg-[#181A26]/95 border-white/10 text-white'
                    : 'bg-white/95 border-black/10 text-zinc-900'
                } min-w-[270px] sm:min-w-[320px] backdrop-blur-md`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center size-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <SmartphoneIcon className="size-6" />
                    <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm sm:text-base">Google Pixel 8</span>
                    <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                      <span className="text-emerald-400 font-semibold">● Paired (QR)</span>
                      <span>•</span>
                      <span>192.168.1.42</span>
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                  Online
                </span>
              </div>
            </div>

            {/* Inner Tier 3 Anchor */}
            <div
              className={`absolute bottom-0 w-[360px] sm:w-[440px] h-[140px] sm:h-[160px] rounded-t-full radial-disc-3 transition-all border-t border-x flex flex-col items-center justify-start pt-3 ${
                isDark
                  ? 'bg-[#202232]/95 border-white/[0.1]'
                  : 'bg-[#ECEEF4]/95 border-white/90'
              }`}
            >
              <div className="flex flex-col items-center gap-1 z-20">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 bg-background shadow-xs">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-foreground">Local LAN Hub Active</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground mt-1">
                  Auto-Discovery • Zero Cloud Setup
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. Bento Grid Section (#features)                            */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="features" className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-5 scroll-mt-20">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mt-1 text-foreground">
            Engineered for Pure Performance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Wire-Speed Dual Engine */}
          <div
            className={`rounded-[28px] border p-6 md:p-7 flex flex-col justify-between transition-all ${
              isDark ? 'bg-[#111218] border-white/[0.08]' : 'bg-[#F4F4F6] border-black/[0.06]'
            }`}
          >
            <div>
              <h3 className="font-serif text-2xl md:text-3xl font-normal tracking-tight">
                Wire-Speed LAN
              </h3>
              <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                Stream 4K videos, massive zip archives, and raw folders over 5GHz Wi-Fi / Ethernet at
                up to 120+ MB/s without cloud throttling.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border/70 bg-background/80 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Direct LAN Stream</span>
                <span className="font-mono text-emerald-500 font-bold">124.8 MB/s</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-4/5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1">
                <span>Chunk: 64 KB zero-copy</span>
                <span>Latency: &lt; 2ms</span>
              </div>
            </div>
          </div>

          {/* Card 2: Direct Auto-Receive */}
          <div
            className={`rounded-[28px] border p-6 md:p-7 flex flex-col justify-between transition-all ${
              isDark ? 'bg-[#111218] border-white/[0.08]' : 'bg-[#F4F4F6] border-black/[0.06]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl md:text-3xl font-normal tracking-tight">
                  Auto-Receive
                </h3>
                <span className="px-2.5 py-0.5 rounded-full border border-accent/40 bg-accent/10 text-accent font-mono text-[10px] font-bold">
                  Zero Prompt →
                </span>
              </div>
              <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                Receive incoming transfers straight to your device without repetitive manual confirmation prompts
                using tactile double-bounce spring physics.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border/70 bg-background/80 p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Zero-Prompt Save</span>
                <span className="text-[10px] text-muted-foreground">Direct to Downloads folder</span>
              </div>
              <span className="size-3 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </div>

          {/* Card 3: Air-Gapped Privacy */}
          <div
            className={`rounded-[28px] border p-6 md:p-7 flex flex-col justify-between transition-all ${
              isDark ? 'bg-[#111218] border-white/[0.08]' : 'bg-[#F4F4F6] border-black/[0.06]'
            }`}
          >
            <div>
              <h3 className="font-serif text-2xl md:text-3xl font-normal tracking-tight">
                Air-Gapped Privacy
              </h3>
              <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                Works 100% offline without external internet. End-to-end local network encryption.
                Zero telemetry or files ever leave your physical room.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border/70 bg-[#0D0E15] text-[#EDEDED] p-3.5 font-mono text-[11px] space-y-1.5 overflow-hidden shadow-inner">
              <div className="flex items-center gap-1.5 pb-2 border-b border-white/10">
                <span className="size-2 rounded-full bg-rose-500/80" />
                <span className="size-2 rounded-full bg-amber-500/80" />
                <span className="size-2 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-zinc-400 pl-1 font-sans">LocalReceive Security</span>
              </div>
              <p className="text-emerald-400">
                <span className="text-zinc-500">&gt; </span>cipher: AES-GCM-256
              </p>
              <p className="text-zinc-300">
                <span className="text-zinc-500">&gt; </span>external_internet: false
              </p>
              <p className="text-accent">
                <span className="text-zinc-500">&gt; </span>status: air_gapped_secure
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Phone QR Pairing & Native APK */}
        <div
          className={`rounded-[28px] border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
            isDark ? 'bg-[#111218] border-white/[0.08]' : 'bg-[#F4F4F6] border-black/[0.06]'
          }`}
        >
          <div className="space-y-2 max-w-xl text-left">
            <h3 className="font-serif text-2xl md:text-3xl font-normal tracking-tight">
              Instant Phone QR Pairing &amp; Native Companion APK
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Scan the terminal QR code with any iPhone or Android camera to open LocalReceive instantly in Safari or Chrome without installing an app, or download our lightweight native Android APK (328 KB).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://github.com/Fixotix/LocalReceive"
              target="_blank"
              rel="noopener noreferrer"
              className="spring-press h-10 px-5 rounded-full border border-border/80 bg-background hover:bg-muted text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <GithubIcon className="size-3.5 fill-current" />
              <span>View Source</span>
            </a>

            <a
              href="/LocalReceive.apk"
              download="LocalReceive.apk"
              className="spring-press h-10 px-5 rounded-full bg-[#6366F1] hover:bg-[#5254E0] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <DownloadIcon className="size-4" />
              <span>Download APK (328 KB) →</span>
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. Support & Donate Section (#donate)                         */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="donate" className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 mb-12 scroll-mt-20">
        <div
          className={`rounded-[28px] border p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 ${
            isDark ? 'bg-[#111218] border-white/[0.08]' : 'bg-[#F4F4F6] border-black/[0.06]'
          }`}
        >
          <div className="flex items-center gap-4 text-left">
            <div className="size-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
              <HeartIcon className="size-6 text-accent fill-accent/40" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-normal tracking-tight">
                Support LocalReceive Open-Source Development
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                LocalReceive is 100% free and open-source. Support development to keep it fast, private, and air-gapped.
              </p>
            </div>
          </div>

          <a
            href="https://razorpay.me/@prepsnap"
            target="_blank"
            rel="noopener noreferrer"
            className="spring-press inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-accent hover:bg-accent/90 text-black font-bold text-xs shadow-xs shrink-0 transition-colors"
          >
            <span>Donate via Razorpay</span>
            <ExternalLinkIcon className="size-3.5" />
          </a>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 8. FAQs Section (#faq)                                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 mb-16 scroll-mt-20">
        <FaqsSection />
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 9. Clean Footer                                              */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
};

