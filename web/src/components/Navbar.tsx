import React from 'react';
import { GlassSurface } from './GlassSurface';
import { SolarIcon } from './SolarIcon';
import { copyToClipboard } from '../utils/clipboard';

interface NavbarProps {
  localUrl: string;
  peerCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenQR: () => void;
  onOpenTextShare: () => void;
  onOpenDrawer: () => void;
  onEditDeviceName: () => void;
  autoAccept: boolean;
  myDeviceName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  localUrl,
  peerCount,
  isDark,
  onToggleTheme,
  onOpenQR,
  onOpenTextShare,
  onOpenDrawer,
  onEditDeviceName,
  autoAccept,
  myDeviceName,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyUrl = async () => {
    const ok = await copyToClipboard(localUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      <GlassSurface intensity="high" isDark={isDark} className="px-5 py-3 flex items-center justify-between shadow-2xl">
        {/* Brand & Status */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-apple-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-glass-glow">
            <SolarIcon name="radio" size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-extrabold text-base tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                LocalReceive
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-accent/25 text-accent border border-accent/30">
                Ultra LAN
              </span>
            </div>

            {/* Clickable Real Device Name */}
            <button
              onClick={onEditDeviceName}
              className="flex items-center space-x-1 group text-left cursor-pointer"
              title="Click to rename your device"
            >
              <span className={`text-xs font-semibold group-hover:underline ${isDark ? 'text-secondaryLabel group-hover:text-white' : 'text-zinc-500 group-hover:text-black'}`}>
                {myDeviceName}
              </span>
              <span className="text-[10px] text-accent font-bold">✎</span>
              <span className={`text-xs ${isDark ? 'text-secondaryLabel' : 'text-zinc-500'} hidden sm:inline`}>
                • {peerCount} {peerCount === 1 ? 'peer' : 'peers'}
              </span>
            </button>
          </div>
        </div>

        {/* Local Network URL Badge with 100% Reliable Copy */}
        <button
          onClick={handleCopyUrl}
          title="Click to copy local link (works everywhere)"
          className={`hidden lg:flex items-center space-x-2 px-3.5 py-1.5 rounded-apple-md border transition-all text-xs font-medium active:scale-95 ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-secondaryLabel hover:text-white'
              : 'bg-black/[0.04] hover:bg-black/[0.08] border-black/10 text-zinc-600 hover:text-black'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-success animate-ping" />
          <span className="font-mono text-[11px]">{localUrl || 'Detecting LAN IP...'}</span>
          {copied ? (
            <span className="flex items-center space-x-1 text-success font-bold text-[11px]">
              <SolarIcon name="check" size={14} color="#30D158" />
              <span>Copied!</span>
            </span>
          ) : (
            <SolarIcon name="copy" size={14} className="text-secondaryLabel" />
          )}
        </button>

        {/* Action Buttons & Donate */}
        <div className="flex items-center space-x-2">
          {/* Donate to Grow Button */}
          <a
            href="https://razorpay.me/@prepsnap"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-apple-md bg-gradient-to-r from-amber-500 to-accent text-black hover:opacity-90 transition-all font-bold text-xs shadow-glass-glow active:scale-95"
            title="Support LocalReceive & Donate to Grow"
          >
            <SolarIcon name="heart" size={14} color="#000" />
            <span>Donate to Grow</span>
          </a>

          {/* QR Code Connect */}
          <button
            onClick={onOpenQR}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-apple-md border text-xs font-semibold transition-all active:scale-95 ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                : 'bg-black/[0.04] hover:bg-black/[0.08] border-black/10 text-zinc-900'
            }`}
            title="Scan QR Code to join with Android / iPhone"
          >
            <SolarIcon name="qrcode" size={15} className="text-accent" />
            <span className="hidden sm:inline">Phone</span>
          </button>

          {/* Text/Clipboard Share */}
          <button
            onClick={onOpenTextShare}
            className={`p-2 rounded-apple-md border transition-all active:scale-95 ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-secondaryLabel hover:text-white'
                : 'bg-black/[0.04] hover:bg-black/[0.08] border-black/10 text-zinc-600 hover:text-black'
            }`}
            title="Share Text / Clipboard"
          >
            <SolarIcon name="clipboard" size={16} />
          </button>

          {/* Slide Drawer Toggle */}
          <button
            onClick={onOpenDrawer}
            className={`relative p-2 rounded-apple-md border transition-all active:scale-95 ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-secondaryLabel hover:text-white'
                : 'bg-black/[0.04] hover:bg-black/[0.08] border-black/10 text-zinc-600 hover:text-black'
            }`}
            title="Transfers & Settings"
          >
            <SolarIcon name="history" size={16} />
            {autoAccept && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent border-2 border-[#0D0D0E]" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-apple-md border transition-all active:scale-95 ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-accent'
                : 'bg-black/[0.04] hover:bg-black/[0.08] border-black/10 text-accent'
            }`}
            title="Toggle Theme"
          >
            <SolarIcon name={isDark ? 'sun' : 'moon'} size={16} />
          </button>
        </div>
      </GlassSurface>
    </header>
  );
};
