import React from 'react';
import { X, History, ArrowUpRight, ArrowDownLeft, Download, Trash2 } from 'lucide-react';
import { TransferHistoryItem } from '../types';
import { GlassSurface } from './GlassSurface';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: TransferHistoryItem[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
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

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        <GlassSurface intensity="high" className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center space-x-2 text-accent">
              <History className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Transfer History</h3>
            </div>
            <div className="flex items-center space-x-2">
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="p-1.5 rounded-apple-md hover:bg-white/10 text-secondaryLabel hover:text-destructive transition-colors text-xs flex items-center space-x-1"
                  title="Clear history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-full text-secondaryLabel hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          {history.length > 0 ? (
            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
              {history.map((item) => {
                const isSent = item.direction === 'sent';
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-apple-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isSent ? 'bg-blue-500/20 text-blue-400' : 'bg-accent/20 text-accent'
                        }`}
                      >
                        {isSent ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                          {item.fileName}
                        </p>
                        <p className="text-[10px] text-secondaryLabel mt-0.5">
                          {formatBytes(item.fileSize)} • {item.peerName} • {formatTime(item.timestamp)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className="text-[11px] font-mono text-accent">
                        {item.speedMBs > 0 ? `${item.speedMBs.toFixed(1)} MB/s` : 'Instant'}
                      </span>
                      {item.downloadUrl && (
                        <a
                          href={item.downloadUrl}
                          download={item.fileName}
                          className="p-1.5 rounded-apple-md bg-white/10 hover:bg-accent hover:text-black text-white transition-all"
                          title="Download again"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-secondaryLabel text-xs">
              No files transferred in this session yet.
            </div>
          )}
        </GlassSurface>
      </div>
    </div>
  );
};
