import React, { useState } from 'react';
import { GlassSurface } from './GlassSurface';
import { SolarIcon } from './SolarIcon';

interface DeviceNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSaveName: (newName: string) => void;
  isDark: boolean;
}

export const DeviceNameModal: React.FC<DeviceNameModalProps> = ({
  isOpen,
  onClose,
  currentName,
  onSaveName,
  isDark,
}) => {
  const [name, setName] = useState(currentName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSaveName(name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all font-sans">
      <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
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
              <SolarIcon name="settings" size={20} />
              <h3 className="text-sm font-bold text-foreground">
                Edit Device Name
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <SolarIcon name="close" size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-xs font-semibold mb-2 text-muted-foreground">
                Visible Device Name on LAN:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Devendra's S24 Ultra, MacBook Pro..."
                autoFocus
                className={`w-full border rounded-[16px] px-3.5 py-2.5 text-xs outline-none focus:border-accent ${
                  isDark
                    ? 'bg-[#1A1B26] border-white/10 text-white placeholder-white/30'
                    : 'bg-white border-black/15 text-zinc-900 placeholder-zinc-400'
                }`}
              />
              <p className="text-[11px] mt-2 leading-relaxed text-muted-foreground">
                This real name is broadcasted to all nearby devices on your Wi-Fi network.
              </p>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  isDark ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-black/5 hover:bg-black/10 text-zinc-800'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 py-2.5 rounded-full bg-[#E5A93C] text-black font-bold text-xs shadow-lg shadow-[#E5A93C]/20 hover:bg-[#E5A93C]/90 disabled:opacity-50 transition-all active:scale-95"
              >
                Save Name
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
