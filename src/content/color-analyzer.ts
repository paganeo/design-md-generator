import { ColorSystem, ColorToken, GradientToken } from '../core/types';
import { normalizeColor, getLuminance } from '../core/normalization';
import { SampledNode } from './dom-sampler';

interface ColorOccurrence {
  raw: string;
  hex: string;
  rgba: string;
  count: number;
  tags: Set<string>;
  roles: Set<string>;
  variableName?: string;
}

export function analyzeColors(
  nodes: SampledNode[],
  cssVariables: Record<string, string>
): ColorSystem {
  const colorMap = new Map<string, ColorOccurrence>();
  const gradients: GradientToken[] = [];
  const gradientSet = new Set<string>();

  // Helper to register color
  const registerColor = (raw: string, tag: string, role: string, varName?: string) => {
    const norm = normalizeColor(raw);
    if (!norm) return;

    const existing = colorMap.get(norm.hex);
    if (existing) {
      existing.count++;
      existing.tags.add(tag);
      existing.roles.add(role);
      if (varName && !existing.variableName) existing.variableName = varName;
    } else {
      colorMap.set(norm.hex, {
        raw,
        hex: norm.hex,
        rgba: norm.rgba,
        count: 1,
        tags: new Set([tag]),
        roles: new Set([role]),
        variableName: varName,
      });
    }
  };

  // 1. Process CSS variables that contain colors
  for (const [varName, varValue] of Object.entries(cssVariables)) {
    const norm = normalizeColor(varValue);
    if (norm) {
      let inferredRole = 'neutral';
      const lowerVar = varName.toLowerCase();
      if (lowerVar.includes('primary') || lowerVar.includes('brand')) inferredRole = 'brand';
      else if (lowerVar.includes('accent')) inferredRole = 'accent';
      else if (lowerVar.includes('bg') || lowerVar.includes('background')) inferredRole = 'background';
      else if (lowerVar.includes('text') || lowerVar.includes('foreground')) inferredRole = 'text';
      else if (lowerVar.includes('border')) inferredRole = 'border';

      registerColor(varValue, ':root', inferredRole, varName);
    }
  }

  // 2. Process sampled DOM nodes
  for (const item of nodes) {
    const { computedStyle, tag } = item;

    // Background color
    if (computedStyle.backgroundColor) {
      const isCardOrContainer = ['div', 'section', 'article', 'nav', 'header', 'aside'].includes(tag);
      const isButton = tag === 'button' || tag === 'a';
      const role = isButton ? 'button-bg' : isCardOrContainer ? 'surface' : 'background';
      registerColor(computedStyle.backgroundColor, tag, role);
    }

    // Text color
    if (computedStyle.color) {
      const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag);
      const isLink = tag === 'a';
      const role = isLink ? 'link' : isHeading ? 'text-primary' : 'text';
      registerColor(computedStyle.color, tag, role);
    }

    // Border color
    if (computedStyle.borderColor && computedStyle.borderWidth !== '0px') {
      registerColor(computedStyle.borderColor, tag, 'border');
    }

    // Gradients from background image
    const bgImage = computedStyle.backgroundImage;
    if (bgImage && bgImage.includes('gradient') && !gradientSet.has(bgImage)) {
      gradientSet.add(bgImage);
      const type = bgImage.includes('linear-gradient')
        ? 'linear'
        : bgImage.includes('radial-gradient')
        ? 'radial'
        : 'conic';
      gradients.push({
        css: bgImage.slice(0, 150),
        type,
        stops: [],
        count: 1,
      });
    }
  }

  // 3. Classify and group into semantic categories
  const brand: ColorToken[] = [];
  const secondary: ColorToken[] = [];
  const accent: ColorToken[] = [];
  const backgrounds: ColorToken[] = [];
  const surfaces: ColorToken[] = [];
  const textPrimary: ColorToken[] = [];
  const textMuted: ColorToken[] = [];
  const borders: ColorToken[] = [];
  const links: ColorToken[] = [];
  const buttons: ColorToken[] = [];

  const sortedOccurrences = Array.from(colorMap.values()).sort((a, b) => b.count - a.count);

  for (const item of sortedOccurrences) {
    const lum = getLuminance(item.hex);
    const hasVar = Boolean(item.variableName);
    const confidence = hasVar ? 'high' : item.count >= 3 ? 'medium' : 'low';

    const token: ColorToken = {
      raw: item.raw,
      hex: item.hex,
      rgba: item.rgba,
      role: 'neutral',
      count: item.count,
      source: hasVar ? 'css-variable' : 'computed-style',
      confidence,
      variableName: item.variableName,
    };

    // Semantic sorting logic
    if (item.roles.has('brand') || (item.roles.has('button-bg') && lum > 0.05 && lum < 0.85)) {
      token.role = 'primary-brand';
      if (brand.length < 3) brand.push(token);
    }

    if (item.roles.has('accent') && !brand.some(b => b.hex === item.hex)) {
      token.role = 'accent';
      if (accent.length < 3) accent.push(token);
    }

    if (item.roles.has('button-bg')) {
      token.role = 'button-bg';
      if (buttons.length < 4) buttons.push(token);
    }

    if (item.roles.has('link') && !brand.some(b => b.hex === item.hex)) {
      token.role = 'link';
      if (links.length < 3) links.push(token);
    }

    if (item.roles.has('border')) {
      token.role = 'border';
      if (borders.length < 4) borders.push(token);
    }

    // Background vs Surface separation based on luminance and tags
    if (item.roles.has('background') || item.roles.has('surface')) {
      if (item.tags.has('body') || item.tags.has('html') || backgrounds.length === 0) {
        token.role = 'background';
        if (backgrounds.length < 3) backgrounds.push(token);
      } else {
        token.role = 'surface';
        if (surfaces.length < 4) surfaces.push(token);
      }
    }

    // Text categorization based on luminance
    if (item.roles.has('text') || item.roles.has('text-primary')) {
      if (lum < 0.2 || lum > 0.8) {
        token.role = 'text-primary';
        if (textPrimary.length < 3) textPrimary.push(token);
      } else {
        token.role = 'text-muted';
        if (textMuted.length < 3) textMuted.push(token);
      }
    }
  }

  // Fallbacks to guarantee meaningful non-empty baseline
  if (brand.length === 0 && buttons.length > 0) {
    brand.push({ ...buttons[0], role: 'primary-brand' });
  }

  // Detect feedback colors if present
  let successToken: ColorToken | undefined;
  let warningToken: ColorToken | undefined;
  let errorToken: ColorToken | undefined;

  for (const item of sortedOccurrences) {
    const hex = item.hex.toLowerCase();
    // Emerald / Greenish
    if (!successToken && (hex.includes('10b981') || hex.includes('22c55e') || hex.includes('16a34a') || (item.variableName && item.variableName.includes('success')))) {
      successToken = {
        raw: item.raw,
        hex: item.hex,
        rgba: item.rgba,
        role: 'success',
        count: item.count,
        source: item.variableName ? 'css-variable' : 'computed-style',
        confidence: item.variableName ? 'high' : 'medium',
      };
    }
    // Reddish / Error
    if (!errorToken && (hex.includes('ef4444') || hex.includes('dc2626') || hex.includes('e11d48') || (item.variableName && item.variableName.includes('error') || item.variableName?.includes('danger')))) {
      errorToken = {
        raw: item.raw,
        hex: item.hex,
        rgba: item.rgba,
        role: 'error',
        count: item.count,
        source: item.variableName ? 'css-variable' : 'computed-style',
        confidence: item.variableName ? 'high' : 'medium',
      };
    }
  }

  return {
    brand,
    secondary,
    accent,
    backgrounds,
    surfaces,
    textPrimary,
    textMuted,
    borders,
    links,
    buttons,
    states: {
      success: successToken,
      warning: warningToken,
      error: errorToken,
    },
    gradients,
    rawUniqueCount: colorMap.size,
  };
}
