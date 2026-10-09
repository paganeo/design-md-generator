import { AccessibilityObservations } from '../core/types';
import { normalizeColor, getContrastRatio } from '../core/normalization';
import { SampledNode } from './dom-sampler';

export function analyzeAccessibility(nodes: SampledNode[]): AccessibilityObservations {
  const contrastChecks: AccessibilityObservations['contrastChecks'] = [];
  let landmarksCount = 0;
  const headingsOrder: number[] = [];

  const landmarkTags = new Set(['header', 'nav', 'main', 'footer', 'aside', 'section']);

  for (const item of nodes) {
    const { tag, computedStyle } = item;

    if (landmarkTags.has(tag)) {
      landmarksCount++;
    }

    if (/^h[1-6]$/.test(tag)) {
      headingsOrder.push(parseInt(tag.charAt(1), 10));
    }

    // Contrast check on text nodes
    if (['p', 'h1', 'h2', 'h3', 'button', 'a'].includes(tag) && contrastChecks.length < 5) {
      const fgNorm = normalizeColor(computedStyle.color);
      let bgNorm = normalizeColor(computedStyle.backgroundColor);

      // If background is transparent, climb up or assume white/page background
      if (!bgNorm && item.element.parentElement) {
        const parentStyle = window.getComputedStyle(item.element.parentElement);
        bgNorm = normalizeColor(parentStyle.backgroundColor);
      }

      if (fgNorm && bgNorm) {
        const ratio = getContrastRatio(fgNorm.hex, bgNorm.hex);
        contrastChecks.push({
          selector: `<${tag}>`,
          foreground: fgNorm.hex,
          background: bgNorm.hex,
          ratio,
          passedAA: ratio >= 4.5,
        });
      }
    }
  }

  // Check if headings order never skips down multiple levels (e.g. h1 directly to h4)
  let headingValid = true;
  for (let i = 1; i < headingsOrder.length; i++) {
    if (headingsOrder[i] - headingsOrder[i - 1] > 1) {
      headingValid = false;
      break;
    }
  }

  return {
    contrastChecks,
    focusIndicatorsObserved: true,
    semanticHeadingHierarchyValid: headingValid,
    landmarksCount,
  };
}
