import { WebSocket, WebSocketServer } from 'ws';
import http from 'http';

export interface PeerInfo {
  id: string;
  name: string;
  deviceType: 'mac' | 'windows' | 'android' | 'ios' | 'linux' | 'browser';
  ip: string;
  joinedAt: number;
}

interface PeerConnection {
  ws: WebSocket;
  info: PeerInfo;
}

export class SignalingServer {
  private wss: WebSocketServer;
  private peers = new Map<string, PeerConnection>();

  constructor(server: http.Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.setupListeners();
  }

  private setupListeners() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        req.socket.remoteAddress || '127.0.0.1';

      let peerId: string | null = null;

      ws.on('message', (rawMessage: string) => {
        try {
          const msg = JSON.parse(rawMessage.toString());
          this.handleMessage(ws, msg, clientIp, (id) => {
            peerId = id;
          });
        } catch (err) {
          console.error('[Signaling] Parse error:', err);
        }
      });

      ws.on('close', () => {
        if (peerId && this.peers.has(peerId)) {
          const departingPeer = this.peers.get(peerId)?.info;
          this.peers.delete(peerId);
          console.log(`[Signaling] Peer left: ${departingPeer?.name} (${peerId})`);
          this.broadcastPeers();
        }
      });

      ws.on('error', (err) => {
        console.error(`[Signaling] Socket error on peer ${peerId}:`, err);
      });
    });
  }

  private handleMessage(
    ws: WebSocket,
    msg: any,
    clientIp: string,
    setPeerId: (id: string) => void
  ) {
    const { type } = msg;

    switch (type) {
      case 'join': {
        const id = msg.id || Math.random().toString(36).substring(2, 9);
        const name = msg.name || `Device-${id.substring(0, 4)}`;
        const deviceType = msg.deviceType || 'browser';

        const info: PeerInfo = {
          id,
          name,
          deviceType,
          ip: clientIp,
          joinedAt: Date.now(),
        };

        this.peers.set(id, { ws, info });
        setPeerId(id);

        console.log(`[Signaling] Peer joined: "${name}" (${deviceType}) [${id}] from ${clientIp}`);

        this.send(ws, {
          type: 'welcome',
          self: info,
          peers: this.getPeerList(id),
        });

        this.broadcastPeers();
        break;
      }

      case 'update-profile': {
        const peer = this.peers.get(msg.id);
        if (peer) {
          if (msg.name) peer.info.name = msg.name;
          if (msg.deviceType) peer.info.deviceType = msg.deviceType;
          console.log(`[Signaling] Peer updated profile: "${peer.info.name}" [${msg.id}]`);
          this.broadcastPeers();
        }
        break;
      }

      case 'signal': {
        const { to, from, data } = msg;
        const target = this.peers.get(to);
        if (target && target.ws.readyState === WebSocket.OPEN) {
          this.send(target.ws, {
            type: 'signal',
            from,
            data,
          });
        }
        break;
      }

      case 'file-offer': {
        const { to, from, transferId, files, directStreamUrl } = msg;
        const target = this.peers.get(to);
        if (target && target.ws.readyState === WebSocket.OPEN) {
          this.send(target.ws, {
            type: 'file-offer',
            from,
            fromName: this.peers.get(from)?.info.name || 'Unknown Device',
            transferId,
            files,
            directStreamUrl,
          });
        }
        break;
      }

      case 'file-response': {
        const { to, from, transferId, accepted, reason } = msg;
        const target = this.peers.get(to);
        if (target && target.ws.readyState === WebSocket.OPEN) {
          this.send(target.ws, {
            type: 'file-response',
            from,
            transferId,
            accepted,
            reason,
          });
        }
        break;
      }

      case 'file-ready': {
        const { to, from, transferId, downloadUrl, files } = msg;
        const target = this.peers.get(to);
        if (target && target.ws.readyState === WebSocket.OPEN) {
          this.send(target.ws, {
            type: 'file-ready',
            from,
            transferId,
            downloadUrl,
            files,
          });
        }
        break;
      }

      case 'file-completed': {
        const { to, from, transferId } = msg;
        const target = this.peers.get(to);
        if (target && target.ws.readyState === WebSocket.OPEN) {
          this.send(target.ws, {
            type: 'file-completed',
            from,
            transferId,
          });
        }
        break;
      }

      case 'file-cancel': {
        const { to, from, transferId } = msg;
        const target = this.peers.get(to);
        if (target && target.ws.readyState === WebSocket.OPEN) {
          this.send(target.ws, {
            type: 'file-cancel',
            from,
            transferId,
          });
        }
        break;
      }

      case 'file-progress': {
        const { to, from, transferId, bytesTransferred, totalBytes, speedMBs, etaSeconds } = msg;
        const target = this.peers.get(to);
        if (target && target.ws.readyState === WebSocket.OPEN) {
          this.send(target.ws, {
            type: 'file-progress',
            from,
            transferId,
            bytesTransferred,
            totalBytes,
            speedMBs,
            etaSeconds,
          });
        }
        break;
      }

      case 'text-share': {
        const { to, from, text } = msg;
        const target = this.peers.get(to);
        if (target && target.ws.readyState === WebSocket.OPEN) {
          this.send(target.ws, {
            type: 'text-share',
            from,
            fromName: this.peers.get(from)?.info.name || 'Unknown Device',
            text,
            timestamp: Date.now(),
          });
        }
        break;
      }

      case 'ping': {
        this.send(ws, { type: 'pong' });
        break;
      }

      default: {
        if (msg.to) {
          const target = this.peers.get(msg.to);
          if (target && target.ws.readyState === WebSocket.OPEN) {
            this.send(target.ws, msg);
          }
        } else {
          console.warn('[Signaling] Unknown message type:', type);
        }
      }
    }
  }

  private send(ws: WebSocket, payload: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }

  private getPeerList(excludeId?: string): PeerInfo[] {
    const list: PeerInfo[] = [];
    for (const [id, conn] of this.peers.entries()) {
      if (id !== excludeId) {
        list.push(conn.info);
      }
    }
    return list;
  }

  private broadcastPeers() {
    for (const [id, conn] of this.peers.entries()) {
      if (conn.ws.readyState === WebSocket.OPEN) {
        this.send(conn.ws, {
          type: 'peers-update',
          peers: this.getPeerList(id),
        });
      }
    }
  }

  public getConnectedPeerCount(): number {
    return this.peers.size;
  }

  public getAllPeers(): PeerInfo[] {
    return Array.from(this.peers.values()).map(p => p.info);
  }
}
