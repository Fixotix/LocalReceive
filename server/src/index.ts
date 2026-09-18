import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import os from 'os';
import cors from 'cors';
import multer from 'multer';
import { getLocalIPs, getPrimaryLANUrl, generateTerminalQRCode, generateQRCodeDataUrl } from './network';
import { SignalingServer } from './signaling';

const PORT = parseInt(process.env.PORT || '5050', 10);
const HOST = '0.0.0.0';

const app = express();
const server = http.createServer(app);

// Temporary directory for direct high-speed LAN HTTP file transfers
const UPLOAD_DIR = path.join(os.tmpdir(), 'localreceive-transfers');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Setup Multer for zero-copy direct streaming to disk
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${uniquePrefix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    // 50GB file size limit for local LAN streaming
    fileSize: 50 * 1024 * 1024 * 1024,
  },
});

app.use(cors());
app.use(express.json());

// In-memory registry for uploaded transfer files
interface UploadedFileRecord {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  filePath: string;
  createdAt: number;
}

const fileRegistry = new Map<string, UploadedFileRecord>();

// Clean up stale files older than 1 hour
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [id, record] of fileRegistry.entries()) {
    if (record.createdAt < oneHourAgo) {
      if (fs.existsSync(record.filePath)) {
        try {
          fs.unlinkSync(record.filePath);
        } catch (e) {
          // Ignore
        }
      }
      fileRegistry.delete(id);
    }
  }
}, 10 * 60 * 1000);

// Initialize WebSocket Signaling Server
const signaling = new SignalingServer(server);

// API: Get Host & Network Information + QR code
app.get('/api/info', async (_req, res) => {
  const interfaces = getLocalIPs(PORT);
  const primaryUrl = getPrimaryLANUrl(PORT);
  const qrCodeDataUrl = await generateQRCodeDataUrl(primaryUrl);

  res.json({
    appName: 'LocalReceive',
    version: '2.0.0',
    hostname: os.hostname(),
    platform: os.platform(),
    port: PORT,
    primaryUrl,
    interfaces,
    qrCode: qrCodeDataUrl,
    activePeers: signaling.getConnectedPeerCount(),
  });
});

// API: List active peers
app.get('/api/peers', (_req, res) => {
  res.json({
    peers: signaling.getAllPeers(),
  });
});

// API: Direct High-Speed LAN File Upload (Engine B Fallback)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const fileId = Math.random().toString(36).substring(2, 10);
  const record: UploadedFileRecord = {
    id: fileId,
    originalName: req.file.originalname,
    size: req.file.size,
    mimeType: req.file.mimetype,
    filePath: req.file.path,
    createdAt: Date.now(),
  };

  fileRegistry.set(fileId, record);

  console.log(`[LAN Stream Upload] File received: "${req.file.originalname}" (${(req.file.size / (1024 * 1024)).toFixed(2)} MB) -> ID: ${fileId}`);

  return res.json({
    fileId,
    originalName: req.file.originalname,
    size: req.file.size,
    downloadUrl: `/api/download/${fileId}`,
  });
});

// API: Direct High-Speed LAN File Download
app.get('/api/download/:fileId', (req, res) => {
  const { fileId } = req.params;
  const record = fileRegistry.get(fileId);

  if (!record || !fs.existsSync(record.filePath)) {
    return res.status(404).json({ error: 'File not found or expired' });
  }

  res.setHeader('Content-Type', record.mimeType || 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(record.originalName)}"`);
  res.setHeader('Content-Length', record.size);

  const fileStream = fs.createReadStream(record.filePath);
  fileStream.pipe(res);
});

// Serve Web App static build if available
const candidatePaths = [
  path.resolve(__dirname, '../public'),
  path.resolve(__dirname, '../../web/dist'),
  path.resolve(process.cwd(), 'public'),
  path.resolve(process.cwd(), 'server/public'),
  path.resolve(process.cwd(), '../web/dist'),
  path.resolve(process.cwd(), 'web/dist'),
];

const webDistPath = candidatePaths.find((p) => fs.existsSync(path.join(p, 'index.html')));

if (webDistPath) {
  console.log(`[Static] Serving LocalReceive web client from: ${webDistPath}`);
  app.use(express.static(webDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(webDistPath, 'index.html'));
  });
}

// Start HTTP + WebSocket Server
server.listen(PORT, HOST, async () => {
  const primaryUrl = getPrimaryLANUrl(PORT);
  const allIPs = getLocalIPs(PORT);
  const qrAscii = await generateTerminalQRCode(primaryUrl);

  console.log('\n============================================================');
  console.log('  LOCALRECEIVE — ULTRA-FAST LOCAL AIRDROP & SHARING SERVER  ');
  console.log('============================================================\n');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌐 Primary LAN Access: \x1b[36m${primaryUrl}\x1b[0m`);
  
  if (allIPs.length > 1) {
    console.log('\nAdditional Network Interfaces:');
    allIPs.slice(1).forEach((net) => {
      console.log(`  - ${net.name}: ${net.url}`);
    });
  }

  console.log('\n📲 Scan with your Phone / Android device camera to connect instantly:\n');
  if (qrAscii) {
    console.log(qrAscii);
  }
  console.log('============================================================\n');
});
