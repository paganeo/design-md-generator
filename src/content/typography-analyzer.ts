import { TypographySystem, TypographyFamily, FontSizeItem, HeadingStyle } from '../core/types';
import { parsePixelValue } from '../core/normalization';
import { SampledNode } from './dom-sampler';

export function analyzeTypography(nodes: SampledNode[]): TypographySystem {
  const familyMap = new Map<string, { genericFallback: string; weights: Set<number>; sampleElements: Set<string>; count: number }>();
  const sizeMap = new Map<number, { tags: Set<string>; count: number }>();
  const weightSet = new Set<number>();
  const lineHeightsSet = new Set<string>();
  const letterSpacingSet = new Set<string>();
  const headingMap = new Map<string, HeadingStyle>();

  let bodyStyle = {
    fontSize: '16px',
    lineHeight: '1.5',
    fontWeight: '400',
    fontFamily: 'system-ui, sans-serif',
  };

  let codeStyle: { fontSize: string; fontFamily: string } | undefined;

  for (const item of nodes) {
    const { computedStyle, tag } = item;

    // Font Family
    const rawFamily = computedStyle.fontFamily;
    if (rawFamily) {
      const primaryFam = rawFamily.split(',')[0].replace(/['"]/g, '').trim();
      const genericFallback = rawFamily.split(',').pop()?.replace(/['"]/g, '').trim() || 'sans-serif';
      const weightNum = parseInt(computedStyle.fontWeight, 10) || 400;

      weightSet.add(weightNum);

      if (!familyMap.has(primaryFam)) {
        familyMap.set(primaryFam, {
          genericFallback,
          weights: new Set([weightNum]),
          sampleElements: new Set([tag]),
          count: 1,
        });
      } else {
        const entry = familyMap.get(primaryFam)!;
        entry.weights.add(weightNum);
        entry.sampleElements.add(tag);
        entry.count++;
      }
    }

    // Font Size
    const pxSize = parsePixelValue(computedStyle.fontSize);
    if (pxSize > 0) {
      if (!sizeMap.has(pxSize)) {
        sizeMap.set(pxSize, { tags: new Set([tag]), count: 1 });
      } else {
        const entry = sizeMap.get(pxSize)!;
        entry.tags.add(tag);
        entry.count++;
      }
    }

    // Line Height
    if (computedStyle.lineHeight && computedStyle.lineHeight !== 'normal') {
      lineHeightsSet.add(computedStyle.lineHeight);
    }

    // Letter Spacing
    if (computedStyle.letterSpacing && computedStyle.letterSpacing !== 'normal' && computedStyle.letterSpacing !== '0px') {
      letterSpacingSet.add(computedStyle.letterSpacing);
    }

    // Heading hierarchy
    if (/^h[1-6]$/.test(tag) && !headingMap.has(tag)) {
      headingMap.set(tag, {
        level: tag as HeadingStyle['level'],
        fontSize: computedStyle.fontSize,
        fontWeight: computedStyle.fontWeight,
        lineHeight: computedStyle.lineHeight,
        letterSpacing: computedStyle.letterSpacing,
        fontFamily: computedStyle.fontFamily.split(',')[0].replace(/['"]/g, '').trim(),
      });
    }

    // Body default
    if (tag === 'body' || (tag === 'p' && bodyStyle.fontSize === '16px')) {
      bodyStyle = {
        fontSize: computedStyle.fontSize,
        lineHeight: computedStyle.lineHeight,
        fontWeight: computedStyle.fontWeight,
        fontFamily: computedStyle.fontFamily.split(',')[0].replace(/['"]/g, '').trim(),
      };
    }

    // Code
    if ((tag === 'code' || tag === 'pre') && !codeStyle) {
      codeStyle = {
        fontSize: computedStyle.fontSize,
        fontFamily: computedStyle.fontFamily,
      };
    }
  }

  // Format families
  const fontFamilies: TypographyFamily[] = Array.from(familyMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4)
    .map(([family, data]) => {
      const isSystem = /system-ui|apple-system|segoe ui|roboto|helvetica|arial/i.test(family);
      return {
        family,
        genericFallback: data.genericFallback || 'sans-serif',
        weights: Array.from(data.weights).sort((a, b) => a - b),
        isCustomLoaded: !isSystem,
        sampleElements: Array.from(data.sampleElements).slice(0, 5),
      };
    });

  // Format font sizes
  const fontSizes: FontSizeItem[] = Array.from(sizeMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([px, data]) => {
      const rem = `${(px / 16).toFixed(3).replace(/\.?0+$/, '')}rem`;
      let usage = 'body';
      if (px >= 32) usage = 'display / hero';
      else if (px >= 24) usage = 'heading h1/h2';
      else if (px >= 20) usage = 'heading h3';
      else if (px >= 18) usage = 'subheading / lead';
      else if (px <= 12) usage = 'caption / legal';
      else if (data.tags.has('button')) usage = 'button label';

      return {
        px,
        rem,
        usage,
        count: data.count,
      };
    });

  const headings = Array.from(headingMap.values()).sort((a, b) => a.level.localeCompare(b.level));

  return {
    fontFamilies: fontFamilies.length > 0 ? fontFamilies : [{
      family: 'Inter, system-ui, sans-serif',
      genericFallback: 'sans-serif',
      weights: [400, 500, 600, 700],
      isCustomLoaded: false,
      sampleElements: ['body'],
    }],
    fontSizes: fontSizes.length > 0 ? fontSizes : [
      { px: 12, rem: '0.75rem', usage: 'caption', count: 1 },
      { px: 14, rem: '0.875rem', usage: 'body small', count: 1 },
      { px: 16, rem: '1rem', usage: 'body default', count: 1 },
      { px: 20, rem: '1.25rem', usage: 'heading h3', count: 1 },
      { px: 24, rem: '1.5rem', usage: 'heading h2', count: 1 },
      { px: 32, rem: '2rem', usage: 'heading h1', count: 1 },
    ],
    fontWeights: Array.from(weightSet).sort((a, b) => a - b),
    lineHeights: Array.from(lineHeightsSet).slice(0, 6),
    letterSpacing: Array.from(letterSpacingSet).slice(0, 6),
    headings,
    body: bodyStyle,
    code: codeStyle,
    confidence: fontFamilies.length > 0 ? 'high' : 'medium',
  };
}
