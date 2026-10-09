export interface StylesheetAnalysis {
  cssVariables: Record<string, string>;
  mediaQueries: string[];
  breakpoints: number[];
  accessibleCount: number;
  inaccessibleCount: number;
  totalRules: number;
}

export function inspectStylesheets(): StylesheetAnalysis {
  const cssVariables: Record<string, string> = {};
  const mediaQueriesSet = new Set<string>();
  const breakpointsSet = new Set<number>();
  let accessibleCount = 0;
  let inaccessibleCount = 0;
  let totalRules = 0;

  // 1. Inspect computed root styles for declared CSS Custom Properties
  try {
    const rootStyles = window.getComputedStyle(document.documentElement);
    // Modern Chrome exposes custom property keys on computed style in many contexts
    for (let i = 0; i < rootStyles.length; i++) {
      const propName = rootStyles[i];
      if (propName.startsWith('--')) {
        const val = rootStyles.getPropertyValue(propName).trim();
        if (val) cssVariables[propName] = val;
      }
    }
  } catch {
    // Non-fatal
  }

  // 2. Iterate through document.styleSheets
  const styleSheets = Array.from(document.styleSheets);

  for (const sheet of styleSheets) {
    try {
      const rules = sheet.cssRules || sheet.rules;
      if (!rules) continue;
      accessibleCount++;
      totalRules += rules.length;

      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];

        // Read CSS variables declared inside rules (like :root or html)
        if (rule instanceof CSSStyleRule) {
          const style = rule.style;
          for (let j = 0; j < style.length; j++) {
            const prop = style[j];
            if (prop.startsWith('--')) {
              const val = style.getPropertyValue(prop).trim();
              if (val) cssVariables[prop] = val;
            }
          }
        }

        // Read Media queries
        if (rule instanceof CSSMediaRule) {
          const mediaText = rule.media.mediaText;
          if (mediaText) {
            mediaQueriesSet.add(mediaText);
            const pxMatches = mediaText.match(/(?:min|max)-width:\s*(\d+)px/g);
            if (pxMatches) {
              for (const match of pxMatches) {
                const num = parseInt(match.replace(/[^0-9]/g, ''), 10);
                if (num >= 300 && num <= 2560) {
                  breakpointsSet.add(num);
                }
              }
            }
          }
        }
      }
    } catch {
      // Inaccessible due to CORS or security sandbox
      inaccessibleCount++;
    }
  }

  const sortedBreakpoints = Array.from(breakpointsSet).sort((a, b) => a - b);

  return {
    cssVariables,
    mediaQueries: Array.from(mediaQueriesSet).slice(0, 20),
    breakpoints: sortedBreakpoints,
    accessibleCount,
    inaccessibleCount,
    totalRules,
  };
}
