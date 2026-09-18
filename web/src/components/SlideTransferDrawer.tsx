import React from 'react';
import { ActiveTransfer, TransferHistoryItem } from '../types';
import { GlassSurface } from './GlassSurface';
import { SolarIcon } from './SolarIcon';
import { SpringToggle } from './SpringToggle';

interface SlideTransferDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  autoAccept: boolean;
  onToggleAutoAccept: () => void;
  activeTransfer: ActiveTransfer | null;
  history: TransferHistoryItem[];
  onClearHistory: () => void;
}

export const SlideTransferDrawer: React.FC<SlideTransferDrawerProps> = ({
  isOpen,
  onClose,
  isDark,
  autoAccept,
  onToggleAutoAccept,
  activeTransfer,
  history,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0 || !isFinite(seconds)) return '--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m > 0 ? `${m}m ` : ''}${s}s left`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md animate-in slide-in-from-right duration-300">
          <div
            className={`h-full flex flex-col p-6 sm:p-7 rounded-l-[36px] border-l border-y-0 border-r-0 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ${
              isDark ? 'border-white/[0.09] bg-[#12131A] text-white' : 'border-black/[0.08] bg-[#F7F7FA] text-zinc-900'
            }`}
            style={{
              background: isDark
                ? 'radial-gradient(ellipse at top left, rgba(147, 51, 234, 0.18), transparent 50%), linear-gradient(180deg, #151622 0%, #0D0E15 100%)'
                : 'radial-gradient(ellipse at top left, rgba(168, 85, 247, 0.12), transparent 50%), linear-gradient(180deg, #FFFFFF 0%, #F5F6FA 100%)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div className="flex items-center space-x-3">
                <div className="size-10 rounded-2xl bg-accent/20 flex items-center justify-center text-accent border border-accent/30">
                  <SolarIcon name="radio" size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Transfers & Activity
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Local network status
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <SolarIcon name="close" size={18} />
              </button>
            </div>

            {/* Direct File Receive (Auto-Accept) Setting */}
            <div className="my-5">
              <div
                onClick={onToggleAutoAccept}
                className={`p-4 rounded-[22px] cursor-pointer border transition-all flex items-center justify-between ${
                  autoAccept
                    ? isDark
                      ? 'bg-accent/15 border-accent/40 shadow-lg shadow-accent/10'
                      : 'bg-accent/10 border-accent/40'
                    : isDark
                    ? 'bg-[#1A1B26] border-white/10 hover:border-white/20'
                    : 'bg-black/[0.03] border-black/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-accent">
                    <SolarIcon name="zap" size={20} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-foreground">
                        Direct File Receive
                      </span>
                      {autoAccept && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-black uppercase">
                          ON
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Auto-accept & download without popup prompts
                    </p>
                  </div>
                </div>

                {/* transitions.dev Spring Toggle */}
                <div onClick={(e) => e.stopPropagation()}>
                  <SpringToggle
                    checked={autoAccept}
                    onChange={onToggleAutoAccept}
                    ariaLabel="Toggle Direct File Receive"
                  />
                </div>
              </div>
            </div>

            {/* Active Transfer Card */}
            {activeTransfer && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5 text-muted-foreground">
                  Live Stream
                </h4>
                <div className={`p-4 rounded-[22px] border ${isDark ? 'bg-[#1A1B26] border-white/10' : 'bg-black/[0.04] border-black/10'}`}>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center space-x-2 min-w-0">
                      <SolarIcon
                        name={activeTransfer.direction === 'sending' ? 'upload' : 'download'}
                        size={18}
                        className="text-accent animate-pulse flex-shrink-0"
                      />
                      <span className="text-xs font-bold truncate max-w-[180px] text-foreground">
                        {activeTransfer.files[0]?.name || 'File Package'}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-accent">
                      {activeTransfer.speedMBs.toFixed(1)} MB/s
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-white/10 dark:bg-white/10 bg-black/10 overflow-hidden mb-2.5">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-200"
                      style={{ width: `${Math.min(100, Math.max(0, activeTransfer.progressPercent))}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{formatBytes(activeTransfer.bytesTransferred)} / {formatBytes(activeTransfer.totalBytes)}</span>
                    <span>{formatTime(activeTransfer.etaSeconds)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Transfer History */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Recent Transfers ({history.length})
                </h4>
                {history.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="text-[11px] text-destructive hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {history.length > 0 ? (
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-[18px] border flex items-center justify-between transition-colors ${
                        isDark ? 'bg-[#1A1B26] border-white/10 hover:border-white/20' : 'bg-black/[0.02] border-black/10 hover:bg-black/[0.05]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="text-accent flex-shrink-0">
                          <SolarIcon
                            name={item.direction === 'sent' ? 'upload' : 'download'}
                            size={16}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate max-w-[190px] text-foreground">
                            {item.fileName}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {formatBytes(item.fileSize)} • {item.peerName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-[10px] font-mono text-accent">
                          {item.speedMBs > 0 ? `${item.speedMBs.toFixed(1)} MB/s` : 'Done'}
                        </span>
                        {item.downloadUrl && (
                          <a
                            href={item.downloadUrl}
                            download={item.fileName}
                            className="p-1.5 rounded-lg bg-accent text-black hover:bg-accent/80 transition-all"
                            title="Download"
                          >
                            <SolarIcon name="download" size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <SolarIcon name="cloud" size={36} className="text-muted-foreground opacity-40 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No transfers yet. Drop files onto any device to start!
                  </p>
                </div>
              )}
            </div>

            {/* Donate / Support Button */}
            <div className="pt-4 mt-2 border-t border-border/50">
              <a
                href="https://razorpay.me/@prepsnap"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-full bg-[#E5A93C] text-black font-bold text-xs shadow-lg shadow-[#E5A93C]/20 hover:bg-[#E5A93C]/90 transition-all active:scale-95"
              >
                <SolarIcon name="heart" size={15} color="#000" />
                <span>Donate for Grow • Support Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
