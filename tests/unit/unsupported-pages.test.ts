import { describe, it, expect } from 'vitest';

function isPageSupported(url: string): { isSupported: boolean; reason?: string } {
  if (!url) return { isSupported: false, reason: 'No URL provided' };
  if (url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('about:') || url.startsWith('chrome-extension://')) {
    return { isSupported: false, reason: 'Browser internal pages cannot be inspected.' };
  }
  if (url.includes('chromewebstore.google.com') || url.includes('chrome.google.com/webstore')) {
    return { isSupported: false, reason: 'Chrome Web Store pages restrict script execution.' };
  }
  return { isSupported: true };
}

describe('Unsupported Browser Page Detection', () => {
  it('identifies internal browser pages as unsupported', () => {
    expect(isPageSupported('chrome://extensions').isSupported).toBe(false);
    expect(isPageSupported('chrome://settings').isSupported).toBe(false);
    expect(isPageSupported('edge://flags').isSupported).toBe(false);
    expect(isPageSupported('about:blank').isSupported).toBe(false);
  });

  it('identifies Chrome Web Store pages as unsupported', () => {
    expect(isPageSupported('https://chromewebstore.google.com/detail/xyz').isSupported).toBe(false);
    expect(isPageSupported('https://chrome.google.com/webstore/category/extensions').isSupported).toBe(false);
  });

  it('allows standard web applications and websites', () => {
    expect(isPageSupported('https://github.com/facebook/react').isSupported).toBe(true);
    expect(isPageSupported('https://linear.app').isSupported).toBe(true);
    expect(isPageSupported('http://localhost:3000').isSupported).toBe(true);
  });
});
