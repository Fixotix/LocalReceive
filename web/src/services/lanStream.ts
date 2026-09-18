export interface UploadProgressCallback {
  (bytesSent: number, totalBytes: number, speedMBs: number, etaSeconds: number): void;
}

/**
 * High-Speed LAN HTTP Stream Uploader with precise speed and ETA tracking.
 */
export function uploadFileOverLAN(
  file: File,
  onProgress: UploadProgressCallback
): Promise<{ fileId: string; downloadUrl: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    let lastTime = Date.now();
    let lastBytes = 0;
    let currentSpeedMBs = 0;

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const now = Date.now();
        const timeDiff = (now - lastTime) / 1000; // seconds

        // Update speed calculation every 300ms
        if (timeDiff >= 0.3 || e.loaded === e.total) {
          const bytesDiff = e.loaded - lastBytes;
          const bytesPerSec = timeDiff > 0 ? bytesDiff / timeDiff : 0;
          currentSpeedMBs = bytesPerSec / (1024 * 1024);

          lastTime = now;
          lastBytes = e.loaded;
        }

        const remainingBytes = e.total - e.loaded;
        const etaSeconds = currentSpeedMBs > 0 ? Math.round(remainingBytes / (currentSpeedMBs * 1024 * 1024)) : 0;

        onProgress(e.loaded, e.total, currentSpeedMBs, etaSeconds);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve({
            fileId: res.fileId,
            downloadUrl: res.downloadUrl,
          });
        } catch (err) {
          reject(new Error('Invalid response from server'));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('LAN Network error occurred during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was aborted'));
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
}
