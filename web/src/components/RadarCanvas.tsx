import React, { useRef } from 'react';
import { Peer, DeviceType } from '../types';
import { GlassSurface } from './GlassSurface';
import { SolarIcon } from './SolarIcon';

interface RadarCanvasProps {
  myPeer: Peer | null;
  peers: Peer[];
  onSelectPeerToSend: (peer: Peer, files: FileList) => void;
  onOpenQR: () => void;
  onEditDeviceName: () => void;
  isDark: boolean;
}

export const RadarCanvas: React.FC<RadarCanvasProps> = ({
  myPeer,
  peers,
  onSelectPeerToSend,
  onOpenQR,
  onEditDeviceName,
  isDark,
}) => {
  const [dragOverPeerId, setDragOverPeerId] = React.useState<string | null>(null);
  const [isGlobalDragOver, setIsGlobalDragOver] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTargetPeer, setSelectedTargetPeer] = React.useState<Peer | null>(null);

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'android':
      case 'ios':
        return <SolarIcon name="smartphone" size={26} className="text-accent" />;
      case 'mac':
      case 'windows':
        return <SolarIcon name="laptop" size={26} className="text-blue-400" />;
      case 'linux':
        return <SolarIcon name="monitor" size={26} className="text-emerald-400" />;
      default:
        return <SolarIcon name="radio" size={26} className="text-purple-400" />;
    }
  };

  const handlePeerClick = (peer: Peer) => {
    setSelectedTargetPeer(peer);
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && selectedTargetPeer) {
      onSelectPeerToSend(selectedTargetPeer, e.target.files);
      e.target.value = '';
    }
  };

  const handlePeerDrop = (e: React.DragEvent, peer: Peer) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverPeerId(null);
    setIsGlobalDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onSelectPeerToSend(peer, e.dataTransfer.files);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsGlobalDragOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsGlobalDragOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsGlobalDragOver(false);
      }}
      className="relative flex-1 flex flex-col items-center justify-center p-4 sm:p-8 min-h-[500px] select-none w-full"
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Global Drag Overlay */}
      {isGlobalDragOver && (
        <div className="absolute inset-4 sm:inset-8 rounded-apple-2xl border-2 border-dashed border-accent bg-accent/15 backdrop-blur-xl flex flex-col items-center justify-center z-30 pointer-events-none transition-all">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-3 shadow-glass-glow animate-bounce">
            <SolarIcon name="upload" size={36} className="text-accent" />
          </div>
          <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Drop files onto any device to beam instantly
          </p>
          <p className="text-sm text-secondaryLabel mt-1">Ultra-Fast LAN Peer Stream</p>
        </div>
      )}

      {/* Concentric 3D Animated Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className={`absolute w-[240px] h-[240px] rounded-full border ${isDark ? 'border-white/[0.08]' : 'border-black/[0.05]'}`} />
        <div className={`absolute w-[440px] h-[440px] rounded-full border ${isDark ? 'border-white/[0.05]' : 'border-black/[0.04]'}`} />
        <div className={`absolute w-[660px] h-[660px] rounded-full border ${isDark ? 'border-white/[0.03]' : 'border-black/[0.03]'}`} />

        <div className="absolute w-[220px] h-[220px] rounded-full border border-accent/25 animate-radar-pulse-1" />
        <div className="absolute w-[220px] h-[220px] rounded-full border border-accent/15 animate-radar-pulse-2" />
        <div className="absolute w-[220px] h-[220px] rounded-full border border-accent/10 animate-radar-pulse-3" />
      </div>

      {/* Center Self Node (Clickable to Rename Real Device) */}
      <div
        onClick={onEditDeviceName}
        title="Click to change your real device name"
        className="relative z-10 flex flex-col items-center mb-8 card-3d cursor-pointer group"
      >
        <div className="relative">
          <div className={`w-20 h-20 rounded-full border-2 shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform ${
            isDark
              ? 'bg-gradient-to-b from-[#2C2C2E] to-[#1C1C1E] border-white/20 text-white'
              : 'bg-gradient-to-b from-white to-[#F2F2F7] border-black/10 text-zinc-900'
          }`}>
            {myPeer ? getDeviceIcon(myPeer.deviceType) : <SolarIcon name="radio" size={32} className="text-accent" />}
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-[#0D0D0E]" />
        </div>
        <div className="mt-3 text-center">
          <div className="flex items-center justify-center space-x-1">
            <h3 className={`text-sm font-bold tracking-tight group-hover:text-accent transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {myPeer?.name || 'Your Device'}
            </h3>
            <span className="text-[10px] text-accent font-bold opacity-70 group-hover:opacity-100">✎</span>
          </div>
          <p className={`text-[11px] ${isDark ? 'text-secondaryLabel' : 'text-zinc-500'}`}>
            {myPeer?.ip || 'Connecting...'} • <span className="text-accent">Tap to rename</span>
          </p>
        </div>
      </div>

      {/* Discovered Peers Section */}
      {peers.length > 0 ? (
        <div className="relative z-20 w-full max-w-4xl">
          <div className="flex items-center justify-center mb-6">
            <span className={`text-xs uppercase tracking-wider font-bold px-3.5 py-1 rounded-full border ${
              isDark ? 'bg-white/5 border-white/10 text-secondaryLabel' : 'bg-black/[0.04] border-black/10 text-zinc-600'
            }`}>
              Discovered Devices ({peers.length})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {peers.map((peer) => {
              const isDragHover = dragOverPeerId === peer.id;

              return (
                <div
                  key={peer.id}
                  onClick={() => handlePeerClick(peer)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverPeerId(peer.id);
                  }}
                  onDragLeave={() => setDragOverPeerId(null)}
                  onDrop={(e) => handlePeerDrop(e, peer)}
                  className={`card-3d cursor-pointer active:scale-[0.98] ${
                    isDragHover ? 'scale-105' : ''
                  }`}
                >
                  <GlassSurface
                    intensity="high"
                    isDark={isDark}
                    className={`p-5 transition-all ${
                      isDragHover
                        ? 'border-accent bg-accent/20 shadow-glass-glow'
                        : isDark
                        ? 'hover:border-accent/50 hover:bg-[#1C1C1E]/90'
                        : 'hover:border-accent/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3.5">
                        <div className={`w-12 h-12 rounded-apple-xl border flex items-center justify-center ${
                          isDark ? 'bg-white/10 border-white/15' : 'bg-black/[0.04] border-black/10'
                        }`}>
                          {getDeviceIcon(peer.deviceType)}
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold transition-colors ${
                            isDark ? 'text-white hover:text-accent' : 'text-zinc-900 hover:text-accent'
                          }`}>
                            {peer.name}
                          </h4>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-secondaryLabel' : 'text-zinc-500'}`}>
                            {peer.ip} • <span className="capitalize">{peer.deviceType}</span>
                          </p>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                        <SolarIcon name="arrow-right" size={16} />
                      </div>
                    </div>

                    <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] ${
                      isDark ? 'border-white/10 text-secondaryLabel' : 'border-black/10 text-zinc-500'
                    }`}>
                      <span>Click to send files</span>
                      <span className="font-mono text-accent font-semibold">Direct LAN</span>
                    </div>
                  </GlassSurface>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="relative z-10 flex flex-col items-center text-center max-w-md px-4">
          <GlassSurface intensity="medium" isDark={isDark} className="p-7 text-center card-3d">
            <div className="w-12 h-12 rounded-apple-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mx-auto mb-3.5 shadow-glass-glow">
              <SolarIcon name="wifi" size={24} />
            </div>
            <h3 className={`text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Ready to Share on Local Network
            </h3>
            <p className={`text-xs mb-5 leading-relaxed ${isDark ? 'text-secondaryLabel' : 'text-zinc-500'}`}>
              Connect phones, laptops, and tablets on the same Wi-Fi. Scan the QR code to open in phone browser instantly without downloading anything:
            </p>

            <button
              onClick={onOpenQR}
              className="w-full flex items-center justify-center space-x-2 py-3 px-5 rounded-apple-xl bg-accent text-black font-bold text-xs tracking-wide shadow-glass-glow hover:bg-accent/90 active:scale-95 transition-all"
            >
              <SolarIcon name="qrcode" size={18} color="#000" />
              <span>Show QR Code to Connect</span>
            </button>
          </GlassSurface>
        </div>
      )}
    </div>
  );
};
