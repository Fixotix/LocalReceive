import os from 'os';
import QRCode from 'qrcode';

export interface NetworkInfo {
  ip: string;
  family: string;
  name: string;
  url: string;
}

/**
 * Retrieves all active non-internal IPv4 LAN addresses.
 */
export function getLocalIPs(port: number): NetworkInfo[] {
  const interfaces = os.networkInterfaces();
  const results: NetworkInfo[] = [];

  for (const [name, netList] of Object.entries(interfaces)) {
    if (!netList) continue;
    for (const net of netList) {
      // Look for IPv4 addresses that are not internal loopbacks (127.0.0.1)
      if (net.family === 'IPv4' && !net.internal) {
        results.push({
          ip: net.address,
          family: net.family,
          name,
          url: `http://${net.address}:${port}`,
        });
      }
    }
  }

  // Sort preferring 192.168.x.x, 10.x.x.x, 172.x.x.x (common LAN ranges)
  results.sort((a, b) => {
    const isALan = a.ip.startsWith('192.168.') || a.ip.startsWith('10.');
    const isBLan = b.ip.startsWith('192.168.') || b.ip.startsWith('10.');
    if (isALan && !isBLan) return -1;
    if (!isALan && isBLan) return 1;
    return 0;
  });

  return results;
}

/**
 * Returns the primary LAN IP or localhost fallback.
 */
export function getPrimaryLANUrl(port: number): string {
  const ips = getLocalIPs(port);
  if (ips.length > 0) {
    return ips[0].url;
  }
  return `http://localhost:${port}`;
}

/**
 * Generates an ASCII QR code for terminal display.
 */
export async function generateTerminalQRCode(url: string): Promise<string> {
  try {
    return await QRCode.toString(url, { type: 'terminal', small: true });
  } catch (err) {
    return '';
  }
}

/**
 * Generates a Data URL (base64 image) of the QR code for web rendering.
 */
export async function generateQRCodeDataUrl(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      margin: 2,
      scale: 8,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    return '';
  }
}
