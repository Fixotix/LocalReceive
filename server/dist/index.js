"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const network_1 = require("./network");
const signaling_1 = require("./signaling");
const PORT = parseInt(process.env.PORT || '5050', 10);
const HOST = '0.0.0.0';
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Temporary directory for direct high-speed LAN HTTP file transfers
const UPLOAD_DIR = path_1.default.join(os_1.default.tmpdir(), 'localreceive-transfers');
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
// Setup Multer for zero-copy direct streaming to disk
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        cb(null, `${uniquePrefix}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        // 50GB file size limit for local LAN streaming
        fileSize: 50 * 1024 * 1024 * 1024,
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const fileRegistry = new Map();
// Clean up stale files older than 1 hour
setInterval(() => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [id, record] of fileRegistry.entries()) {
        if (record.createdAt < oneHourAgo) {
            if (fs_1.default.existsSync(record.filePath)) {
                try {
                    fs_1.default.unlinkSync(record.filePath);
                }
                catch (e) {
                    // Ignore
                }
            }
            fileRegistry.delete(id);
        }
    }
}, 10 * 60 * 1000);
// Initialize WebSocket Signaling Server
const signaling = new signaling_1.SignalingServer(server);
// API: Get Host & Network Information + QR code
app.get('/api/info', async (_req, res) => {
    const interfaces = (0, network_1.getLocalIPs)(PORT);
    const primaryUrl = (0, network_1.getPrimaryLANUrl)(PORT);
    const qrCodeDataUrl = await (0, network_1.generateQRCodeDataUrl)(primaryUrl);
    res.json({
        appName: 'LocalReceive',
        version: '2.0.0',
        hostname: os_1.default.hostname(),
        platform: os_1.default.platform(),
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
    const record = {
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
    if (!record || !fs_1.default.existsSync(record.filePath)) {
        return res.status(404).json({ error: 'File not found or expired' });
    }
    res.setHeader('Content-Type', record.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(record.originalName)}"`);
    res.setHeader('Content-Length', record.size);
    const fileStream = fs_1.default.createReadStream(record.filePath);
    fileStream.pipe(res);
});
// Serve Web App static build if available
const candidatePaths = [
    path_1.default.resolve(__dirname, '../public'),
    path_1.default.resolve(__dirname, '../../web/dist'),
    path_1.default.resolve(process.cwd(), 'public'),
    path_1.default.resolve(process.cwd(), 'server/public'),
    path_1.default.resolve(process.cwd(), '../web/dist'),
    path_1.default.resolve(process.cwd(), 'web/dist'),
];
const webDistPath = candidatePaths.find((p) => fs_1.default.existsSync(path_1.default.join(p, 'index.html')));
if (webDistPath) {
    console.log(`[Static] Serving LocalReceive web client from: ${webDistPath}`);
    app.use(express_1.default.static(webDistPath));
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.join(webDistPath, 'index.html'));
    });
}
// Start HTTP + WebSocket Server
server.listen(PORT, HOST, async () => {
    const primaryUrl = (0, network_1.getPrimaryLANUrl)(PORT);
    const allIPs = (0, network_1.getLocalIPs)(PORT);
    const qrAscii = await (0, network_1.generateTerminalQRCode)(primaryUrl);
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
