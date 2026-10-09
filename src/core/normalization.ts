/**
 * Normalizes CSS color values (rgb, rgba, hex, named colors) to standard lowercase 6-digit hex and rgba.
 */
export function normalizeColor(input: string): { hex: string; rgba: string; alpha: number } | null {
  if (!input || input === 'transparent' || input === 'inherit' || input === 'initial' || input === 'currentcolor') {
    return null;
  }

  const trimmed = input.trim().toLowerCase();

  // Handle #hex
  if (trimmed.startsWith('#')) {
    let hexClean = trimmed.replace('#', '');
    if (hexClean.length === 3) {
      hexClean = hexClean.split('').map(c => c + c).join('');
    } else if (hexClean.length === 4) {
      hexClean = hexClean.slice(0, 3).split('').map(c => c + c).join('');
    } else if (hexClean.length === 8) {
      hexClean = hexClean.slice(0, 6);
    }
    if (/^[0-9a-f]{6}$/i.test(hexClean)) {
      const r = parseInt(hexClean.slice(0, 2), 16);
      const g = parseInt(hexClean.slice(2, 4), 16);
      const b = parseInt(hexClean.slice(4, 6), 16);
      return {
        hex: `#${hexClean}`,
        rgba: `rgba(${r}, ${g}, ${b}, 1)`,
        alpha: 1,
      };
    }
  }

  // Handle rgb / rgba
  const rgbaMatch = trimmed.match(/^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)$/i);
  if (rgbaMatch) {
    const r = Math.min(255, Math.max(0, Math.round(parseFloat(rgbaMatch[1]))));
    const g = Math.min(255, Math.max(0, Math.round(parseFloat(rgbaMatch[2]))));
    const b = Math.min(255, Math.max(0, Math.round(parseFloat(rgbaMatch[3]))));
    const a = rgbaMatch[4] !== undefined ? Math.min(1, Math.max(0, parseFloat(rgbaMatch[4]))) : 1;

    // Discard totally transparent colors
    if (a === 0) return null;

    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return {
      hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`,
      rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
      alpha: a,
    };
  }

  return null;
}

/**
 * Calculates relative luminance of an sRGB color per WCAG 2.1 specs.
 */
export function getLuminance(hex: string): number {
  const norm = normalizeColor(hex);
  if (!norm) return 0;

  const hexClean = norm.hex.replace('#', '');
  const r = parseInt(hexClean.slice(0, 2), 16) / 255;
  const g = parseInt(hexClean.slice(2, 4), 16) / 255;
  const b = parseInt(hexClean.slice(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculates contrast ratio between two colors per WCAG 2.1.
 */
export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const lum1 = getLuminance(foregroundHex);
  const lum2 = getLuminance(backgroundHex);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

/**
 * Normalizes pixel values string like "16px" to number 16.
 */
export function parsePixelValue(val: string): number {
  if (!val) return 0;
  const num = parseFloat(val);
  return isNaN(num) ? 0 : Math.round(num);
}

/**
 * Derives a clean spacing scale from raw observed pixel values (deduplicating and filtering noise).
 */
export function inferSpacingScale(rawValues: number[]): { scale: number[]; baseUnit: 4 | 8 } {
  const counts: Record<number, number> = {};
  for (const v of rawValues) {
    if (v > 0 && v <= 128) {
      counts[v] = (counts[v] || 0) + 1;
    }
  }

  const sortedValues = Object.keys(counts)
    .map(Number)
    .filter(v => counts[v] >= 1)
    .sort((a, b) => a - b);

  // Check whether multiples of 8 dominate
  const mult8 = sortedValues.filter(v => v % 8 === 0).length;
  const baseUnit: 4 | 8 = mult8 >= sortedValues.length * 0.45 ? 8 : 4;

  const scale = Array.from(new Set(sortedValues.filter(v => v % 2 === 0))).slice(0, 10);
  return { scale: scale.length > 0 ? scale : [4, 8, 12, 16, 24, 32, 48, 64], baseUnit };
}

/**
 * Safely sanitizes hostnames or titles into clean file basenames without directory traversal.
 */
export function sanitizeFilename(input: string, fallback = 'design-system'): string {
  if (!input) return fallback;
  const cleaned = input
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

  return cleaned || fallback;
}
