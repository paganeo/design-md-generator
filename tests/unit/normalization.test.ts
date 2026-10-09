import { describe, it, expect } from 'vitest';
import {
  normalizeColor,
  getLuminance,
  getContrastRatio,
  inferSpacingScale,
  sanitizeFilename,
} from '../../src/core/normalization';

describe('Normalization and Calculation Utilities', () => {
  describe('normalizeColor', () => {
    it('normalizes standard 6-digit hex colors', () => {
      const result = normalizeColor('#2563EB');
      expect(result).not.toBeNull();
      expect(result?.hex).toBe('#2563eb');
      expect(result?.alpha).toBe(1);
    });

    it('normalizes 3-digit shorthand hex colors', () => {
      const result = normalizeColor('#fff');
      expect(result).not.toBeNull();
      expect(result?.hex).toBe('#ffffff');
    });

    it('normalizes rgb and rgba string values', () => {
      const rgb = normalizeColor('rgb(37, 99, 235)');
      expect(rgb?.hex).toBe('#2563eb');
      expect(rgb?.rgba).toBe('rgba(37, 99, 235, 1)');

      const rgba = normalizeColor('rgba(255, 255, 255, 0.5)');
      expect(rgba?.hex).toBe('#ffffff');
      expect(rgba?.alpha).toBe(0.5);
    });

    it('discards transparent or zero alpha colors', () => {
      expect(normalizeColor('transparent')).toBeNull();
      expect(normalizeColor('rgba(0, 0, 0, 0)')).toBeNull();
      expect(normalizeColor('inherit')).toBeNull();
    });
  });

  describe('getLuminance and getContrastRatio', () => {
    it('calculates correct WCAG contrast between black and white', () => {
      const contrast = getContrastRatio('#000000', '#ffffff');
      expect(contrast).toBeCloseTo(21, 0);
    });

    it('correctly calculates contrast for electric blue and dark slate', () => {
      const lumBlue = getLuminance('#3b82f6');
      expect(lumBlue).toBeGreaterThan(0);
      expect(lumBlue).toBeLessThan(1);
    });
  });

  describe('inferSpacingScale', () => {
    it('infers an 8px base grid when multiples of 8 dominate', () => {
      const { scale, baseUnit } = inferSpacingScale([8, 16, 24, 32, 48, 64, 8, 16, 24]);
      expect(baseUnit).toBe(8);
      expect(scale).toContain(8);
      expect(scale).toContain(16);
      expect(scale).toContain(24);
    });

    it('infers a 4px base grid when 4px steps dominate', () => {
      const { baseUnit } = inferSpacingScale([4, 12, 20, 28, 36]);
      expect(baseUnit).toBe(4);
    });
  });

  describe('sanitizeFilename', () => {
    it('cleans protocols and unsafe path characters', () => {
      expect(sanitizeFilename('https://my-site.com/path?foo=bar')).toBe('my-site-com-path-foo-bar');
      expect(sanitizeFilename('app.github.com')).toBe('app-github-com');
      expect(sanitizeFilename('../../../etc/passwd')).toBe('etc-passwd');
      expect(sanitizeFilename('')).toBe('design-system');
    });
  });
});
