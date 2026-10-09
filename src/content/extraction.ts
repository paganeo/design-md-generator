import { DesignSystemExtraction, ExtractionMetadata } from '../core/types';
import { sampleRepresentativeElements } from './dom-sampler';
import { inspectStylesheets } from './stylesheet-reader';
import { analyzeColors } from './color-analyzer';
import { analyzeTypography } from './typography-analyzer';
import { analyzeLayoutAndShapes } from './layout-analyzer';
import { analyzeComponents } from './component-analyzer';
import { analyzeMotion } from './motion-analyzer';
import { analyzeAccessibility } from './accessibility';

export function runDesignSystemExtraction(): DesignSystemExtraction {
  const startTime = performance.now();
  const currentUrl = new URL(window.location.href);

  // Clean URL without query parameters or hash to respect privacy
  const sanitizedUrl = `${currentUrl.origin}${currentUrl.pathname}`;
  const hostname = currentUrl.hostname || 'localhost';
  const pageTitle = document.title || hostname;

  // 1. Sample DOM
  const sampledNodes = sampleRepresentativeElements(350);

  // 2. Read Stylesheets
  const stylesheetAnalysis = inspectStylesheets();

  // 3. Analyzers
  const colors = analyzeColors(sampledNodes, stylesheetAnalysis.cssVariables);
  const typography = analyzeTypography(sampledNodes);
  const { spacing, shapes } = analyzeLayoutAndShapes(sampledNodes);
  const components = analyzeComponents(sampledNodes);
  const motion = analyzeMotion(sampledNodes);
  const accessibility = analyzeAccessibility(sampledNodes);

  const durationMs = Math.round(performance.now() - startTime);

  // Limitations identification
  const limitations: string[] = [];
  if (stylesheetAnalysis.inaccessibleCount > 0) {
    limitations.push(
      `${stylesheetAnalysis.inaccessibleCount} cross-origin stylesheets could not be inspected directly via CSSOM (security policy). Analyzed computed rendered styles instead.`
    );
  }
  if (stylesheetAnalysis.breakpoints.length === 0) {
    limitations.push(
      'No explicit CSS media query breakpoints could be parsed from accessible stylesheet rules; current viewport values recorded.'
    );
  }
  if (sampledNodes.length < 50) {
    limitations.push(
      'Page contains minimal DOM structure; token extraction based on available rendered nodes.'
    );
  }

  const metadata: ExtractionMetadata = {
    url: sanitizedUrl,
    hostname,
    title: pageTitle,
    extractedAt: new Date().toISOString(),
    durationMs,
    sampledElementsCount: sampledNodes.length,
    stylesheetsInspected: stylesheetAnalysis.accessibleCount,
    cssVariablesFound: Object.keys(stylesheetAnalysis.cssVariables).length,
    generatorVersion: '1.0.0',
  };

  return {
    schemaVersion: '1.0.0',
    metadata,
    colors,
    typography,
    spacing,
    shapes,
    components,
    motion,
    responsive: {
      breakpoints: stylesheetAnalysis.breakpoints,
      mediaQueries: stylesheetAnalysis.mediaQueries,
      isPartial: stylesheetAnalysis.breakpoints.length === 0,
      notes: stylesheetAnalysis.breakpoints.length > 0
        ? `Observed breakpoints: ${stylesheetAnalysis.breakpoints.join(', ')}px.`
        : 'Breakpoints inferred from single viewport runtime state.',
    },
    accessibility,
    limitations,
  };
}
