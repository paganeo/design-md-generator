import { ComponentPattern } from '../core/types';
import { SampledNode } from './dom-sampler';

export function analyzeComponents(nodes: SampledNode[]): ComponentPattern[] {
  const components: ComponentPattern[] = [];
  const registeredCategories = new Set<string>();

  for (const item of nodes) {
    const { element, tag, computedStyle, rect } = item;
    const classAttr = element.getAttribute('class') || '';

    // 1. Buttons
    if (tag === 'button' || (tag === 'a' && (classAttr.includes('btn') || classAttr.includes('button')))) {
      const isPrimary = !classAttr.includes('secondary') && !classAttr.includes('outline') && !classAttr.includes('ghost');
      const compId = isPrimary ? 'button-primary' : 'button-secondary';

      if (!registeredCategories.has(compId)) {
        registeredCategories.add(compId);
        components.push({
          id: compId,
          name: isPrimary ? 'Primary Button' : 'Secondary Button',
          category: 'button',
          tag,
          classSnippet: classAttr.slice(0, 60),
          styles: {
            backgroundColor: computedStyle.backgroundColor,
            color: computedStyle.color,
            borderRadius: computedStyle.borderRadius,
            padding: `${computedStyle.paddingTop} ${computedStyle.paddingRight} ${computedStyle.paddingBottom} ${computedStyle.paddingLeft}`,
            border: computedStyle.borderWidth !== '0px' ? `${computedStyle.borderWidth} ${computedStyle.borderStyle} ${computedStyle.borderColor}` : 'none',
            boxShadow: computedStyle.boxShadow !== 'none' ? computedStyle.boxShadow : undefined,
            fontSize: computedStyle.fontSize,
            fontWeight: computedStyle.fontWeight,
          },
          confidence: 'high',
          instancesCount: 1,
        });
      }
    }

    // 2. Form Inputs
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      const compId = `input-${tag}`;
      if (!registeredCategories.has(compId)) {
        registeredCategories.add(compId);
        components.push({
          id: compId,
          name: `${tag.charAt(0).toUpperCase() + tag.slice(1)} Control`,
          category: 'input',
          tag,
          styles: {
            backgroundColor: computedStyle.backgroundColor,
            color: computedStyle.color,
            borderRadius: computedStyle.borderRadius,
            padding: `${computedStyle.paddingTop} ${computedStyle.paddingRight}`,
            border: `${computedStyle.borderWidth} ${computedStyle.borderStyle} ${computedStyle.borderColor}`,
            fontSize: computedStyle.fontSize,
          },
          confidence: 'high',
          instancesCount: 1,
        });
      }
    }

    // 3. Navigation Bar
    if (tag === 'nav' || tag === 'header') {
      if (!registeredCategories.has('navigation')) {
        registeredCategories.add('navigation');
        components.push({
          id: 'navigation-bar',
          name: 'Navigation Bar / Header',
          category: 'navigation',
          tag,
          styles: {
            backgroundColor: computedStyle.backgroundColor,
            border: computedStyle.borderBottomWidth !== '0px' ? `${computedStyle.borderBottomWidth} ${computedStyle.borderBottomStyle} ${computedStyle.borderBottomColor}` : undefined,
            boxShadow: computedStyle.boxShadow !== 'none' ? computedStyle.boxShadow : undefined,
            display: computedStyle.display,
            gap: computedStyle.gap,
          },
          confidence: 'high',
          instancesCount: 1,
        });
      }
    }

    // 4. Cards
    if (
      (tag === 'div' || tag === 'article' || tag === 'section') &&
      (classAttr.includes('card') || (computedStyle.borderRadius !== '0px' && computedStyle.boxShadow !== 'none' && rect.width > 200 && rect.height > 100))
    ) {
      if (!registeredCategories.has('card')) {
        registeredCategories.add('card');
        components.push({
          id: 'card-surface',
          name: 'Surface Card',
          category: 'card',
          tag,
          styles: {
            backgroundColor: computedStyle.backgroundColor,
            borderRadius: computedStyle.borderRadius,
            boxShadow: computedStyle.boxShadow,
            border: computedStyle.borderWidth !== '0px' ? `${computedStyle.borderWidth} ${computedStyle.borderStyle} ${computedStyle.borderColor}` : undefined,
            padding: `${computedStyle.paddingTop} ${computedStyle.paddingRight}`,
          },
          confidence: 'medium',
          instancesCount: 1,
        });
      }
    }

    // 5. Badges
    if (classAttr.includes('badge') || classAttr.includes('tag') || classAttr.includes('chip') || (rect.height <= 32 && rect.width <= 120 && computedStyle.borderRadius !== '0px' && (tag === 'span' || tag === 'div'))) {
      if (!registeredCategories.has('badge') && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        registeredCategories.add('badge');
        components.push({
          id: 'status-badge',
          name: 'Status Badge / Tag',
          category: 'badge',
          tag,
          styles: {
            backgroundColor: computedStyle.backgroundColor,
            color: computedStyle.color,
            borderRadius: computedStyle.borderRadius,
            fontSize: computedStyle.fontSize,
            padding: `${computedStyle.paddingTop} ${computedStyle.paddingRight}`,
          },
          confidence: 'medium',
          instancesCount: 1,
        });
      }
    }

    // 6. Tables
    if (tag === 'table') {
      if (!registeredCategories.has('table')) {
        registeredCategories.add('table');
        components.push({
          id: 'data-table',
          name: 'Data Table',
          category: 'table',
          tag,
          styles: {
            border: computedStyle.borderWidth !== '0px' ? `${computedStyle.borderWidth} ${computedStyle.borderStyle} ${computedStyle.borderColor}` : undefined,
            fontSize: computedStyle.fontSize,
          },
          confidence: 'high',
          instancesCount: 1,
        });
      }
    }
  }

  return components;
}
