import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { GlassSurface } from './GlassSurface';
import { SolarIcon } from './SolarIcon';
import { copyToClipboard } from '../utils/clipboard';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  localUrl: string;
  isDark: boolean;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  localUrl,
  isDark,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const ok = await copyToClipboard(localUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all font-sans">
      <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
        <div
          className={`relative rounded-[32px] border p-6 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] overflow-hidden transition-all ${
            isDark ? 'border-white/[0.09] bg-[#12131A] text-white' : 'border-black/[0.08] bg-[#F7F7FA] text-zinc-900'
          }`}
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at top left, rgba(147, 51, 234, 0.22), transparent 60%), linear-gradient(180deg, #151622 0%, #0F1017 100%)'
              : 'radial-gradient(ellipse at top left, rgba(168, 85, 247, 0.14), transparent 60%), linear-gradient(180deg, #FFFFFF 0%, #F3F4F8 100%)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-4">
            <div className="flex items-center space-x-2 text-accent">
              <SolarIcon name="smartphone" size={20} />
              <h3 className="text-sm font-bold text-foreground">
                Connect Mobile Device
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <SolarIcon name="close" size={18} />
            </button>
          </div>

          {/* QR Code Container */}
          <div className="p-4 rounded-[24px] bg-white mx-auto inline-block shadow-xl mb-4 border border-white/30">
            {localUrl ? (
              <QRCodeSVG
                value={localUrl}
                size={210}
                level="M"
                includeMargin={false}
              />
            ) : (
              <div className="w-[210px] h-[210px] flex items-center justify-center text-black/50 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          {/* Visual Instruction Badge */}
          <div
            className={`text-left rounded-[20px] p-3.5 mb-4 border ${
              isDark ? 'bg-[#1A1B26] border-white/[0.07]' : 'bg-white border-black/[0.06] shadow-xs'
            }`}
          >
            <div className="flex items-center space-x-2 text-xs font-bold mb-1 text-accent">
              <SolarIcon name="zap" size={14} />
              <span>Auto-Pairing Enabled:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Scan with your phone's camera. As soon as your phone connects, this window will automatically close!
            </p>
          </div>

          {/* Copyable LAN Link */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={localUrl}
              className={`flex-1 border rounded-xl px-3 py-2.5 text-xs font-mono outline-none ${
                isDark
                  ? 'bg-[#1A1B26] border-white/10 text-white'
                  : 'bg-white border-black/10 text-zinc-900'
              }`}
            />
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-accent text-black font-bold hover:bg-accent/90 transition-all active:scale-95 shadow-[0_4px_14px_rgba(229,169,60,0.35)] flex-shrink-0 flex items-center justify-center"
              title="Copy URL"
            >
              <SolarIcon name={copied ? 'check' : 'copy'} size={16} color="#000" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
