import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ActiveTransfer } from '../types';
import { SolarIcon } from './SolarIcon';
import { UploadIcon, DownloadIcon, RadioIcon, CheckIcon, XIcon, ZapIcon, FileTextIcon } from 'lucide-react';

interface TransferModalProps {
  transfer: ActiveTransfer | null;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
  isDark: boolean;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  transfer,
  onAccept,
  onReject,
  onClose,
  isDark,
}) => {
  if (!transfer) return null;

  const isSending = transfer.direction === 'sending';
  const isIncomingPrompt = transfer.status === 'incoming_prompt';
  const isWaitingApproval = transfer.status === 'waiting_approval';
  const isCompleted = transfer.status === 'completed';
  const isError = transfer.status === 'error' || transfer.status === 'rejected';
  const isTransferring = transfer.status === 'transferring';

  useEffect(() => {
    if (isCompleted) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E5A93C', '#FFFFFF', '#6366F1', '#30D158'],
      });
    }
  }, [isCompleted]);

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

  const currentFile = transfer.files[transfer.currentFileIndex] || transfer.files[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div
          className={`relative rounded-[32px] border p-6 md:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] overflow-hidden transition-all ${
            isDark
              ? 'border-white/[0.09] bg-[#12131A] text-white'
              : 'border-black/[0.08] bg-[#F7F7FA] text-zinc-900'
          }`}
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at top left, rgba(147, 51, 234, 0.22), transparent 60%), linear-gradient(180deg, #151622 0%, #0F1017 100%)'
              : 'radial-gradient(ellipse at top left, rgba(168, 85, 247, 0.14), transparent 60%), linear-gradient(180deg, #FFFFFF 0%, #F3F4F8 100%)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div className="flex items-center space-x-3.5">
              <div
                className={`size-11 rounded-2xl flex items-center justify-center ${
                  isSending
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-accent/20 text-accent border border-accent/30'
                }`}
              >
                {isSending ? (
                  <UploadIcon className="size-5" />
                ) : (
                  <DownloadIcon className="size-5" />
                )}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  {isSending ? 'Sending to' : 'Receiving from'} {transfer.peer.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {transfer.files.length} {transfer.files.length === 1 ? 'file' : 'files'} • {formatBytes(transfer.totalBytes)}
                </p>
              </div>
            </div>

            <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-md bg-[#241F16] border border-accent/30 text-accent font-bold tracking-wider">
              LAN STREAM
            </span>
          </div>

          {/* File Card Info (Exact match to Image 2 & 3) */}
          <div
            className={`my-5 p-3.5 rounded-[22px] border flex items-center space-x-3.5 ${
              isDark ? 'bg-[#1A1B26] border-white/[0.07]' : 'bg-white border-black/[0.07] shadow-xs'
            }`}
          >
            <div className="size-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0">
              <FileTextIcon className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {currentFile ? currentFile.name : 'Transfer Package'}
              </p>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                {formatBytes(currentFile ? currentFile.size : transfer.totalBytes)}
              </p>
            </div>
          </div>

          {/* WAITING FOR ACCEPTANCE (SENDER SIDE - Image 2) */}
          {isWaitingApproval ? (
            <div className="text-center py-4">
              <div className="relative size-20 mx-auto mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-accent/30 animate-pulse" />
                <div className="relative size-12 rounded-full bg-accent/20 border-2 border-accent/60 flex items-center justify-center text-accent shadow-[0_0_30px_rgba(229,169,60,0.35)]">
                  <RadioIcon className="size-6 animate-spin" />
                </div>
              </div>

              <h4 className="text-base font-bold text-foreground mb-1.5">
                Waiting for {transfer.peer.name} to accept...
              </h4>
              <p className="text-xs text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed">
                Please tap <strong className="text-accent font-semibold">"Accept &amp; Download"</strong> on the other device to begin streaming.
              </p>

              <button
                onClick={onReject}
                className="h-10 px-6 rounded-xl bg-[#262835] hover:bg-[#303344] text-zinc-300 font-semibold text-xs transition-all active:scale-95"
              >
                Cancel Request
              </button>
            </div>
          ) : isIncomingPrompt ? (
            /* INCOMING TRANSFER PROMPT (RECEIVER SIDE - Image 3) */
            <div>
              <p className="text-xs text-center text-muted-foreground mb-5 leading-relaxed">
                <strong className="text-foreground">{transfer.peer.name}</strong> wants to send {transfer.files.length} file(s). Download over local LAN?
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onReject}
                  className="flex-1 h-11 rounded-xl bg-[#262835] hover:bg-[#303344] text-zinc-300 font-semibold text-xs transition-colors active:scale-95"
                >
                  Decline
                </button>
                <button
                  onClick={onAccept}
                  className="flex-1 h-11 rounded-xl bg-accent text-black hover:bg-accent/90 font-bold text-xs shadow-[0_8px_20px_rgba(229,169,60,0.35)] transition-all active:scale-95"
                >
                  Accept &amp; Download
                </button>
              </div>
            </div>
          ) : isTransferring ? (
            /* LIVE TRANSFERRING PROGRESS */
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center space-x-1.5 text-accent font-mono font-bold">
                  <ZapIcon className="size-3.5 fill-accent" />
                  <span>{transfer.speedMBs > 0 ? `${transfer.speedMBs.toFixed(1)} MB/s` : 'Streaming...'}</span>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  {formatBytes(transfer.bytesTransferred)} / {formatBytes(transfer.totalBytes)}
                </div>
              </div>

              <div className="relative w-full h-3 rounded-full bg-black/20 dark:bg-white/10 overflow-hidden mb-3">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-200"
                  style={{ width: `${Math.min(100, Math.max(5, transfer.progressPercent))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>{Math.round(transfer.progressPercent)}% transferred</span>
                <span>{formatTime(transfer.etaSeconds)}</span>
              </div>
            </div>
          ) : isCompleted ? (
            /* COMPLETED */
            <div className="text-center py-2">
              <div className="size-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                <CheckIcon className="size-6" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-foreground mb-1">
                Transfer Complete!
              </h4>
              <p className="text-xs text-muted-foreground mb-5">
                Transferred successfully at <strong className="text-accent">{transfer.speedMBs > 0 ? `${transfer.speedMBs.toFixed(1)} MB/s` : 'Wire-Speed'}</strong>.
              </p>

              <div className="flex items-center space-x-3">
                {transfer.downloadUrl && (
                  <a
                    href={transfer.downloadUrl}
                    download={currentFile.name}
                    className="flex-1 h-11 rounded-xl bg-accent text-black hover:bg-accent/90 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-[0_8px_20px_rgba(229,169,60,0.35)] transition-all active:scale-95"
                  >
                    <DownloadIcon className="size-4" />
                    <span>Download File</span>
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 h-11 rounded-xl bg-[#262835] hover:bg-[#303344] text-zinc-300 font-semibold text-xs transition-colors active:scale-95"
                >
                  Done
                </button>
              </div>
            </div>
          ) : isError ? (
            /* REJECTED / CANCELLED / ERROR */
            <div className="text-center py-2">
              <div className="size-12 rounded-full bg-destructive/20 text-destructive border border-destructive/30 flex items-center justify-center mx-auto mb-3">
                <XIcon className="size-6" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-foreground mb-1">
                Transfer Cancelled
              </h4>
              <p className="text-xs text-muted-foreground mb-5">
                {transfer.error || 'The transfer was declined or cancelled.'}
              </p>
              <button
                onClick={onClose}
                className="w-full h-11 rounded-xl bg-[#262835] hover:bg-[#303344] text-zinc-300 font-semibold text-xs transition-colors active:scale-95"
              >
                Dismiss
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
