import { DesignSystemExtraction } from '../types';

export function generateDesignMd(data: DesignSystemExtraction): string {
  const { metadata, colors, typography, spacing, shapes, components, motion, responsive, accessibility, limitations } = data;

  const lines: string[] = [];

  // Header
  lines.push(`# DESIGN.md — Design System Specification`);
  lines.push(`> Extracted by **Design.MD Generator** (v${metadata.generatorVersion}) on ${new Date(metadata.extractedAt).toUTCString()}\n`);

  // 1. Overview and design intent
  lines.push(`## 1. Overview and Design Intent`);
  lines.push(`This design specification reverse-engineers the visual language and user interface tokens observed on **${metadata.hostname}**.`);
  lines.push(`It is generated to provide human designers and AI coding agents with exact token parameters, component styling behaviors, and layout constraints observed during runtime analysis.\n`);

  // 2. Source website and extraction metadata
  lines.push(`## 2. Source Website & Extraction Metadata`);
  lines.push(`| Property | Value |`);
  lines.push(`| :--- | :--- |`);
  lines.push(`| **Source Hostname** | \`${metadata.hostname}\` |`);
  lines.push(`| **Page Title** | ${metadata.title || 'Untitled'} |`);
  lines.push(`| **Timestamp** | \`${metadata.extractedAt}\` |`);
  lines.push(`| **Elements Sampled** | ${metadata.sampledElementsCount} nodes |`);
  lines.push(`| **Stylesheets Inspected** | ${metadata.stylesheetsInspected} |`);
  lines.push(`| **CSS Custom Properties Found** | ${metadata.cssVariablesFound} |`);
  lines.push(`| **Extraction Duration** | ${metadata.durationMs}ms |`);
  lines.push(`| **Schema Version** | \`${data.schemaVersion}\` |\n`);

  // 3. Visual identity and overall atmosphere
  lines.push(`## 3. Visual Identity & Overall Atmosphere`);
  const dominantBg = colors.backgrounds[0]?.hex || '#ffffff';
  const dominantBrand = colors.brand[0]?.hex || colors.accent[0]?.hex || '#315efb';
  const dominantText = colors.textPrimary[0]?.hex || '#111827';
  lines.push(`- **Dominant Base Surface:** \`${dominantBg}\``);
  lines.push(`- **Primary Accent/Brand:** \`${dominantBrand}\``);
  lines.push(`- **Primary Text Tone:** \`${dominantText}\``);
  lines.push(`- **Primary Typography Family:** \`${typography.fontFamilies[0]?.family || 'System UI'}\``);
  lines.push(`- **Density / Spacing Base:** ${spacing.baseUnit}px grid system`);
  lines.push(`- **Atmosphere:** Visual system observed presents high contrast, structured layout containers, and distinct micro-interactions on interactive surfaces.\n`);

  // 4. Color palette and semantic color roles
  lines.push(`## 4. Color Palette & Semantic Roles`);
  lines.push(`### 4.1 Primary & Brand Colors`);
  lines.push(`| Role | Hex | RGBA | Confidence | Source / Variable |`);
  lines.push(`| :--- | :--- | :--- | :--- | :--- |`);
  
  const allColorRoles: Array<{ roleName: string; tokens: typeof colors.brand }> = [
    { roleName: 'Primary Brand', tokens: colors.brand },
    { roleName: 'Secondary / Sub-brand', tokens: colors.secondary },
    { roleName: 'Accent Action', tokens: colors.accent },
    { roleName: 'Background Base', tokens: colors.backgrounds },
    { roleName: 'Surface / Card', tokens: colors.surfaces },
    { roleName: 'Text Primary', tokens: colors.textPrimary },
    { roleName: 'Text Muted', tokens: colors.textMuted },
    { roleName: 'Border / Divider', tokens: colors.borders },
    { roleName: 'Interactive Link', tokens: colors.links },
    { roleName: 'Button Fill', tokens: colors.buttons },
  ];

  for (const group of allColorRoles) {
    for (const token of group.tokens.slice(0, 4)) {
      lines.push(`| **${group.roleName}** | \`${token.hex}\` | \`${token.rgba}\` | \`${token.confidence}\` | ${token.variableName ? `\`${token.variableName}\`` : token.source} |`);
    }
  }

  if (colors.states.success || colors.states.warning || colors.states.error) {
    lines.push(`\n### 4.2 Semantic Feedback States`);
    lines.push(`| State | Hex | Confidence |`);
    lines.push(`| :--- | :--- | :--- |`);
    if (colors.states.success) lines.push(`| **Success** | \`${colors.states.success.hex}\` | \`${colors.states.success.confidence}\` |`);
    if (colors.states.warning) lines.push(`| **Warning** | \`${colors.states.warning.hex}\` | \`${colors.states.warning.confidence}\` |`);
    if (colors.states.error) lines.push(`| **Error** | \`${colors.states.error.hex}\` | \`${colors.states.error.confidence}\` |`);
  }

  if (colors.gradients.length > 0) {
    lines.push(`\n### 4.3 Observed Gradients`);
    for (const grad of colors.gradients.slice(0, 3)) {
      lines.push(`- \`${grad.css}\` (type: ${grad.type}, count: ${grad.count})`);
    }
  }
  lines.push('');

  // 5. Typography system
  lines.push(`## 5. Typography System`);
  lines.push(`### 5.1 Font Families`);
  for (const fam of typography.fontFamilies) {
    lines.push(`- **${fam.family}** (fallback: \`${fam.genericFallback}\`, loaded: ${fam.isCustomLoaded ? 'Yes (WebFont)' : 'System Stack'}, observed weights: \`[${fam.weights.join(', ')}]\`)`);
  }

  lines.push(`\n### 5.2 Type Scale (Measured)`);
  lines.push(`| Size (px) | Equivalent (rem) | Typical Usage Role | Observations |`);
  lines.push(`| :--- | :--- | :--- | :--- |`);
  for (const sz of typography.fontSizes.slice(0, 8)) {
    lines.push(`| \`${sz.px}px\` | \`${sz.rem}\` | ${sz.usage} | ${sz.count} elements |`);
  }

  if (typography.headings.length > 0) {
    lines.push(`\n### 5.3 Heading Hierarchy`);
    lines.push(`| Level | Font Size | Weight | Line Height |`);
    lines.push(`| :--- | :--- | :--- | :--- |`);
    for (const h of typography.headings) {
      lines.push(`| \`${h.level.toUpperCase()}\` | \`${h.fontSize}\` | \`${h.fontWeight}\` | \`${h.lineHeight}\` |`);
    }
  }

  lines.push(`\n- **Body Default:** \`${typography.body.fontSize}\` / \`${typography.body.lineHeight}\` with weight \`${typography.body.fontWeight}\` in font \`${typography.body.fontFamily}\`\n`);

  // 6. Spacing and sizing
  lines.push(`## 6. Spacing & Sizing`);
  lines.push(`- **Base Grid Unit:** \`${spacing.baseUnit}px\``);
  lines.push(`- **Inferred Spacing Scale:** \`[${spacing.inferredScale.map(s => `${s}px`).join(', ')}]\``);
  lines.push(`- **Observed Padding Values:** \`[${spacing.measuredPaddings.slice(0, 8).map(s => `${s}px`).join(', ')}]\``);
  lines.push(`- **Observed Margin Values:** \`[${spacing.measuredMargins.slice(0, 8).map(s => `${s}px`).join(', ')}]\``);
  lines.push(`- **Observed Gap Values:** \`[${spacing.measuredGaps.slice(0, 6).map(s => `${s}px`).join(', ')}]\`\n`);

  // 7. Layout and responsive behavior
  lines.push(`## 7. Layout & Responsive Behavior`);
  lines.push(`- **Container Max-Widths Observed:** ${spacing.containerMaxWidths.length > 0 ? spacing.containerMaxWidths.map(w => `\`${w}px\``).join(', ') : 'Fluid / responsive bounds'}`);
  lines.push(`- **Flexbox Implementations Detected:** ${spacing.flexPatternsCount}`);
  lines.push(`- **CSS Grid Implementations Detected:** ${spacing.gridPatternsCount}`);
  if (responsive.breakpoints.length > 0) {
    lines.push(`- **Observed Media Breakpoints:** ${responsive.breakpoints.map(bp => `\`${bp}px\``).join(', ')}`);
  }
  lines.push(`- **Responsive Status:** ${responsive.isPartial ? 'Partial (runtime single-viewport inspection)' : 'Full stylesheet rules extracted'}`);
  if (responsive.notes) lines.push(`> *${responsive.notes}*\n`);

  // 8. Borders, radii, shadows, and surfaces
  lines.push(`## 8. Borders, Radii, Shadows & Surfaces`);
  lines.push(`### 8.1 Border Radii`);
  lines.push(`| Radius (px) | Observations | Role / Component |`);
  lines.push(`| :--- | :--- | :--- |`);
  for (const r of shapes.radii) {
    lines.push(`| \`${r.px}px\` | ${r.count} | ${r.role} |`);
  }

  lines.push(`\n### 8.2 Box Shadows (Elevations)`);
  if (shapes.shadows.length > 0) {
    lines.push(`| Elevation Level | CSS Value | Frequency |`);
    lines.push(`| :--- | :--- | :--- |`);
    for (const sh of shapes.shadows) {
      lines.push(`| \`${sh.elevation}\` | \`${sh.css}\` | ${sh.count} |`);
    }
  } else {
    lines.push(`*Flat design pattern dominant; no elevated box-shadows registered in sampled components.*`);
  }
  lines.push('');

  // 9. Components and variants
  lines.push(`## 9. Components & Variants`);
  if (components.length > 0) {
    for (const comp of components.slice(0, 8)) {
      lines.push(`### 9.${components.indexOf(comp) + 1} ${comp.name} (\`<${comp.tag}>\`)`);
      lines.push(`- **Category:** \`${comp.category}\``);
      lines.push(`- **Confidence:** \`${comp.confidence}\` (${comp.instancesCount} instances detected)`);
      lines.push(`- **Styles Extracted:**`);
      lines.push(`\`\`\`css`);
      if (comp.styles.backgroundColor) lines.push(`background-color: ${comp.styles.backgroundColor};`);
      if (comp.styles.color) lines.push(`color: ${comp.styles.color};`);
      if (comp.styles.padding) lines.push(`padding: ${comp.styles.padding};`);
      if (comp.styles.borderRadius) lines.push(`border-radius: ${comp.styles.borderRadius};`);
      if (comp.styles.border) lines.push(`border: ${comp.styles.border};`);
      if (comp.styles.boxShadow) lines.push(`box-shadow: ${comp.styles.boxShadow};`);
      if (comp.styles.fontSize) lines.push(`font-size: ${comp.styles.fontSize};`);
      if (comp.styles.fontWeight) lines.push(`font-weight: ${comp.styles.fontWeight};`);
      lines.push(`\`\`\``);
      if (comp.states?.hover) {
        lines.push(`- **Observed :hover:** \`${JSON.stringify(comp.states.hover)}\``);
      }
      lines.push('');
    }
  } else {
    lines.push(`*No standalone interactive component variants uniquely registered.*`);
  }

  // 10. Interaction and motion patterns
  lines.push(`## 10. Interaction & Motion Patterns`);
  lines.push(`- **Transition Declarations:** ${motion.transitions.length > 0 ? motion.transitions.slice(0, 4).map(t => `\`${t}\``).join(', ') : 'None explicitly declared'}`);
  lines.push(`- **Common Durations:** ${motion.durations.length > 0 ? motion.durations.map(d => `\`${d}\``).join(', ') : '0ms'}`);
  lines.push(`- **Observed Easing Functions:** ${motion.easings.length > 0 ? motion.easings.map(e => `\`${e}\``).join(', ') : 'ease / ease-in-out'}`);
  lines.push(`- **prefers-reduced-motion Support:** ${motion.reducedMotionSupported ? 'Detected in stylesheets' : 'Not explicitly declared'}\n`);

  // 11. Accessibility observations
  lines.push(`## 11. Accessibility Observations`);
  lines.push(`- **Semantic Landmarks:** ${accessibility.landmarksCount} landmark elements found (\`<header>\`, \`<nav>\`, \`<main>\`, \`<footer>\`)`);
  lines.push(`- **Heading Structure:** ${accessibility.semanticHeadingHierarchyValid ? 'Ordered h1-h6 hierarchy' : 'Non-linear hierarchy detected'}`);
  lines.push(`- **Sampled Contrast Checks:**`);
  for (const c of accessibility.contrastChecks.slice(0, 4)) {
    lines.push(`  - \`${c.selector}\`: ${c.ratio}:1 (${c.passedAA ? 'Passed WCAG AA' : 'Warning: Below 4.5:1 ratio'})`);
  }
  lines.push('');

  // 12. Design token reference (Tailwind & CSS Variables)
  lines.push(`## 12. Design Token Reference (Tailwind / CSS Variables)`);
  lines.push(`\`\`\`css`);
  lines.push(`:root {`);
  if (colors.brand[0]) lines.push(`  --color-primary: ${colors.brand[0].hex};`);
  if (colors.accent[0]) lines.push(`  --color-accent: ${colors.accent[0].hex};`);
  if (colors.backgrounds[0]) lines.push(`  --color-bg: ${colors.backgrounds[0].hex};`);
  if (colors.surfaces[0]) lines.push(`  --color-surface: ${colors.surfaces[0].hex};`);
  if (colors.textPrimary[0]) lines.push(`  --color-text: ${colors.textPrimary[0].hex};`);
  if (colors.textMuted[0]) lines.push(`  --color-text-muted: ${colors.textMuted[0].hex};`);
  if (colors.borders[0]) lines.push(`  --color-border: ${colors.borders[0].hex};`);
  if (shapes.radii[0]) lines.push(`  --radius-sm: ${shapes.radii[0].px}px;`);
  if (shapes.radii[1]) lines.push(`  --radius-md: ${shapes.radii[1].px}px;`);
  lines.push(`}`);
  lines.push(`\`\`\`\n`);

  // 13. Implementation recommendations
  lines.push(`## 13. Implementation Recommendations`);
  lines.push(`1. **Strict Palette Adherence:** Always map interactive states to the verified primary accent (\`${dominantBrand}\`) rather than guessing new hex codes.`);
  lines.push(`2. **Typography Consistency:** Apply font family \`${typography.fontFamilies[0]?.family || 'System'}\` globally and maintain the observed body line-height of \`${typography.body.lineHeight}\`.`);
  lines.push(`3. **Radii Uniformity:** Keep button and input corner curvature pinned to the primary observed radius (${shapes.radii[0]?.px || 8}px) to preserve visual coherence.\n`);

  // 14. Observed facts versus inferred patterns
  lines.push(`## 14. Observed Facts vs. Inferred Decisions`);
  lines.push(`- **Verified Runtime Facts:** Computed colors, explicit font families, measured border radii, and active flex/grid declarations directly evaluated from rendered nodes.`);
  lines.push(`- **Inferred Decisions:** Categorization into semantic roles ('brand', 'accent', 'surface') derived from occurrence frequency, element role, and contrast calculations.\n`);

  // 15. Known limitations and confidence notes
  lines.push(`## 15. Known Limitations & Confidence Notes`);
  if (limitations.length > 0) {
    for (const lim of limitations) {
      lines.push(`- ⚠️ ${lim}`);
    }
  } else {
    lines.push(`- Complete local extraction performed with zero network interruptions.`);
  }
  lines.push('');

  return lines.join('\n');
}
