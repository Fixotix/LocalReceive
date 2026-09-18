import React, { useState } from 'react';
import { Peer, SharedText } from '../types';
import { GlassSurface } from './GlassSurface';
import { SolarIcon } from './SolarIcon';
import { copyToClipboard } from '../utils/clipboard';

interface TextShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  peers: Peer[];
  onSendText: (peerId: string, text: string) => void;
  receivedText: SharedText | null;
  onClearReceivedText: () => void;
  isDark: boolean;
}

export const TextShareModal: React.FC<TextShareModalProps> = ({
  isOpen,
  onClose,
  peers,
  onSendText,
  receivedText,
  onClearReceivedText,
  isDark,
}) => {
  const [selectedPeerId, setSelectedPeerId] = useState<string>(peers[0]?.id || '');
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen && !receivedText) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selectedPeerId) return;
    onSendText(selectedPeerId, text);
    setText('');
    onClose();
  };

  const handleCopyReceivedText = async () => {
    if (receivedText) {
      const ok = await copyToClipboard(receivedText.text);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    }
  };

  if (receivedText) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all font-sans">
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
          <div
            className={`relative rounded-[32px] border p-6 md:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] overflow-hidden transition-all ${
              isDark ? 'border-white/[0.09] bg-[#12131A] text-white' : 'border-black/[0.08] bg-[#F7F7FA] text-zinc-900'
            }`}
            style={{
              background: isDark
                ? 'radial-gradient(ellipse at top left, rgba(147, 51, 234, 0.22), transparent 60%), linear-gradient(180deg, #151622 0%, #0F1017 100%)'
                : 'radial-gradient(ellipse at top left, rgba(168, 85, 247, 0.14), transparent 60%), linear-gradient(180deg, #FFFFFF 0%, #F3F4F8 100%)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-4">
              <div className="flex items-center space-x-2.5 text-accent">
                <SolarIcon name="clipboard" size={20} />
                <h3 className="text-sm font-bold text-foreground">
                  Text from {receivedText.fromName}
                </h3>
              </div>
              <button
                onClick={onClearReceivedText}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <SolarIcon name="close" size={18} />
              </button>
            </div>

            <div
              className={`border rounded-[20px] p-4 mb-5 font-mono text-xs break-words max-h-60 overflow-y-auto select-all leading-relaxed ${
                isDark ? 'bg-[#1A1B26] border-white/10 text-white' : 'bg-black/[0.03] border-black/10 text-zinc-900'
              }`}
            >
              {receivedText.text}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyReceivedText}
                className="flex-1 py-3 rounded-full bg-[#E5A93C] text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-[#E5A93C]/20 hover:bg-[#E5A93C]/90 active:scale-95 transition-all"
              >
                <SolarIcon name={copied ? 'check' : 'copy'} size={16} color="#000" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
              </button>
              <button
                onClick={onClearReceivedText}
                className={`py-3 px-5 rounded-full text-xs font-semibold transition-all ${
                  isDark ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-black/5 hover:bg-black/10 text-zinc-800'
                }`}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div
          className={`relative rounded-[32px] border p-6 md:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] overflow-hidden transition-all ${
            isDark ? 'border-white/[0.09] bg-[#12131A] text-white' : 'border-black/[0.08] bg-[#F7F7FA] text-zinc-900'
          }`}
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at top left, rgba(147, 51, 234, 0.22), transparent 60%), linear-gradient(180deg, #151622 0%, #0F1017 100%)'
              : 'radial-gradient(ellipse at top left, rgba(168, 85, 247, 0.14), transparent 60%), linear-gradient(180deg, #FFFFFF 0%, #F3F4F8 100%)',
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-4">
            <div className="flex items-center space-x-2.5 text-accent">
              <SolarIcon name="clipboard" size={20} />
              <h3 className="text-sm font-bold text-foreground">
                Share Text & Links
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <SolarIcon name="close" size={18} />
            </button>
          </div>

          <form onSubmit={handleSend}>
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 text-muted-foreground">
                Recipient Device:
              </label>
              {peers.length > 0 ? (
                <select
                  value={selectedPeerId}
                  onChange={(e) => setSelectedPeerId(e.target.value)}
                  className={`w-full border rounded-[16px] px-3.5 py-2.5 text-xs outline-none focus:border-accent ${
                    isDark
                      ? 'bg-[#1A1B26] border-white/10 text-white'
                      : 'bg-white border-black/15 text-zinc-900'
                  }`}
                >
                  {peers.map((peer) => (
                    <option key={peer.id} value={peer.id}>
                      {peer.name} ({peer.deviceType})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs italic text-muted-foreground">No nearby devices online.</p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold mb-2 text-muted-foreground">
                Text / Link / Code:
              </label>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste any text, URL, note or password to beam immediately..."
                className={`w-full border rounded-[20px] p-3.5 text-xs outline-none focus:border-accent resize-none font-sans ${
                  isDark
                    ? 'bg-[#1A1B26] border-white/10 text-white placeholder-white/30'
                    : 'bg-white border-black/15 text-zinc-900 placeholder-zinc-400'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={!text.trim() || !selectedPeerId}
              className="w-full py-3 rounded-full bg-[#E5A93C] text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-[#E5A93C]/20 hover:bg-[#E5A93C]/90 disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-all"
            >
              <SolarIcon name="zap" size={16} color="#000" />
              <span>Send Instantly</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
