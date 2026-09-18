import { DeviceType } from '../types';

/**
 * Parses the User Agent and client hints to extract the real device name/model.
 */
export async function detectRealDeviceName(isHost: boolean, hostComputerName?: string): Promise<{ name: string; type: DeviceType }> {
  // If user previously set a custom name, respect it
  const saved = localStorage.getItem('localreceive_device_name') || localStorage.getItem('localhere_device_name');
  if (saved && saved.trim()) {
    return { name: saved.trim(), type: detectDeviceType() };
  }

  // If running inside Native Android APK, check AndroidBridge
  if (typeof window !== 'undefined' && (window as any).AndroidBridge) {
    try {
      const model = (window as any).AndroidBridge.getDeviceModel?.();
      if (model && model.trim()) {
        return { name: model.trim(), type: 'android' };
      }
    } catch (_) {}
  }

  // If this client is the host machine and has a real computer hostname
  if (isHost && hostComputerName) {
    const cleanedHost = hostComputerName
      .replace(/\.local$/i, '')
      .replace(/[-_]/g, ' ');
    return { name: cleanedHost, type: detectDeviceType() };
  }

  const ua = navigator.userAgent;
  const type = detectDeviceType();

  // Try modern userAgentData Client Hints API (Chrome / Edge / Android)
  if ((navigator as any).userAgentData?.getHighEntropyValues) {
    try {
      const hints = await (navigator as any).userAgentData.getHighEntropyValues(['model', 'platform', 'platformVersion']);
      if (hints.model && hints.model.trim()) {
        const brand = hints.platform === 'Android' ? 'Android' : hints.platform || '';
        return {
          name: `${brand} ${hints.model}`.trim(),
          type,
        };
      }
    } catch (_) {}
  }

  // Fallback: Parse User-Agent string for real device model
  if (/Android/i.test(ua)) {
    const match = ua.match(/Android\s+[^;]+;\s*([^;)]+)\s*(?:Build|[;)])/i);
    if (match && match[1]) {
      const model = match[1].trim();
      if (!/^K$|^wv$/i.test(model)) {
        return { name: model, type: 'android' };
      }
    }
    return { name: 'Android Phone', type: 'android' };
  }

  if (/iPhone/i.test(ua)) {
    return { name: 'Apple iPhone', type: 'ios' };
  }

  if (/iPad/i.test(ua)) {
    return { name: 'Apple iPad', type: 'ios' };
  }

  if (/Macintosh|Mac OS X/i.test(ua)) {
    return { name: 'MacBook / Mac', type: 'mac' };
  }

  if (/Windows NT 10/i.test(ua)) {
    return { name: 'Windows 10/11 PC', type: 'windows' };
  }

  if (/Windows/i.test(ua)) {
    return { name: 'Windows PC', type: 'windows' };
  }

  if (/Linux/i.test(ua)) {
    return { name: 'Linux Desktop', type: 'linux' };
  }

  return { name: 'Web Device', type: 'browser' };
}

export function detectDeviceType(): DeviceType {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';
  if (ua.includes('macintosh') || ua.includes('mac os')) return 'mac';
  if (ua.includes('windows')) return 'windows';
  if (ua.includes('linux')) return 'linux';
  return 'browser';
}

export function getNativeLocalIp(): string | null {
  if (typeof window !== 'undefined' && (window as any).AndroidBridge) {
    try {
      const ip = (window as any).AndroidBridge.getLocalIp?.();
      if (ip && ip.trim()) return ip.trim();
    } catch (_) {}
  }
  return null;
}
