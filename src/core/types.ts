export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface BaseTokenEvidence {
  source: 'css-variable' | 'computed-style' | 'inline-style' | 'inferred-pattern' | 'stylesheet-rule';
  count: number;
  confidence: ConfidenceLevel;
  notes?: string;
}

export interface ColorToken extends BaseTokenEvidence {
  raw: string;
  hex: string;
  rgba: string;
  role: 'primary-brand' | 'secondary' | 'accent' | 'background' | 'surface' | 'text-primary' | 'text-muted' | 'border' | 'link' | 'button-bg' | 'success' | 'warning' | 'error' | 'neutral';
  variableName?: string;
}

export interface GradientToken {
  css: string;
  type: 'linear' | 'radial' | 'conic';
  stops: string[];
  count: number;
}

export interface ColorSystem {
  brand: ColorToken[];
  secondary: ColorToken[];
  accent: ColorToken[];
  backgrounds: ColorToken[];
  surfaces: ColorToken[];
  textPrimary: ColorToken[];
  textMuted: ColorToken[];
  borders: ColorToken[];
  links: ColorToken[];
  buttons: ColorToken[];
  states: {
    success?: ColorToken;
    warning?: ColorToken;
    error?: ColorToken;
  };
  gradients: GradientToken[];
  rawUniqueCount: number;
}

export interface FontSizeItem {
  px: number;
  rem: string;
  usage: string;
  count: number;
}

export interface TypographyFamily {
  family: string;
  genericFallback: string;
  weights: number[];
  isCustomLoaded: boolean;
  sampleElements: string[];
}

export interface HeadingStyle {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing?: string;
  fontFamily: string;
}

export interface TypographySystem {
  fontFamilies: TypographyFamily[];
  fontSizes: FontSizeItem[];
  fontWeights: number[];
  lineHeights: string[];
  letterSpacing: string[];
  headings: HeadingStyle[];
  body: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
    fontFamily: string;
  };
  code?: {
    fontSize: string;
    fontFamily: string;
  };
  confidence: ConfidenceLevel;
}

export interface SpacingSystem {
  inferredScale: number[];
  baseUnit: 4 | 8;
  measuredPaddings: number[];
  measuredMargins: number[];
  measuredGaps: number[];
  containerMaxWidths: number[];
  flexPatternsCount: number;
  gridPatternsCount: number;
}

export interface ShadowToken {
  css: string;
  elevation: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  count: number;
}

export interface ShapesAndSurfaces {
  radii: Array<{ px: number; count: number; role: string }>;
  borderWidths: number[];
  borderStyles: string[];
  shadows: ShadowToken[];
  backdropFilters: string[];
  surfaceElevationsCount: number;
}

export interface ComponentPattern {
  id: string;
  name: string;
  category: 'button' | 'link' | 'card' | 'input' | 'navigation' | 'badge' | 'alert' | 'modal' | 'table' | 'hero' | 'footer' | 'container';
  tag: string;
  classSnippet?: string;
  styles: {
    backgroundColor?: string;
    color?: string;
    borderRadius?: string;
    padding?: string;
    border?: string;
    boxShadow?: string;
    fontSize?: string;
    fontWeight?: string;
    display?: string;
    gap?: string;
  };
  states?: {
    hover?: Record<string, string>;
    focus?: Record<string, string>;
    disabled?: Record<string, string>;
  };
  confidence: ConfidenceLevel;
  instancesCount: number;
}

export interface MotionPattern {
  transitions: string[];
  animations: string[];
  durations: string[];
  easings: string[];
  reducedMotionSupported: boolean;
  notes?: string;
}

export interface ResponsiveBreakpoints {
  breakpoints: number[];
  mediaQueries: string[];
  isPartial: boolean;
  notes: string;
}

export interface AccessibilityObservations {
  contrastChecks: Array<{
    selector: string;
    foreground: string;
    background: string;
    ratio: number;
    passedAA: boolean;
  }>;
  focusIndicatorsObserved: boolean;
  semanticHeadingHierarchyValid: boolean;
  landmarksCount: number;
}

export interface ExtractionMetadata {
  url: string;
  hostname: string;
  title: string;
  extractedAt: string;
  durationMs: number;
  sampledElementsCount: number;
  stylesheetsInspected: number;
  cssVariablesFound: number;
  pageTypeInferred?: string;
  generatorVersion: string;
}

export interface DesignSystemExtraction {
  schemaVersion: '1.0.0';
  metadata: ExtractionMetadata;
  colors: ColorSystem;
  typography: TypographySystem;
  spacing: SpacingSystem;
  shapes: ShapesAndSurfaces;
  components: ComponentPattern[];
  motion: MotionPattern;
  responsive: ResponsiveBreakpoints;
  accessibility: AccessibilityObservations;
  limitations: string[];
}

export type ExtractionStage =
  | 'idle'
  | 'reading_styles'
  | 'sampling_dom'
  | 'normalizing_tokens'
  | 'generating_files'
  | 'complete'
  | 'error';

export interface ActiveTabInfo {
  id?: number;
  url: string;
  hostname: string;
  title: string;
  favicon?: string;
  isSupported: boolean;
  unsupportedReason?: string;
}

export type AppTheme = 'obsidian' | 'carbon' | 'oled';

export interface AppSettings {
  theme: AppTheme;
  samplingLimit: number;
  exportFormatVersion: string;
}
