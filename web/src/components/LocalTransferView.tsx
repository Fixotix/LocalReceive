import React, { useState, useRef } from 'react';
import { Peer, HostInfo, ActiveTransfer } from '../types';
import { Header } from './header';
import { Footer } from './footer';
import { FaqsSection } from './faqs-page';
import { SpringToggle } from './SpringToggle';
import { copyToClipboard } from '../utils/clipboard';
import {
  ZapIcon,
  DownloadIcon,
  QrCodeIcon,
  MessageSquareIcon,
  HistoryIcon,
  HeartIcon,
  Edit3Icon,
  ExternalLinkIcon,
  CopyIcon,
  SmartphoneIcon,
  LaptopIcon,
  MonitorIcon,
} from 'lucide-react';

interface LocalTransferViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
  myPeer: Peer | null;
  peers: Peer[];
  hostInfo: HostInfo | null;
  localUrl: string;
  autoAccept: boolean;
  onToggleAutoAccept: () => void;
  onOpenQR: () => void;
  onOpenTextShare: () => void;
  onOpenDrawer: () => void;
  onEditDeviceName: () => void;
  onSelectPeerToSend: (peer: Peer, fileList: FileList) => void;
  activeTransfer: ActiveTransfer | null;
}

export const LocalTransferView: React.FC<LocalTransferViewProps> = ({
  isDark,
  onToggleTheme,
  myPeer,
  peers,
  localUrl,
  autoAccept,
  onToggleAutoAccept,
  onOpenQR,
  onOpenTextShare,
  onOpenDrawer,
  onEditDeviceName,
  onSelectPeerToSend,
}) => {
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null);

  const isNativeApp =
    typeof navigator !== 'undefined' &&
    navigator.userAgent.includes('LocalReceiveApp');

  const handlePeerClick = (peer: Peer) => {
    setSelectedPeer(peer);
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetPeer = selectedPeer || (peers.length > 0 ? peers[0] : null);
    if (targetPeer && e.target.files && e.target.files.length > 0) {
      onSelectPeerToSend(targetPeer, e.target.files);
      e.target.value = '';
    } else if (!targetPeer && e.target.files && e.target.files.length > 0) {
      onOpenQR();
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(localUrl || window.location.origin);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans selection:bg-accent/30 ${
        isDark ? 'bg-[#0B0C10] text-[#ededed]' : 'bg-[#FAFAFB] text-[#0d0d0d]'
      }`}
    >
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. Clean Top Header (Matches Solar Icons top nav)            */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Header
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onOpenQR={onOpenQR}
        onOpenTextShare={onOpenTextShare}
        onOpenDrawer={onOpenDrawer}
      />

      {/* Hidden File Input for instant sending */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        className="hidden"
      />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. Full-Size Borderless Hero Section                          */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section
        id="send"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (peers.length > 0 && e.dataTransfer.files.length > 0) {
            onSelectPeerToSend(peers[0], e.dataTransfer.files);
          } else if (e.dataTransfer.files.length > 0) {
            onOpenQR();
          }
        }}
        className={`relative w-full overflow-hidden -mt-16 sm:-mt-20 pt-32 sm:pt-38 md:pt-42 pb-0 scroll-mt-6 transition-all duration-300 ${
          dragOver ? 'ring-2 ring-accent' : ''
        }`}
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 75% 55% at 15% 15%, rgba(147, 51, 234, 0.22), transparent 65%), radial-gradient(ellipse 70% 50% at 85% 20%, rgba(20, 184, 166, 0.16), transparent 65%), linear-gradient(180deg, #12131A 0%, #0E0F15 60%, #0A0B0E 100%)'
            : 'radial-gradient(ellipse 75% 55% at 15% 15%, rgba(168, 85, 247, 0.16), transparent 65%), radial-gradient(ellipse 70% 50% at 85% 20%, rgba(20, 184, 166, 0.13), transparent 65%), linear-gradient(180deg, #F6F6F9 0%, #EDEDF3 60%, #E3E4EA 100%)',
        }}
      >
        {/* SVG Noise Texture Overlay for authentic Solar Icons film look */}
        <div className="absolute inset-0 bg-noise pointer-events-none opacity-40" />

        {/* Heading */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 pt-2 sm:pt-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.15]">
            <span className="block font-serif italic font-light text-foreground/85">
              LocalReceive for
            </span>
            <span className="block font-sans font-extrabold text-foreground tracking-tight mt-1 sm:mt-1.5">
              Instant AirDrop
            </span>
          </h1>

            {/* Subtitle */}
            <p className="mt-3.5 max-w-xl mx-auto text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              Zero internet required. Wire-speed peer-to-peer file sharing across all your devices
              packaged for high-performance local networks.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  if (peers.length > 0) {
                    setSelectedPeer(peers[0]);
                  }
                  fileInputRef.current?.click();
                }}
                className="spring-press h-10 sm:h-11 px-6 rounded-full bg-[#6366F1] hover:bg-[#5254E0] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-[0_8px_20px_rgba(99,102,241,0.35)] active:scale-95 transition-all"
              >
                <ZapIcon className="size-4 fill-white" />
                <span>Select Files to Send</span>
              </button>

                <button
                  onClick={onOpenQR}
                  className="spring-press h-10 sm:h-11 px-5 rounded-full border border-border/80 bg-background/80 hover:bg-background text-foreground text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs active:scale-95 transition-all backdrop-blur-xs"
                >
                  <QrCodeIcon className="size-4 text-purple-400" />
                  <span>Pair Phone (QR)</span>
                </button>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* 3D Concentric Radial Stage (Exact replica from Image 1)     */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div id="devices" className="relative mt-8 sm:mt-12 overflow-hidden flex flex-col items-center scroll-mt-10">
            {/* Side Telemetry Badges (Like Primary #845309 and Duotone #0891B2) */}
            <div className="w-full max-w-4xl px-8 flex items-center justify-between z-20 mb-2">
              {/* Left Badge */}
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-medium text-muted-foreground">
                <span className="size-2 rounded-full bg-[#E5A93C] animate-pulse" />
                <span className="font-bold text-foreground">Direct LAN</span>
                <span className="opacity-70">#100% Offline</span>
              </div>

              {/* Right Badge */}
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-medium text-muted-foreground">
                <span className="size-2 rounded-full bg-[#0891B2]" />
                <span className="font-bold text-foreground">Dual WebRTC</span>
                <span className="opacity-70">#1.2 Gbps</span>
              </div>
            </div>

            {/* The Concentric Semi-Circular Dome System */}
            <div
              className={`relative w-full max-w-4xl h-[320px] sm:h-[380px] md:h-[420px] flex justify-center items-end transition-all ${
                dragOver ? 'scale-[1.02]' : ''
              }`}
            >
              {/* Outer Tier 1 */}
              <div
                className={`absolute bottom-0 w-[740px] sm:w-[880px] md:w-[940px] h-[370px] sm:h-[440px] md:h-[470px] rounded-t-full radial-disc-1 transition-all duration-300 border-t border-x ${
                  isDark
                    ? 'bg-[#151620]/75 border-white/[0.07]'
                    : 'bg-[#DADCE2]/75 border-white/60'
                }`}
              />

              {/* Middle Tier 2 */}
              <div
                className={`absolute bottom-0 w-[550px] sm:w-[680px] md:w-[720px] h-[275px] sm:h-[340px] md:h-[360px] rounded-t-full radial-disc-2 transition-all duration-300 border-t border-x ${
                  isDark
                    ? 'bg-[#191A26]/85 border-white/[0.08]'
                    : 'bg-[#E1E3E9]/85 border-white/70'
                }`}
              />

              {/* Prominent Big Device Cards or Active Radar Scanning State */}
              {peers.length > 0 ? (
                <div className="absolute top-4 sm:top-8 inset-x-4 sm:inset-x-8 z-30 flex flex-wrap items-center justify-center gap-4 max-h-[220px] sm:max-h-[260px] overflow-y-auto px-2 py-1 scrollbar-thin">
                  {peers.map((peer) => (
                    <div
                      key={peer.id}
                      onClick={() => handlePeerClick(peer)}
                      className={`group relative cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 active:scale-[0.98] shadow-xl hover:shadow-2xl ${
                        isDark
                          ? 'bg-[#181A26]/95 hover:bg-[#1E2032] border-white/10 hover:border-accent/60 text-white'
                          : 'bg-white/95 hover:bg-white border-black/10 hover:border-accent text-zinc-900'
                      } min-w-[280px] sm:min-w-[340px] max-w-[420px] backdrop-blur-md`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                        <div className="relative flex items-center justify-center size-12 sm:size-14 rounded-2xl bg-accent/15 border border-accent/30 text-accent group-hover:scale-105 transition-transform shrink-0">
                          {peer.deviceType === 'android' || peer.deviceType === 'ios' ? (
                            <SmartphoneIcon className="size-6 sm:size-7 text-emerald-400" />
                          ) : peer.deviceType === 'mac' || peer.deviceType === 'windows' || peer.deviceType === 'linux' ? (
                            <LaptopIcon className="size-6 sm:size-7 text-indigo-400" />
                          ) : (
                            <MonitorIcon className="size-6 sm:size-7 text-cyan-400" />
                          )}
                          <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-base sm:text-lg tracking-tight truncate text-foreground group-hover:text-accent transition-colors">
                            {peer.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5 text-xs font-mono text-muted-foreground">
                            <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              Direct LAN
                            </span>
                            <span>•</span>
                            <span className="truncate">{peer.ip && peer.ip !== 'LAN' ? peer.ip : 'Ready'}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePeerClick(peer);
                        }}
                        className="shrink-0 w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-black font-bold text-xs shadow-sm hover:bg-accent/90 group-hover:scale-105 active:scale-95 transition-all"
                      >
                        <ZapIcon className="size-3.5 fill-black text-black" />
                        <span>Send Files</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="absolute top-4 sm:top-8 inset-x-4 sm:inset-x-8 z-30 flex flex-col items-center justify-center pointer-events-none">
                  <div
                    className={`pointer-events-auto max-w-lg w-full p-5 sm:p-6 rounded-2xl border flex flex-col items-center text-center backdrop-blur-md shadow-2xl transition-all ${
                      isDark
                        ? 'bg-[#181A26]/90 border-white/10 text-white'
                        : 'bg-white/90 border-black/10 text-zinc-900'
                    }`}
                  >
                    <div className="relative flex items-center justify-center size-12 sm:size-14 rounded-2xl bg-accent/15 border border-accent/30 text-accent mb-3">
                      <span className="absolute inset-0 rounded-2xl bg-accent/20 animate-ping opacity-40" />
                      <LaptopIcon className="size-6 sm:size-7 text-accent" />
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-base sm:text-lg font-bold text-foreground">
                        Scanning Wi-Fi Network...
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed mb-4">
                      No other devices detected yet. Open LocalReceive on your phone or computer on this Wi-Fi to connect instantly.
                    </p>

                    <div className="flex flex-wrap items-center gap-2.5 w-full justify-center">
                      {onOpenQR && (
                        <button
                          onClick={onOpenQR}
                          className="spring-press flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-black font-bold text-xs shadow-xs hover:bg-accent/90 transition-all active:scale-95"
                        >
                          <QrCodeIcon className="size-4" />
                          <span>Pair Phone (QR)</span>
                        </button>
                      )}
                      <button
                        onClick={handleCopyLink}
                        className={`spring-press flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-mono font-medium transition-all active:scale-95 ${
                          isDark
                            ? 'border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300'
                            : 'border-black/10 bg-black/5 hover:bg-black/10 text-zinc-700'
                        }`}
                        title="Copy local link"
                      >
                        <CopyIcon className="size-3.5" />
                        <span>{copied ? 'Copied URL!' : 'Copy Wi-Fi URL'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Inner Tier 3 */}
              <div
                className={`absolute bottom-0 w-[360px] sm:w-[440px] h-[150px] sm:h-[180px] rounded-t-full radial-disc-3 transition-all duration-300 border-t border-x flex flex-col items-center justify-start pt-3 sm:pt-4 ${
                  isDark
                    ? 'bg-[#202232]/95 border-white/[0.1]'
                    : 'bg-[#ECEEF4]/95 border-white/90'
                }`}
              >
                {/* Central "This Device" Anchor */}
                <div className="flex flex-col items-center gap-1 z-20">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 bg-background shadow-xs">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-foreground">
                      {myPeer?.name || 'My Device'}
                    </span>
                    <button
                      onClick={onEditDeviceName}
                      className="text-muted-foreground hover:text-accent transition-colors"
                      title="Rename this device"
                    >
                      <Edit3Icon className="size-3" />
                    </button>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="text-[11px] font-mono text-muted-foreground hover:text-accent transition-colors flex items-center gap-1 mt-1"
                    title="Copy local IP URL"
                  >
                    <span>
                      {copied
                        ? '✓ Copied'
                        : myPeer?.ip && myPeer.ip !== 'LAN'
                        ? `IP: ${myPeer.ip}`
                        : localUrl || 'Local LAN Active'}
                    </span>
                    <CopyIcon className="size-2.5 opacity-70" />
                  </button>
                </div>

                {/* Direct Auto-Receive Spring Toggle */}
                <div className="mt-2 sm:mt-3 flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-border/60 bg-background/80 backdrop-blur-xs shadow-2xs">
                  <span className="text-[11px] font-medium text-foreground">
                    Auto-Receive:
                  </span>
                  <SpringToggle
                    checked={autoAccept}
                    onChange={onToggleAutoAccept}
                    ariaLabel="Auto Receive"
                  />
                </div>
              </div>

              {/* Center Core Drop Notice */}
              <div className="absolute bottom-2 z-30 text-center pointer-events-none">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest opacity-60">
                  {dragOver ? '⚡ Drop to send instantly' : 'Drag & drop files onto dome'}
                </span>
              </div>
            </div>
          </div>
        </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. Bento Grid Section (Exact replica of Image 2)             */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Top 3-Card Bento Row */}
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

            {/* Visual preview */}
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
                  P27 Spring →
                </span>
              </div>
              <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                Receive incoming transfers straight to your device without repetitive manual confirmation prompts
                using tactile double-bounce spring physics.
              </p>
            </div>

            {/* Visual preview: Interactive tactile toggle test */}
            <div className="mt-6 rounded-2xl border border-border/70 bg-background/80 p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Zero-Prompt Save</span>
                <span className="text-[10px] text-muted-foreground">
                  {autoAccept ? 'Active — Instant save' : 'Prompt on every transfer'}
                </span>
              </div>
              <SpringToggle
                checked={autoAccept}
                onChange={onToggleAutoAccept}
                ariaLabel="Auto-Receive Switch"
              />
            </div>
          </div>

          {/* Card 3: Air-Gapped Privacy & Security */}
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

            {/* Visual preview: macOS Terminal Window (Exact match to Image 2 Card 3) */}
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

        {/* Card 4 (Full Width Bento Banner): Phone QR Pairing & Native APK (Matches Image 2 Card 4) */}
        <div
          className={`rounded-[28px] border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
            isDark ? 'bg-[#111218] border-white/[0.08]' : 'bg-[#F4F4F6] border-black/[0.06]'
          }`}
        >
          <div className="space-y-2 max-w-xl text-left">
            <h3 className="font-serif text-2xl md:text-3xl font-normal tracking-tight">
              {isNativeApp ? 'Instant Phone & Desktop QR Pairing' : 'Instant Phone QR Pairing & Native APK'}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {isNativeApp
                ? 'Scan the QR code with any iPhone, Android, or laptop camera to connect instantly in Safari or Chrome without installing an app.'
                : 'Scan the terminal QR code with any iPhone or Android camera to open LocalReceive instantly in Safari or Chrome without installing an app, or download our lightweight native Android APK.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenQR}
              className="spring-press h-10 px-5 rounded-full border border-border/80 bg-background hover:bg-muted text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <QrCodeIcon className="size-4 text-accent" />
              <span>Show Phone QR</span>
            </button>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. Quick Action Floating Tools & Drawer Trigger              */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQR}
            className="spring-press flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border/80 bg-background hover:bg-muted font-medium transition-colors shadow-xs"
          >
            <QrCodeIcon className="size-3.5 text-accent" />
            <span>Connect Phone (QR)</span>
          </button>
          <button
            onClick={onOpenTextShare}
            className="spring-press flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border/80 bg-background hover:bg-muted font-medium transition-colors shadow-xs"
          >
            <MessageSquareIcon className="size-3.5 text-purple-400" />
            <span>Share Text / Links</span>
          </button>
        </div>

        <button
          onClick={onOpenDrawer}
          className="spring-press flex items-center gap-1.5 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-bold transition-colors shadow-xs"
        >
          <HistoryIcon className="size-3.5" />
          <span>Transfers &amp; History</span>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. Donate Section (#donate)                                  */}
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
                Support LocalReceive Development
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                100% free and open local peer-to-peer AirDrop. Support development to keep it fast and air-gapped.
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
      {/* 6. FAQs Section (#faq)                                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 mb-16 scroll-mt-20">
        <FaqsSection />
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. Efferd Footer-1 Block                                     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
};

