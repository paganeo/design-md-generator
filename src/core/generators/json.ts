import { DesignSystemExtraction } from '../types';
import { SCHEMA_VERSION, validateDesignSystemJson } from '../schema';

export function generateDesignSystemJson(data: DesignSystemExtraction): string {
  // Ensure structured top-level alignment per spec requirements
  const outputObject = {
    schemaVersion: SCHEMA_VERSION,
    metadata: data.metadata,
    colors: {
      brand: data.colors.brand,
      secondary: data.colors.secondary,
      accent: data.colors.accent,
      backgrounds: data.colors.backgrounds,
      surfaces: data.colors.surfaces,
      textPrimary: data.colors.textPrimary,
      textMuted: data.colors.textMuted,
      borders: data.colors.borders,
      links: data.colors.links,
      buttons: data.colors.buttons,
      states: data.colors.states,
      gradients: data.colors.gradients,
      uniqueColorCount: data.colors.rawUniqueCount,
    },
    typography: {
      fontFamilies: data.typography.fontFamilies,
      fontSizes: data.typography.fontSizes,
      fontWeights: data.typography.fontWeights,
      lineHeights: data.typography.lineHeights,
      letterSpacing: data.typography.letterSpacing,
      headings: data.typography.headings,
      body: data.typography.body,
      code: data.typography.code || null,
      confidence: data.typography.confidence,
    },
    spacing: {
      inferredScale: data.spacing.inferredScale,
      baseUnit: data.spacing.baseUnit,
      measuredPaddings: data.spacing.measuredPaddings,
      measuredMargins: data.spacing.measuredMargins,
      measuredGaps: data.spacing.measuredGaps,
    },
    layout: {
      containerMaxWidths: data.spacing.containerMaxWidths,
      flexPatternsCount: data.spacing.flexPatternsCount,
      gridPatternsCount: data.spacing.gridPatternsCount,
    },
    radii: data.shapes.radii,
    shadows: data.shapes.shadows,
    borders: {
      widths: data.shapes.borderWidths,
      styles: data.shapes.borderStyles,
    },
    motion: {
      transitions: data.motion.transitions,
      animations: data.motion.animations,
      durations: data.motion.durations,
      easings: data.motion.easings,
      reducedMotionSupported: data.motion.reducedMotionSupported,
    },
    components: data.components,
    responsive: {
      breakpoints: data.responsive.breakpoints,
      mediaQueries: data.responsive.mediaQueries,
      isPartial: data.responsive.isPartial,
      notes: data.responsive.notes,
    },
    accessibility: data.accessibility,
    limitations: data.limitations,
  };

  const validation = validateDesignSystemJson({
    ...outputObject,
    shapes: data.shapes,
  });

  if (!validation.isValid) {
    console.warn('JSON schema warnings:', validation.errors);
  }

  return JSON.stringify(outputObject, null, 2);
}
