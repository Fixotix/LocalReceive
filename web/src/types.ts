export type DeviceType = 'mac' | 'windows' | 'android' | 'ios' | 'linux' | 'browser';

export interface Peer {
  id: string;
  name: string;
  deviceType: DeviceType;
  ip: string;
  joinedAt: number;
  pin?: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
  previewUrl?: string;
}

export type TransferStatus = 
  | 'idle'
  | 'offering'
  | 'waiting_approval'
  | 'incoming_prompt'
  | 'transferring'
  | 'completed'
  | 'rejected'
  | 'error';

export interface ActiveTransfer {
  id: string;
  direction: 'sending' | 'receiving';
  peer: Peer;
  files: FileItem[];
  currentFileIndex: number;
  bytesTransferred: number;
  totalBytes: number;
  progressPercent: number; // 0 - 100
  speedMBs: number;
  etaSeconds: number;
  status: TransferStatus;
  mode: 'webrtc' | 'lan_stream';
  error?: string;
  downloadUrl?: string;
}

export interface SharedText {
  id: string;
  fromName: string;
  text: string;
  timestamp: number;
}

export interface TransferHistoryItem {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  peerName: string;
  direction: 'sent' | 'received';
  timestamp: number;
  speedMBs: number;
  downloadUrl?: string;
}

export interface HostInfo {
  appName: string;
  version: string;
  hostname: string;
  port: number;
  primaryUrl: string;
  interfaces: Array<{ ip: string; name: string; url: string }>;
  qrCode: string;
  activePeers: number;
}
