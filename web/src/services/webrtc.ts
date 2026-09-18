import { UploadProgressCallback } from './lanStream';

const CHUNK_SIZE = 64 * 1024; // 64 KB chunks
const BUFFER_LOW_THRESHOLD = 1 * 1024 * 1024; // 1 MB
const BUFFER_MAX = 4 * 1024 * 1024; // 4 MB backpressure cap

export interface WebRTCFileHeader {
  type: 'file-meta';
  transferId: string;
  name: string;
  size: number;
  mimeType: string;
}

export class WebRTCConnection {
  private pc: RTCPeerConnection;
  private dc: RTCDataChannel | null = null;
  private onSignal: (data: any) => void;
  private onFileReceived?: (file: File) => void;
  private onReceiveProgress?: UploadProgressCallback;

  // Receiving state
  private currentIncomingMeta: WebRTCFileHeader | null = null;
  private receivedBuffers: ArrayBuffer[] = [];
  private bytesReceived = 0;
  private receiveStartTime = 0;
  private lastReceiveProgressTime = 0;
  private lastReceiveBytes = 0;

  constructor(
    isInitiator: boolean,
    onSignal: (data: any) => void,
    onFileReceived?: (file: File) => void,
    onReceiveProgress?: UploadProgressCallback
  ) {
    this.onSignal = onSignal;
    this.onFileReceived = onFileReceived;
    this.onReceiveProgress = onReceiveProgress;

    // Use STUN servers for NAT traversal + direct LAN candidates
    this.pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
      ],
    });

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.onSignal({ candidate: event.candidate });
      }
    };

    if (isInitiator) {
      this.dc = this.pc.createDataChannel('fileTransfer', {
        ordered: true,
      });
      this.setupDataChannel(this.dc);
    } else {
      this.pc.ondatachannel = (event) => {
        this.dc = event.channel;
        this.setupDataChannel(this.dc);
      };
    }
  }

  private setupDataChannel(channel: RTCDataChannel) {
    channel.binaryType = 'arraybuffer';
    channel.bufferedAmountLowThreshold = BUFFER_LOW_THRESHOLD;

    channel.onopen = () => {
      console.log('[WebRTC] DataChannel opened for high-speed P2P transfer');
    };

    channel.onmessage = (event) => {
      if (typeof event.data === 'string') {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'file-meta') {
            this.currentIncomingMeta = msg;
            this.receivedBuffers = [];
            this.bytesReceived = 0;
            this.receiveStartTime = Date.now();
            this.lastReceiveProgressTime = Date.now();
            this.lastReceiveBytes = 0;
          }
        } catch (e) {
          console.error('[WebRTC] Failed to parse message', e);
        }
      } else if (event.data instanceof ArrayBuffer && this.currentIncomingMeta) {
        this.receivedBuffers.push(event.data);
        this.bytesReceived += event.data.byteLength;

        const now = Date.now();
        const diff = (now - this.lastReceiveProgressTime) / 1000;
        if (diff >= 0.25 || this.bytesReceived >= this.currentIncomingMeta.size) {
          const bytesDiff = this.bytesReceived - this.lastReceiveBytes;
          const speedMBs = diff > 0 ? bytesDiff / diff / (1024 * 1024) : 0;
          const remaining = this.currentIncomingMeta.size - this.bytesReceived;
          const eta = speedMBs > 0 ? Math.round(remaining / (speedMBs * 1024 * 1024)) : 0;

          if (this.onReceiveProgress) {
            this.onReceiveProgress(this.bytesReceived, this.currentIncomingMeta.size, speedMBs, eta);
          }

          this.lastReceiveProgressTime = now;
          this.lastReceiveBytes = this.bytesReceived;
        }

        // Check if download complete
        if (this.bytesReceived >= this.currentIncomingMeta.size) {
          const blob = new Blob(this.receivedBuffers, { type: this.currentIncomingMeta.mimeType });
          const file = new File([blob], this.currentIncomingMeta.name, {
            type: this.currentIncomingMeta.mimeType,
          });

          if (this.onFileReceived) {
            this.onFileReceived(file);
          }

          this.receivedBuffers = [];
          this.currentIncomingMeta = null;
        }
      }
    };
  }

  public async startOffer(): Promise<void> {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    this.onSignal({ sdp: this.pc.localDescription });
  }

  public async handleSignal(data: any): Promise<void> {
    if (data.sdp) {
      await this.pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      if (data.sdp.type === 'offer') {
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        this.onSignal({ sdp: this.pc.localDescription });
      }
    } else if (data.candidate) {
      await this.pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  }

  public async sendFile(
    file: File,
    transferId: string,
    onProgress: UploadProgressCallback
  ): Promise<void> {
    if (!this.dc || this.dc.readyState !== 'open') {
      throw new Error('WebRTC DataChannel is not open');
    }

    // 1. Send file metadata
    const meta: WebRTCFileHeader = {
      type: 'file-meta',
      transferId,
      name: file.name,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
    };
    this.dc.send(JSON.stringify(meta));

    // 2. Stream chunks with flow control backpressure
    let offset = 0;
    let lastTime = Date.now();
    let lastBytes = 0;
    let speedMBs = 0;

    while (offset < file.size) {
      // If buffer is saturated, wait for buffer to drain
      if (this.dc.bufferedAmount > BUFFER_MAX) {
        await new Promise<void>((resolve) => {
          const onLow = () => {
            this.dc?.removeEventListener('bufferedamountlow', onLow);
            resolve();
          };
          this.dc?.addEventListener('bufferedamountlow', onLow);
        });
      }

      const chunk = file.slice(offset, offset + CHUNK_SIZE);
      const buffer = await chunk.arrayBuffer();
      this.dc.send(buffer);

      offset += buffer.byteLength;

      const now = Date.now();
      const timeDiff = (now - lastTime) / 1000;
      if (timeDiff >= 0.25 || offset >= file.size) {
        const bytesDiff = offset - lastBytes;
        speedMBs = timeDiff > 0 ? bytesDiff / timeDiff / (1024 * 1024) : 0;
        const remaining = file.size - offset;
        const eta = speedMBs > 0 ? Math.round(remaining / (speedMBs * 1024 * 1024)) : 0;

        onProgress(offset, file.size, speedMBs, eta);
        lastTime = now;
        lastBytes = offset;
      }
    }
  }

  public close() {
    this.dc?.close();
    this.pc.close();
  }
}
