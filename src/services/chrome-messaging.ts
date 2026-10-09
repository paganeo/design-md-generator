import { ActiveTabInfo, DesignSystemExtraction } from '../core/types';
import { runDesignSystemExtraction } from '../content/extraction';

export async function getActiveTabInfo(): Promise<ActiveTabInfo> {
  if (typeof chrome === 'undefined' || !chrome.tabs) {
    // Development or test environment mock
    return {
      url: 'https://example.com/demo',
      hostname: 'example.com',
      title: 'Example Design System Demo',
      favicon: undefined,
      isSupported: true,
    };
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id || !tab.url) {
      return {
        url: '',
        hostname: '',
        title: 'No active tab detected',
        isSupported: false,
        unsupportedReason: 'Cannot access active tab.',
      };
    }

    const urlObj = new URL(tab.url);
    const isChromeInternal = tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:') || tab.url.startsWith('chrome-extension://');
    const isChromeWebStore = tab.url.includes('chromewebstore.google.com') || tab.url.includes('chrome.google.com/webstore');

    if (isChromeInternal) {
      return {
        id: tab.id,
        url: tab.url,
        hostname: urlObj.hostname || 'Internal Browser Page',
        title: tab.title || 'Internal Page',
        isSupported: false,
        unsupportedReason: 'Browser internal pages (chrome://, edge://) cannot be inspected.',
      };
    }

    if (isChromeWebStore) {
      return {
        id: tab.id,
        url: tab.url,
        hostname: urlObj.hostname,
        title: tab.title || 'Chrome Web Store',
        isSupported: false,
        unsupportedReason: 'Chrome Web Store pages restrict script execution by browser security policy.',
      };
    }

    return {
      id: tab.id,
      url: tab.url,
      hostname: urlObj.hostname,
      title: tab.title || urlObj.hostname,
      favicon: tab.favIconUrl,
      isSupported: true,
    };
  } catch (err) {
    return {
      url: '',
      hostname: '',
      title: 'Error inspecting tab',
      isSupported: false,
      unsupportedReason: err instanceof Error ? err.message : 'Unknown error reading active tab.',
    };
  }
}

export async function triggerExtractionOnTab(tabId?: number): Promise<DesignSystemExtraction> {
  if (typeof chrome === 'undefined' || !chrome.scripting || !tabId) {
    // If running in development preview, run extraction on current DOM mock or demo
    return runDesignSystemExtraction();
  }

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: runDesignSystemExtraction,
    });

    if (!results || results.length === 0 || !results[0].result) {
      throw new Error('No extraction data returned from active tab.');
    }

    return results[0].result as DesignSystemExtraction;
  } catch (err) {
    console.error('Extraction script error:', err);
    throw new Error(err instanceof Error ? err.message : 'Script execution failed on active tab.');
  }
}
