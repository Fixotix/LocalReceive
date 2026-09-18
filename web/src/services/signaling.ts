import mqtt, { MqttClient } from 'mqtt';
import { Peer } from '../types';

export type SignalMessage =
  | { type: 'join'; peer: Peer }
  | { type: 'presence'; to: string; peer: Peer }
  | { type: 'ping'; id: string }
  | { type: 'leave'; id: string }
  | { type: 'signal'; to: string; from: string; data: any }
  | { type: 'file-offer'; to: string; from: string; fromName: string; transferId: string; files: any[] }
  | { type: 'file-response'; to: string; from: string; transferId: string; accepted: boolean; reason?: string }
  | { type: 'file-progress'; to: string; from: string; transferId: string; bytesTransferred: number; totalBytes: number; speedMBs: number; etaSeconds: number }
  | { type: 'file-ready'; to: string; from: string; transferId: string; downloadUrl?: string; files: any[] }
  | { type: 'file-completed'; to: string; from: string; transferId: string }
  | { type: 'file-cancel'; to: string; from: string; transferId: string }
  | { type: 'text-share'; to: string; from: string; fromName: string; text: string; timestamp: number };

export interface SignalingEvents {
  onSelfReady: (self: Peer) => void;
  onPeersUpdate: (peers: Peer[]) => void;
  onSignal: (from: string, data: any) => void;
  onFileOffer: (offer: { from: string; fromName: string; transferId: string; files: any[] }) => void;
  onFileResponse: (resp: { from: string; transferId: string; accepted: boolean; reason?: string }) => void;
  onFileProgress?: (progress: { from: string; transferId: string; bytesTransferred: number; totalBytes: number; speedMBs: number; etaSeconds: number }) => void;
  onFileReady: (ready: { from: string; transferId: string; downloadUrl?: string; files: any[] }) => void;
  onFileCompleted: (comp: { from: string; transferId: string }) => void;
  onFileCancel: (canc: { from: string; transferId: string }) => void;
  onTextShare: (text: { from: string; fromName: string; text: string; timestamp: number }) => void;
  onRoomInfo: (roomId: string, shareUrl: string) => void;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36).substring(0, 8);
}

// 1. WebRTC Google STUN Candidate probe for real router NAT WAN IP
function getPublicIPFromSTUN(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });
      pc.createDataChannel('detect');
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(reject);

      const timeout = setTimeout(() => {
        pc.close();
        reject(new Error('STUN timeout'));
      }, 2000);

      pc.onicecandidate = (event) => {
        if (event.candidate && event.candidate.candidate.includes('srflx')) {
          const parts = event.candidate.candidate.split(' ');
          const ip = parts[4];
          if (ip && ip.includes('.')) {
            clearTimeout(timeout);
            pc.close();
            resolve(ip.trim());
          }
        }
      };
    } catch (e) {
      reject(e);
    }
  });
}

// 2. High-speed parallel router WAN IP detection (STUN + IPv4 endpoints)
async function detectRouterIP(): Promise<string> {
  const httpUrls = [
    'https://ipv4.icanhazip.com',
    'https://api.db-ip.com/v2/free/self',
  ];

  const fetchPromise = Promise.any(
    httpUrls.map(async (url) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('Failed');
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (json.ipAddress) return json.ipAddress.trim();
        if (json.ip) return json.ip.trim();
      } catch {
        if (text.includes('.') && text.trim().length <= 16) {
          return text.trim();
        }
      }
      throw new Error('Invalid format');
    })
  );

  try {
    const ip = await Promise.any([fetchPromise, getPublicIPFromSTUN()]);
    if (ip) return ip;
  } catch (_) {
    // If all fail, return deterministic network room so devices still meet
  }

  return 'local-wifi-network';
}

export class SignalingService {
  private self: Peer;
  private events: SignalingEvents;
  private activePeers: Map<string, { peer: Peer; lastSeen: number }> = new Map();
  private ws: WebSocket | null = null;
  private mqttClient: MqttClient | null = null;
  private mode: 'local' | 'cloud' = 'cloud';
  private roomId: string = '';
  private pingTimer: any = null;
  private pruneTimer: any = null;
  private isDestroyed = false;

  constructor(self: Peer, events: SignalingEvents) {
    this.self = self;
    this.events = events;
  }

  public updateSelf(updated: Partial<Peer>) {
    this.self = { ...this.self, ...updated };
    if (this.mode === 'local') {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'join', name: this.self.name, deviceType: this.self.deviceType }));
      }
    } else {
      this.sendBroadcast({ type: 'join', peer: this.self });
    }
  }

  public async start() {
    this.events.onSelfReady(this.self);

    // 1. Try local LAN websocket if running on local server port
    const isLocalHost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      /^192\.168\./.test(window.location.hostname) ||
      /^10\./.test(window.location.hostname);

    if (isLocalHost && !window.location.pathname.startsWith('/app')) {
      const localConnected = await this.tryConnectLocal();
      if (localConnected) {
        this.mode = 'local';
        console.log('[Signaling] Connected to local LAN server');
        return;
      }
    }

    // 2. Cloud Mode (Firebase Hosting) via HiveMQ MQTT WebSockets
    this.mode = 'cloud';
    await this.connectCloud();
  }

  private tryConnectLocal(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        const testWs = new WebSocket(wsUrl);

        let timeout = setTimeout(() => {
          testWs.close();
          resolve(false);
        }, 2000);

        testWs.onopen = () => {
          clearTimeout(timeout);
          this.ws = testWs;
          this.setupLocalWebSocket(testWs);
          resolve(true);
        };

        testWs.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };
      } catch {
        resolve(false);
      }
    });
  }

  private setupLocalWebSocket(ws: WebSocket) {
    ws.send(
      JSON.stringify({
        type: 'join',
        name: this.self.name,
        deviceType: this.self.deviceType,
      })
    );

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'welcome') {
          if (msg.self) {
            this.self = { ...this.self, id: msg.self.id, ip: msg.self.ip || this.self.ip };
            this.events.onSelfReady(this.self);
          }
          if (msg.peers) {
            this.events.onPeersUpdate(msg.peers);
          }
        } else if (msg.type === 'peers-update') {
          this.events.onPeersUpdate(msg.peers || []);
        } else {
          this.handleDirectMessage(msg);
        }
      } catch (err) {
        console.error('[Signaling] Local message parse error', err);
      }
    };

    ws.onclose = () => {
      if (!this.isDestroyed) {
        console.log('[Signaling] Local server closed, falling back to cloud broker...');
        this.mode = 'cloud';
        this.connectCloud();
      }
    };

    this.pingTimer = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 15000);
  }

  private async connectCloud() {
    // 1. Determine Room ID: URL hash/param > Fast Wi-Fi router WAN IP hash
    const hash = window.location.hash.replace(/^#/, '');
    const searchParams = new URLSearchParams(window.location.search);
    const roomFromUrl = searchParams.get('room') || (hash.startsWith('room=') ? hash.slice(5) : '');

    let detectedRoom = '';
    if (roomFromUrl) {
      detectedRoom = roomFromUrl.trim().toLowerCase();
    } else {
      const routerIp = await detectRouterIP();
      detectedRoom = `wifi-${simpleHash(routerIp)}`;
      console.log(`[Signaling] Auto-detected Wi-Fi router IP: ${routerIp} -> Shared Room: ${detectedRoom}`);
    }

    this.roomId = detectedRoom;

    let baseOrigin = 'https://localreceive.web.app';
    if (
      typeof window !== 'undefined' &&
      window.location.origin &&
      !window.location.origin.includes('androidplatform.net') &&
      !window.location.origin.includes('file://')
    ) {
      baseOrigin = window.location.origin;
    }
    const shareUrl = `${baseOrigin}/#room=${this.roomId}`;
    this.events.onRoomInfo(this.roomId, shareUrl);

    // 2. Connect to high-speed public MQTT broker over Secure WebSockets (HiveMQ)
    const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';
    console.log(`[Signaling] Connecting to MQTT broker: ${brokerUrl}`);

    try {
      const client = mqtt.connect(brokerUrl, {
        clientId: `lr_${this.self.id}_${Math.random().toString(16).substring(2, 8)}`,
        clean: true,
        reconnectPeriod: 3000,
        connectTimeout: 5000,
      });
      this.mqttClient = client;

      client.on('connect', () => {
        console.log('[Signaling] MQTT broker connected! Subscribing to room topic...');

        // Subscribe to:
        // 1. Wi-Fi / Local Room topic (100% automatic discovery for all devices on same Wi-Fi)
        const roomTopic = `localreceive/rooms/${this.roomId}`;
        client.subscribe(roomTopic, { qos: 0 });

        // 2. Direct Peer messages (signals, file offers, responses)
        const directTopic = `localreceive/direct/${this.self.id}`;
        client.subscribe(directTopic, { qos: 0 });

        // Broadcast presence to the room immediately!
        this.sendBroadcast({ type: 'join', peer: this.self });
      });

      client.on('message', (_topic, payload) => {
        try {
          const msg: SignalMessage = JSON.parse(payload.toString());
          this.handleMqttMessage(msg);
        } catch (e) {
          // ignore non-json
        }
      });

      client.on('error', (err) => {
        console.warn('[Signaling] MQTT broker error:', err);
      });

      // Heartbeat ping every 5 seconds
      clearInterval(this.pingTimer);
      this.pingTimer = setInterval(() => {
        this.sendBroadcast({ type: 'ping', id: this.self.id });
      }, 5000);

      // Prune inactive peers
      clearInterval(this.pruneTimer);
      this.pruneTimer = setInterval(() => {
        const now = Date.now();
        let changed = false;
        for (const [id, record] of this.activePeers.entries()) {
          if (now - record.lastSeen > 15000) {
            this.activePeers.delete(id);
            changed = true;
          }
        }
        if (changed) {
          this.emitPeersUpdate();
        }
      }, 3000);
    } catch (err) {
      console.error('[Signaling] Failed to initialize MQTT client', err);
    }
  }

  private handleMqttMessage(msg: SignalMessage) {
    if ('from' in msg && msg.from === this.self.id) return;
    if ('id' in msg && msg.id === this.self.id) return;
    if ('peer' in msg && msg.peer.id === this.self.id) return;

    switch (msg.type) {
      case 'join': {
        console.log(`[Signaling] Peer joined room: ${msg.peer.name} (${msg.peer.id})`);
        this.activePeers.set(msg.peer.id, { peer: msg.peer, lastSeen: Date.now() });
        this.emitPeersUpdate();

        // Reply with our presence so the newly joined peer immediately discovers us too!
        this.sendDirect(msg.peer.id, {
          type: 'presence',
          to: msg.peer.id,
          peer: this.self,
        });
        break;
      }

      case 'presence': {
        if (msg.to === this.self.id) {
          console.log(`[Signaling] Presence received from: ${msg.peer.name}`);
          this.activePeers.set(msg.peer.id, { peer: msg.peer, lastSeen: Date.now() });
          this.emitPeersUpdate();
        }
        break;
      }

      case 'ping': {
        const existing = this.activePeers.get(msg.id);
        if (existing) {
          existing.lastSeen = Date.now();
        }
        break;
      }

      case 'leave': {
        if (this.activePeers.has(msg.id)) {
          this.activePeers.delete(msg.id);
          this.emitPeersUpdate();
        }
        break;
      }

      default: {
        if ('to' in msg && msg.to === this.self.id) {
          this.handleDirectMessage(msg);
        }
        break;
      }
    }
  }

  private handleDirectMessage(msg: any) {
    switch (msg.type) {
      case 'signal':
        this.events.onSignal(msg.from, msg.data);
        break;
      case 'file-offer':
        this.events.onFileOffer({
          from: msg.from,
          fromName: msg.fromName,
          transferId: msg.transferId,
          files: msg.files || [],
        });
        break;
      case 'file-response':
        this.events.onFileResponse({
          from: msg.from,
          transferId: msg.transferId,
          accepted: msg.accepted,
          reason: msg.reason,
        });
        break;
      case 'file-progress':
        this.events.onFileProgress?.({
          from: msg.from,
          transferId: msg.transferId,
          bytesTransferred: msg.bytesTransferred,
          totalBytes: msg.totalBytes,
          speedMBs: msg.speedMBs,
          etaSeconds: msg.etaSeconds,
        });
        break;
      case 'file-ready':
        this.events.onFileReady({
          from: msg.from,
          transferId: msg.transferId,
          downloadUrl: msg.downloadUrl,
          files: msg.files || [],
        });
        break;
      case 'file-completed':
        this.events.onFileCompleted({
          from: msg.from,
          transferId: msg.transferId,
        });
        break;
      case 'file-cancel':
        this.events.onFileCancel({
          from: msg.from,
          transferId: msg.transferId,
        });
        break;
      case 'text-share':
        this.events.onTextShare({
          from: msg.from,
          fromName: msg.fromName,
          text: msg.text,
          timestamp: msg.timestamp || Date.now(),
        });
        break;
    }
  }

  private emitPeersUpdate() {
    const list = Array.from(this.activePeers.values()).map((v) => v.peer);
    this.events.onPeersUpdate(list);
  }

  public sendDirect(to: string, msg: any) {
    if (this.mode === 'local') {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(msg));
      }
    } else {
      if (this.mqttClient && this.mqttClient.connected) {
        this.mqttClient.publish(`localreceive/direct/${to}`, JSON.stringify(msg), { qos: 0 });
      }
    }
  }

  public sendBroadcast(msg: any) {
    if (this.mode === 'local') {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(msg));
      }
    } else {
      if (this.mqttClient && this.mqttClient.connected && this.roomId) {
        this.mqttClient.publish(`localreceive/rooms/${this.roomId}`, JSON.stringify(msg), { qos: 0 });
      }
    }
  }

  public getRoomId(): string {
    return this.roomId;
  }

  public isCloud(): boolean {
    return this.mode === 'cloud';
  }

  public destroy() {
    this.isDestroyed = true;
    clearInterval(this.pingTimer);
    clearInterval(this.pruneTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.mqttClient) {
      if (this.roomId) {
        this.sendBroadcast({ type: 'leave', id: this.self.id });
      }
      this.mqttClient.end(true);
      this.mqttClient = null;
    }
  }
}
