import { SpacingSystem, ShapesAndSurfaces, ShadowToken } from '../core/types';
import { parsePixelValue, inferSpacingScale } from '../core/normalization';
import { SampledNode } from './dom-sampler';

export function analyzeLayoutAndShapes(nodes: SampledNode[]): {
  spacing: SpacingSystem;
  shapes: ShapesAndSurfaces;
} {
  const paddings: number[] = [];
  const margins: number[] = [];
  const gaps: number[] = [];
  const containerMaxWidthsSet = new Set<number>();
  let flexCount = 0;
  let gridCount = 0;

  const radiiMap = new Map<number, { count: number; role: string }>();
  const borderWidthsSet = new Set<number>();
  const borderStylesSet = new Set<string>();
  const shadowMap = new Map<string, { count: number; elevation: ShadowToken['elevation'] }>();
  const backdropFilterSet = new Set<string>();

  for (const item of nodes) {
    const { computedStyle, tag, rect } = item;

    // Display mode
    if (computedStyle.display === 'flex' || computedStyle.display === 'inline-flex') flexCount++;
    if (computedStyle.display === 'grid' || computedStyle.display === 'inline-grid') gridCount++;

    // Container widths
    const maxW = parsePixelValue(computedStyle.maxWidth);
    if (maxW >= 400 && maxW <= 2560) {
      containerMaxWidthsSet.add(maxW);
    } else if (rect.width >= 600 && (tag === 'main' || tag === 'header' || tag === 'section' || tag === 'div')) {
      const parentWidth = item.element.parentElement?.getBoundingClientRect().width || 0;
      if (parentWidth > rect.width && Math.round(rect.width) % 10 === 0) {
        containerMaxWidthsSet.add(Math.round(rect.width));
      }
    }

    // Paddings (top, right, bottom, left)
    const pt = parsePixelValue(computedStyle.paddingTop);
    const pr = parsePixelValue(computedStyle.paddingRight);
    const pb = parsePixelValue(computedStyle.paddingBottom);
    const pl = parsePixelValue(computedStyle.paddingLeft);
    if (pt > 0) paddings.push(pt);
    if (pr > 0) paddings.push(pr);
    if (pb > 0) paddings.push(pb);
    if (pl > 0) paddings.push(pl);

    // Margins
    const mt = parsePixelValue(computedStyle.marginTop);
    const mb = parsePixelValue(computedStyle.marginBottom);
    if (mt > 0) margins.push(mt);
    if (mb > 0) margins.push(mb);

    // Gaps
    const gap = parsePixelValue(computedStyle.gap || computedStyle.rowGap);
    if (gap > 0) gaps.push(gap);

    // Border Radius
    const radius = parsePixelValue(computedStyle.borderRadius);
    if (radius > 0) {
      const role = tag === 'button' ? 'button' : tag === 'input' ? 'input' : radius >= 16 ? 'card / container' : 'general element';
      if (!radiiMap.has(radius)) {
        radiiMap.set(radius, { count: 1, role });
      } else {
        const entry = radiiMap.get(radius)!;
        entry.count++;
      }
    }

    // Borders
    const bw = parsePixelValue(computedStyle.borderWidth);
    if (bw > 0) borderWidthsSet.add(bw);
    if (computedStyle.borderStyle && computedStyle.borderStyle !== 'none') {
      borderStylesSet.add(computedStyle.borderStyle);
    }

    // Box shadows
    const shadow = computedStyle.boxShadow;
    if (shadow && shadow !== 'none') {
      let elevation: ShadowToken['elevation'] = 'md';
      if (shadow.includes('rgba(0, 0, 0, 0.05)') || shadow.includes('rgba(0, 0, 0, 0.1)')) elevation = 'sm';
      else if (shadow.includes('25px') || shadow.includes('50px')) elevation = 'xl';
      else if (shadow.includes('15px') || shadow.includes('20px')) elevation = 'lg';

      if (!shadowMap.has(shadow)) {
        shadowMap.set(shadow, { count: 1, elevation });
      } else {
        shadowMap.get(shadow)!.count++;
      }
    }

    // Backdrop filter
    if (computedStyle.backdropFilter && computedStyle.backdropFilter !== 'none') {
      backdropFilterSet.add(computedStyle.backdropFilter);
    }
  }

  // Deduplicate and infer spacing scale
  const { scale: inferredScale, baseUnit } = inferSpacingScale([...paddings, ...margins, ...gaps]);

  const uniqueSorted = (arr: number[]) => Array.from(new Set(arr)).sort((a, b) => a - b);

  const radii = Array.from(radiiMap.entries())
    .map(([px, data]) => ({ px, count: data.count, role: data.role }))
    .sort((a, b) => b.count - a.count);

  const shadows: ShadowToken[] = Array.from(shadowMap.entries())
    .map(([css, data]) => ({ css, elevation: data.elevation, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    spacing: {
      inferredScale,
      baseUnit,
      measuredPaddings: uniqueSorted(paddings).slice(0, 10),
      measuredMargins: uniqueSorted(margins).slice(0, 10),
      measuredGaps: uniqueSorted(gaps).slice(0, 8),
      containerMaxWidths: uniqueSorted(Array.from(containerMaxWidthsSet)).slice(0, 5),
      flexPatternsCount: flexCount,
      gridPatternsCount: gridCount,
    },
    shapes: {
      radii: radii.length > 0 ? radii : [
        { px: 4, count: 1, role: 'badge / small' },
        { px: 8, count: 1, role: 'button / input' },
        { px: 12, count: 1, role: 'card / panel' },
      ],
      borderWidths: uniqueSorted(Array.from(borderWidthsSet)),
      borderStyles: Array.from(borderStylesSet),
      shadows,
      backdropFilters: Array.from(backdropFilterSet),
      surfaceElevationsCount: shadows.length,
    },
  };
}
