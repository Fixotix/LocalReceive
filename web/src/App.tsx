import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { RadarCanvas } from './components/RadarCanvas';
import { TransferModal } from './components/TransferModal';
import { QRCodeModal } from './components/QRCodeModal';
import { TextShareModal } from './components/TextShareModal';
import { SlideTransferDrawer } from './components/SlideTransferDrawer';
import { DeviceNameModal } from './components/DeviceNameModal';
import { GlassSurface } from './components/GlassSurface';
import { SolarIcon } from './components/SolarIcon';
import { LocalTransferView } from './components/LocalTransferView';
import { ShowcaseView } from './components/ShowcaseView';
import { Peer, ActiveTransfer, SharedText, TransferHistoryItem, HostInfo, FileItem } from './types';
import { uploadFileOverLAN } from './services/lanStream';
import { WebRTCConnection } from './services/webrtc';
import { SignalingService } from './services/signaling';
import { detectRealDeviceName, detectDeviceType, getNativeLocalIp } from './utils/device';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('localreceive_theme') || localStorage.getItem('localhere_theme');
    return saved ? saved === 'dark' : true;
  });

  const [autoAccept, setAutoAccept] = useState(() => {
    return (localStorage.getItem('localreceive_auto_accept') || localStorage.getItem('localhere_auto_accept')) === 'true';
  });

  const [hostInfo, setHostInfo] = useState<HostInfo | null>(null);
  const [myPeer, setMyPeer] = useState<Peer | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]);
  const prevPeerCountRef = useRef(0);
  const [connectedToast, setConnectedToast] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('https://localreceive.web.app');
  const isHostedShowcase =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localreceive.web.app' ||
      window.location.hostname === 'localreceive.firebaseapp.com');

  const [viewMode, setViewMode] = useState<'app' | 'showcase'>(() => {
    return isHostedShowcase ? 'showcase' : 'app';
  });


  // Real Device Name detection
  const [myDeviceName, setMyDeviceName] = useState<string>(() => {
    return localStorage.getItem('localreceive_device_name') || localStorage.getItem('localhere_device_name') || 'Detecting Device...';
  });

  // Modals state
  const [isQROpen, setIsQROpen] = useState(false);
  const [isTextShareOpen, setIsTextShareOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeviceNameModalOpen, setIsDeviceNameModalOpen] = useState(false);
  const [receivedText, setReceivedText] = useState<SharedText | null>(null);

  // Active Transfer state
  const [activeTransfer, setActiveTransfer] = useState<ActiveTransfer | null>(null);
  const pendingSenderFilesRef = useRef<{
    targetPeer: Peer;
    filesArray: File[];
    files: FileItem[];
    totalBytes: number;
    transferId: string;
  } | null>(null);

  const [transferHistory, setTransferHistory] = useState<TransferHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('localreceive_history') || localStorage.getItem('localhere_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const signalingRef = useRef<SignalingService | null>(null);
  const webrtcConnectionsRef = useRef<Map<string, WebRTCConnection>>(new Map());

  // Apply theme class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('localreceive_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('localreceive_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Save auto-accept setting
  useEffect(() => {
    localStorage.setItem('localreceive_auto_accept', autoAccept ? 'true' : 'false');
  }, [autoAccept]);

  // Save history
  useEffect(() => {
    localStorage.setItem('localreceive_history', JSON.stringify(transferHistory));
  }, [transferHistory]);

  // Fetch Host info from server and detect real device name
  useEffect(() => {
    const fetchInfoAndDetectDevice = async () => {
      let fetchedHostname = '';
      try {
        const res = await fetch('/api/info');
        if (res.ok) {
          const data = await res.json();
          setHostInfo(data);
          fetchedHostname = data.hostname || '';
        }
      } catch (e) {
        console.error('Failed to fetch host info', e);
      }

      const isHost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      const detected = await detectRealDeviceName(isHost, fetchedHostname);
      setMyDeviceName(detected.name);

      if (signalingRef.current && myPeer) {
        signalingRef.current.updateSelf({
          name: detected.name,
          deviceType: detected.type,
        });
      }
    };

    fetchInfoAndDetectDevice();
  }, []);

  // Recipient handles received WebRTC file
  const handleWebRTCFileReceived = (file: File, fromPeerId: string) => {
    const downloadUrl = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    signalingRef.current?.sendDirect(fromPeerId, {
      type: 'file-completed',
      to: fromPeerId,
      from: myPeer?.id,
      transferId: activeTransfer?.id || 'p2p-transfer',
    });

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E5A93C', '#30D158', '#0A84FF'],
    });

    setActiveTransfer((prev) =>
      prev
        ? {
            ...prev,
            status: 'completed',
            progressPercent: 100,
            bytesTransferred: prev.totalBytes,
            downloadUrl,
          }
        : null
    );

    setTransferHistory((prev) => [
      {
        id: activeTransfer?.id || Math.random().toString(36).substring(2, 9),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        peerName: activeTransfer?.peer.name || 'Nearby Device',
        direction: 'received',
        timestamp: Date.now(),
        speedMBs: 85.0,
        downloadUrl,
      },
      ...prev,
    ]);

    setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);
  };

  // Connect to Signaling Service (Dual-Mode: Local WebSocket + Serverless Cloud P2P)
  useEffect(() => {
    const nativeIp = getNativeLocalIp();
    const initialPeer: Peer = {
      id: 'peer-' + Math.random().toString(36).substring(2, 10),
      name: myDeviceName,
      deviceType: detectDeviceType(),
      ip: nativeIp || 'LAN',
      joinedAt: Date.now(),
    };

    const signaling = new SignalingService(initialPeer, {
      onSelfReady: (self) => {
        setMyPeer(self);
      },
      onPeersUpdate: (newPeers) => {
        setPeers(newPeers);
        if (newPeers.length > prevPeerCountRef.current) {
          const joinedPeer = newPeers[newPeers.length - 1];
          setIsQROpen(false);
          setConnectedToast(`📱 ${joinedPeer?.name || 'Device'} Discovered!`);
          setTimeout(() => setConnectedToast(null), 3500);
        }
        prevPeerCountRef.current = newPeers.length;
      },
      onSignal: async (from, data) => {
        let rtc = webrtcConnectionsRef.current.get(from);
        if (!rtc) {
          // Recipient receives offer signal from sender
          rtc = new WebRTCConnection(
            false,
            (sig) =>
              signalingRef.current?.sendDirect(from, {
                type: 'signal',
                to: from,
                from: myPeer?.id,
                data: sig,
              }),
            (receivedFile) => handleWebRTCFileReceived(receivedFile, from),
            (bytes, total, speed, eta) => {
              setActiveTransfer((prev) =>
                prev
                  ? {
                      ...prev,
                      bytesTransferred: bytes,
                      progressPercent: total > 0 ? (bytes / total) * 100 : 0,
                      speedMBs: speed,
                      etaSeconds: eta,
                    }
                  : null
              );
            }
          );
          webrtcConnectionsRef.current.set(from, rtc);
        }
        await rtc.handleSignal(data);
      },
      onFileOffer: (offer) => {
        const peer = peers.find((p) => p.id === offer.from) || {
          id: offer.from,
          name: offer.fromName || 'Nearby Device',
          deviceType: 'browser',
          ip: 'LAN',
          joinedAt: Date.now(),
        };

        const files: FileItem[] = offer.files.map((f: any, idx: number) => ({
          id: `${offer.transferId}-${idx}`,
          name: f.name,
          size: f.size,
          type: f.type || 'application/octet-stream',
        }));

        const totalSize = files.reduce((acc, curr) => acc + curr.size, 0);

        const incomingTransfer: ActiveTransfer = {
          id: offer.transferId,
          direction: 'receiving',
          peer,
          files,
          currentFileIndex: 0,
          bytesTransferred: 0,
          totalBytes: totalSize,
          progressPercent: 0,
          speedMBs: 0,
          etaSeconds: 0,
          status: autoAccept ? 'transferring' : 'incoming_prompt',
          mode: signalingRef.current?.isCloud() ? 'webrtc' : 'lan_stream',
        };

        setActiveTransfer(incomingTransfer);

        if (autoAccept) {
          handleAcceptTransfer();
        }
      },
      onFileResponse: async (resp) => {
        if (resp.accepted) {
          if (pendingSenderFilesRef.current && pendingSenderFilesRef.current.transferId === resp.transferId) {
            const { targetPeer, filesArray, totalBytes, transferId, files } = pendingSenderFilesRef.current;

            setActiveTransfer((prev) =>
              prev ? { ...prev, status: 'transferring', progressPercent: 10 } : null
            );

            if (signalingRef.current?.isCloud()) {
              // P2P WebRTC Direct DataChannel File Streaming
              const rtc = new WebRTCConnection(
                true,
                (sig) =>
                  signalingRef.current?.sendDirect(targetPeer.id, {
                    type: 'signal',
                    to: targetPeer.id,
                    from: myPeer?.id,
                    data: sig,
                  })
              );
              webrtcConnectionsRef.current.set(targetPeer.id, rtc);

              await rtc.startOffer();

              // Give DataChannel 800ms to open, then stream file
              setTimeout(async () => {
                try {
                  await rtc.sendFile(filesArray[0], transferId, (sent, total, speed, eta) => {
                    setActiveTransfer((prev) =>
                      prev
                        ? {
                            ...prev,
                            status: 'transferring',
                            bytesTransferred: sent,
                            progressPercent: total > 0 ? (sent / total) * 100 : 0,
                            speedMBs: speed,
                            etaSeconds: eta,
                          }
                        : null
                    );
                  });
                } catch (err) {
                  console.error('[WebRTC] Error during stream', err);
                }
              }, 800);
            } else {
              // Local Node LAN Stream
              try {
                const uploadResult = await uploadFileOverLAN(
                  filesArray[0],
                  (bytesSent, total, speedMBs, eta) => {
                    setActiveTransfer((prev) => {
                      if (!prev) return null;
                      const progress = total > 0 ? (bytesSent / total) * 90 : 0;
                      return {
                        ...prev,
                        status: 'transferring',
                        bytesTransferred: bytesSent,
                        progressPercent: Math.max(10, progress),
                        speedMBs,
                        etaSeconds: eta,
                      };
                    });
                  }
                );

                signalingRef.current?.sendDirect(targetPeer.id, {
                  type: 'file-ready',
                  to: targetPeer.id,
                  from: myPeer?.id,
                  transferId,
                  downloadUrl: uploadResult.downloadUrl,
                  files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
                });
              } catch (err: any) {
                setActiveTransfer((prev) =>
                  prev ? { ...prev, status: 'error', error: 'Upload failed over LAN.' } : null
                );
              }
            }
          }
        } else {
          setActiveTransfer((prev) =>
            prev
              ? {
                  ...prev,
                  status: 'rejected',
                  error: resp.reason || `${prev.peer.name} declined the transfer.`,
                }
              : null
          );
          pendingSenderFilesRef.current = null;
        }
      },
      onFileReady: (ready) => {
        if (ready.downloadUrl) {
          const a = document.createElement('a');
          a.href = ready.downloadUrl;
          a.download = ready.files?.[0]?.name || 'download';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          signalingRef.current?.sendDirect(ready.from, {
            type: 'file-completed',
            to: ready.from,
            from: myPeer?.id,
            transferId: ready.transferId,
          });

          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#E5A93C', '#30D158', '#0A84FF'],
          });

          setActiveTransfer((prev) =>
            prev
              ? {
                  ...prev,
                  status: 'completed',
                  progressPercent: 100,
                  bytesTransferred: prev.totalBytes,
                  downloadUrl: ready.downloadUrl,
                }
              : null
          );

          setTransferHistory((prev) => [
            {
              id: ready.transferId,
              fileName: ready.files?.[0]?.name || 'File',
              fileSize: ready.files?.[0]?.size || 0,
              fileType: ready.files?.[0]?.type || '',
              peerName: activeTransfer?.peer.name || 'Device',
              direction: 'received',
              timestamp: Date.now(),
              speedMBs: 75.0,
              downloadUrl: ready.downloadUrl,
            },
            ...prev,
          ]);
        }
      },
      onFileCompleted: () => {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E5A93C', '#30D158', '#0A84FF'],
        });

        setActiveTransfer((prev) =>
          prev
            ? {
                ...prev,
                status: 'completed',
                progressPercent: 100,
                bytesTransferred: prev.totalBytes,
              }
            : null
        );

        if (pendingSenderFilesRef.current) {
          const { transferId, files, totalBytes, targetPeer } = pendingSenderFilesRef.current;
          setTransferHistory((prev) => [
            {
              id: transferId,
              fileName: files[0].name,
              fileSize: totalBytes,
              fileType: files[0].type,
              peerName: targetPeer.name,
              direction: 'sent',
              timestamp: Date.now(),
              speedMBs: activeTransfer?.speedMBs || 72.0,
            },
            ...prev,
          ]);
          pendingSenderFilesRef.current = null;
        }
      },
      onFileCancel: () => {
        setActiveTransfer(null);
        pendingSenderFilesRef.current = null;
      },
      onTextShare: (text) => {
        setReceivedText({
          id: Math.random().toString(36).substring(2, 9),
          fromName: text.fromName,
          text: text.text,
          timestamp: text.timestamp || Date.now(),
        });
      },
      onRoomInfo: (_roomId, url) => {
        setShareUrl(url);
      },
    });

    signalingRef.current = signaling;
    signaling.start();

    return () => {
      signaling.destroy();
    };
  }, [myDeviceName, autoAccept]);

  // Handle saving customized real device name
  const handleSaveDeviceName = (newName: string) => {
    setMyDeviceName(newName);
    localStorage.setItem('localreceive_device_name', newName);

    if (myPeer) {
      setMyPeer({ ...myPeer, name: newName });
    }

    if (signalingRef.current && myPeer) {
      signalingRef.current.updateSelf({
        name: newName,
        deviceType: myPeer.deviceType,
      });
    }

    setConnectedToast(`✓ Device renamed to "${newName}"!`);
    setTimeout(() => setConnectedToast(null), 2500);
  };

  // Sender Initiates Transfer
  const handleSelectPeerToSend = async (targetPeer: Peer, fileList: FileList) => {
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);
    const files: FileItem[] = filesArray.map((f, idx) => ({
      id: `send-${Date.now()}-${idx}`,
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,
    }));

    const totalBytes = files.reduce((acc, curr) => acc + curr.size, 0);
    const transferId = Math.random().toString(36).substring(2, 10);

    pendingSenderFilesRef.current = {
      targetPeer,
      filesArray,
      files,
      totalBytes,
      transferId,
    };

    setActiveTransfer({
      id: transferId,
      direction: 'sending',
      peer: targetPeer,
      files,
      currentFileIndex: 0,
      bytesTransferred: 0,
      totalBytes,
      progressPercent: 0,
      speedMBs: 0,
      etaSeconds: 0,
      status: 'waiting_approval',
      mode: signalingRef.current?.isCloud() ? 'webrtc' : 'lan_stream',
    });

    signalingRef.current?.sendDirect(targetPeer.id, {
      type: 'file-offer',
      to: targetPeer.id,
      from: myPeer?.id,
      fromName: myPeer?.name,
      transferId,
      files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    });
  };

  // Recipient Accepts Incoming Transfer
  const handleAcceptTransfer = () => {
    if (!activeTransfer) return;

    signalingRef.current?.sendDirect(activeTransfer.peer.id, {
      type: 'file-response',
      to: activeTransfer.peer.id,
      from: myPeer?.id,
      transferId: activeTransfer.id,
      accepted: true,
    });

    if (signalingRef.current?.isCloud()) {
      const rtc = new WebRTCConnection(
        false,
        (sig) =>
          signalingRef.current?.sendDirect(activeTransfer.peer.id, {
            type: 'signal',
            to: activeTransfer.peer.id,
            from: myPeer?.id,
            data: sig,
          }),
        (file) => handleWebRTCFileReceived(file, activeTransfer.peer.id),
        (bytes, total, speed, eta) => {
          setActiveTransfer((prev) =>
            prev
              ? {
                  ...prev,
                  bytesTransferred: bytes,
                  progressPercent: total > 0 ? (bytes / total) * 100 : 0,
                  speedMBs: speed,
                  etaSeconds: eta,
                }
              : null
          );
        }
      );
      webrtcConnectionsRef.current.set(activeTransfer.peer.id, rtc);
    }

    setActiveTransfer((prev) =>
      prev ? { ...prev, status: 'transferring', progressPercent: 15 } : null
    );
  };

  // Recipient Declines Incoming Transfer
  const handleRejectTransfer = () => {
    if (!activeTransfer) return;

    if (activeTransfer.direction === 'sending') {
      signalingRef.current?.sendDirect(activeTransfer.peer.id, {
        type: 'file-cancel',
        to: activeTransfer.peer.id,
        from: myPeer?.id,
        transferId: activeTransfer.id,
      });
      pendingSenderFilesRef.current = null;
      setActiveTransfer(null);
      return;
    }

    signalingRef.current?.sendDirect(activeTransfer.peer.id, {
      type: 'file-response',
      to: activeTransfer.peer.id,
      from: myPeer?.id,
      transferId: activeTransfer.id,
      accepted: false,
      reason: 'Declined by recipient.',
    });

    setActiveTransfer(null);
  };

  const handleSendText = (targetPeerId: string, text: string) => {
    signalingRef.current?.sendDirect(targetPeerId, {
      type: 'text-share',
      to: targetPeerId,
      from: myPeer?.id,
      fromName: myPeer?.name,
      text,
      timestamp: Date.now(),
    });
  };

  const localDisplayUrl = shareUrl;

  
  if (viewMode === 'showcase') {
    return (
      <ShowcaseView
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onLaunchApp={() => setViewMode('app')}
      />
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? 'bg-[#070707] text-[#ededed]' : 'bg-[#fdfdfd] text-[#0d0d0d]'
      }`}
    >
      {/* Toast Notification */}
      {connectedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-2 rounded-full flex items-center space-x-2 border border-[#222222] bg-[#121212] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white">{connectedToast}</span>
          </div>
        </div>
      )}

      {/* Pure transitions.dev & efferd.com Experience (Zero Old UI) */}
      <LocalTransferView
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        myPeer={myPeer}
        peers={peers}
        hostInfo={hostInfo}
        localUrl={localDisplayUrl}
        autoAccept={autoAccept}
        onToggleAutoAccept={() => setAutoAccept(!autoAccept)}
        onOpenQR={() => setIsQROpen(true)}
        onOpenTextShare={() => setIsTextShareOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onEditDeviceName={() => setIsDeviceNameModalOpen(true)}
        onSelectPeerToSend={handleSelectPeerToSend}
        activeTransfer={activeTransfer}
      />

      {/* Transfer Modal */}
      <TransferModal
        transfer={activeTransfer}
        onAccept={handleAcceptTransfer}
        onReject={handleRejectTransfer}
        onClose={() => setActiveTransfer(null)}
        isDark={isDark}
      />

      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        localUrl={localDisplayUrl}
        isDark={isDark}
      />

      <TextShareModal
        isOpen={isTextShareOpen}
        onClose={() => setIsTextShareOpen(false)}
        peers={peers}
        onSendText={handleSendText}
        receivedText={receivedText}
        onClearReceivedText={() => setReceivedText(null)}
        isDark={isDark}
      />

      <SlideTransferDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isDark={isDark}
        autoAccept={autoAccept}
        onToggleAutoAccept={() => setAutoAccept(!autoAccept)}
        activeTransfer={activeTransfer}
        history={transferHistory}
        onClearHistory={() => setTransferHistory([])}
      />

      {/* Real Device Name Customization Modal */}
      <DeviceNameModal
        isOpen={isDeviceNameModalOpen}
        onClose={() => setIsDeviceNameModalOpen(false)}
        currentName={myDeviceName}
        onSaveName={handleSaveDeviceName}
        isDark={isDark}
      />
    </div>
  );
};
