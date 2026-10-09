export interface SampledNode {
  element: HTMLElement;
  tag: string;
  role?: string;
  computedStyle: CSSStyleDeclaration;
  rect: DOMRect;
  textSnippet?: string;
}

export function sampleRepresentativeElements(maxElements = 350): SampledNode[] {
  const ignoredTags = new Set([
    'script', 'style', 'noscript', 'meta', 'link', 'svg', 'path', 'g',
    'circle', 'rect', 'iframe', 'template', 'br', 'hr', 'source', 'track'
  ]);

  const candidates: SampledNode[] = [];
  const allElements = Array.from(document.querySelectorAll('*'));

  // Prioritize high-value semantic selectors
  const highPriorityTags = new Set([
    'button', 'a', 'input', 'select', 'textarea', 'form',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label',
    'header', 'nav', 'main', 'footer', 'aside', 'section', 'article',
    'table', 'thead', 'tbody', 'tr', 'td', 'th', 'ul', 'ol', 'li'
  ]);

  // Sort elements giving priority to semantic controls and headers
  const sorted = allElements.sort((a, b) => {
    const aTag = a.tagName.toLowerCase();
    const bTag = b.tagName.toLowerCase();
    const aPriority = highPriorityTags.has(aTag) ? 1 : 0;
    const bPriority = highPriorityTags.has(bTag) ? 1 : 0;
    return bPriority - aPriority;
  });

  for (const el of sorted) {
    if (candidates.length >= maxElements) break;

    const tag = el.tagName.toLowerCase();
    if (ignoredTags.has(tag)) continue;

    // Check visibility without heavy performance penalty
    const htmlEl = el as HTMLElement;
    const style = window.getComputedStyle(htmlEl);

    if (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      parseFloat(style.opacity || '1') === 0
    ) {
      continue;
    }

    const rect = htmlEl.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;

    // Filter out 1x1 tracking pixels
    if (rect.width <= 2 && rect.height <= 2) continue;

    candidates.push({
      element: htmlEl,
      tag,
      role: htmlEl.getAttribute('role') || undefined,
      computedStyle: style,
      rect,
      textSnippet: (htmlEl.innerText || '').slice(0, 40).trim() || undefined,
    });
  }

  return candidates;
}
