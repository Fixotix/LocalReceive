# ⚡ LocalReceive — Ultra-Fast, 100% Offline LAN AirDrop

<p align="center">
  <b>AirDrop alternative that works across Mac, Windows, Linux, Android & iOS over your local Wi-Fi / Hotspot.</b><br/>
  Zero cloud servers. Zero data limits. Wire-speed transfers up to 120+ MB/s. 100% Free & Open Source.
</p>

<p align="center">
  <a href="https://github.com/Fixotix/LocalReceive/stargazers"><img src="https://img.shields.io/github/stars/Fixotix/LocalReceive?style=flat-square&color=E5A93C" alt="GitHub Stars"/></a>
  <a href="https://github.com/Fixotix/LocalReceive/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Network-100%25%20Offline%20LAN-emerald?style=flat-square" alt="Offline LAN"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Speed-120%2B%20MB%2Fs-blueviolet?style=flat-square" alt="Wire Speed"/></a>
</p>

---

## ✨ Features

- 🚀 **Wire-Speed Transfers**: Stream 4K videos, folders, and multi-gigabyte files at raw Wi-Fi speeds (**50 MB/s to 120+ MB/s**) over 5GHz Wi-Fi or Ethernet.
- 🔒 **100% Offline & Private**: No data ever leaves your room. Direct device-to-device streaming without external cloud relays.
- 📡 **Automatic Wi-Fi Discovery**: Devices on the same Wi-Fi or mobile hotspot appear instantly on the radar dome as **Big Device Cards** with real names and connection status.
- ⚡ **Direct Auto-Receive**: Toggle auto-receive ON to accept incoming transfers without manual prompts.
- 📲 **Instant Phone Pairing (QR Code)**: Launch the server and scan the ASCII QR code in your terminal or web screen using any iPhone or Android camera.
- 🌐 **True Cross-Platform**:
  - **Apple iOS**: Open Safari on iPhone/iPad — zero app install required.
  - **Android**: Open Chrome or any browser on Android — zero app install required.
  - **macOS / Windows / Linux**: Chrome, Safari, Firefox, Edge, or Brave.
- 🎨 **Modern Liquid Glass UI**: Concentric radar dome, Solar duotone icons, responsive dark/light mode, and live GitHub stars count.

---

## 🚀 Quick Start (Run in 1 Minute)

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/Fixotix/LocalReceive.git
cd LocalReceive
```

### 2. Setup Dependencies
```bash
npm run setup
```

### 3. Start LocalReceive
```bash
npm start
```

That's it! Your terminal will immediately display:
```text
  ╔═══════════════════════════════════════════════════════════╗
  ║                ⚡ LOCALRECEIVE LAN HUB ⚡                 ║
  ╚═══════════════════════════════════════════════════════════╝
  📡 Local:       http://localhost:5050
  🌐 Wi-Fi (LAN): http://192.168.1.10:5050
  🔒 Mode:        100% Offline LAN • Zero Cloud Overhead
```
Along with a crisp **ASCII QR Code** in your terminal!

---

## 📱 Connecting Devices

### From Your Phone (iPhone or Android):
1. Make sure your phone is connected to the **same Wi-Fi** or **Hotspot** as your computer.
2. Open your phone camera and **scan the terminal QR code** (or the QR code in the desktop web app).
3. The web app opens instantly in Safari or Chrome. Both devices will automatically discover each other and display a **Big Device Card** on the radar!

### From Another Laptop / PC:
1. Open any browser and navigate to the LAN IP shown in the terminal (e.g. `http://192.168.1.10:5050`).
2. Both devices appear on screen — select files or drop them on the dome to beam them instantly!

---

## 🏗️ Project Architecture

```
Fixotix/LocalReceive
├── server/                 # Offline LAN WebSocket signaling & file streaming engine
│   ├── src/index.ts        # Express + WebSocket LAN server with ASCII terminal QR
│   ├── src/network.ts      # Multi-NIC local IP detector (192.168.x.x, 10.x.x.x)
│   ├── src/signaling.ts    # Direct zero-cloud LAN WebSocket signaling
│   └── public/             # Pre-built web client (runs immediately on fresh clones)
│
├── web/                    # 3D Concentric Radar & Liquid Glass Web UI
│   ├── src/components/     # Big Device Cards, Radar Dome, Header with Live Stars
│   ├── src/services/       # WebRTC P2P DataChannels + LAN Stream fallback
│   └── vite.config.ts
│
└── package.json            # Unified monorepo runner
```

---

## 🛠️ Development & Building

### Run in Development Mode:
```bash
# Start server in dev mode with hot-reload
npm run dev
```

### Build for Production:
```bash
npm run build
```
This compiles the TypeScript React client, bundles optimized assets into `server/public/`, and prepares the server for standalone execution.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/Fixotix/LocalReceive/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⭐️ Show Your Support

If you found LocalReceive helpful, give it a ⭐️ on [GitHub](https://github.com/Fixotix/LocalReceive)!

---

## 📄 License

Distributed under the **MIT License**.

Developed with ❤️ by **[Fixotix](https://github.com/Fixotix)**.
