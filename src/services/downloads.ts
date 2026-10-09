import { sanitizeFilename } from '../core/normalization';

export interface DownloadOptions {
  filename: string;
  content: string;
  mimeType: string;
  hostname: string;
}

export async function downloadFile(options: DownloadOptions): Promise<boolean> {
  const { filename, content, mimeType, hostname } = options;
  const cleanHost = sanitizeFilename(hostname, 'design-system');
  const safeFilename = `${cleanHost}-${filename}`;

  try {
    const blob = new Blob([content], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    if (typeof chrome !== 'undefined' && chrome.downloads && chrome.downloads.download) {
      await new Promise<number>((resolve, reject) => {
        chrome.downloads.download(
          {
            url: blobUrl,
            filename: safeFilename,
            saveAs: false,
          },
          (downloadId) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(downloadId);
            }
          }
        );
      });
      // Revoke after brief delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      return true;
    } else {
      // Fallback anchor trigger
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = safeFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      return true;
    }
  } catch (err) {
    console.error('Download error:', err);
    return false;
  }
}
