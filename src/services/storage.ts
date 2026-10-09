import { AppSettings, DesignSystemExtraction } from '../core/types';

const STORAGE_KEYS = {
  SETTINGS: 'design_lens_settings',
  LAST_EXTRACTION: 'design_lens_last_result',
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'obsidian',
  samplingLimit: 350,
  exportFormatVersion: '1.0.0',
};

export async function loadSettings(): Promise<AppSettings> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const data = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
      return { ...DEFAULT_SETTINGS, ...(data[STORAGE_KEYS.SETTINGS] || {}) };
    } else {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    }
  } catch (err) {
    console.warn('Failed to load settings from storage:', err);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings });
    } else {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
  } catch (err) {
    console.warn('Failed to save settings to storage:', err);
  }
}

export async function loadLastExtraction(): Promise<DesignSystemExtraction | null> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const data = await chrome.storage.local.get(STORAGE_KEYS.LAST_EXTRACTION);
      return data[STORAGE_KEYS.LAST_EXTRACTION] || null;
    } else {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_EXTRACTION);
      return saved ? JSON.parse(saved) : null;
    }
  } catch (err) {
    console.warn('Failed to load last extraction:', err);
    return null;
  }
}

export async function saveLastExtraction(extraction: DesignSystemExtraction): Promise<void> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [STORAGE_KEYS.LAST_EXTRACTION]: extraction });
    } else {
      localStorage.setItem(STORAGE_KEYS.LAST_EXTRACTION, JSON.stringify(extraction));
    }
  } catch (err) {
    console.warn('Failed to save last extraction:', err);
  }
}

export async function clearStoredData(): Promise<void> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.remove([STORAGE_KEYS.LAST_EXTRACTION]);
    } else {
      localStorage.removeItem(STORAGE_KEYS.LAST_EXTRACTION);
    }
  } catch (err) {
    console.warn('Failed to clear stored data:', err);
  }
}
