import { DesignSystemExtraction } from '../types';

export function generateSkillMd(data: DesignSystemExtraction): string {
  const { metadata, colors, typography, spacing, shapes } = data;

  const brandHex = colors.brand[0]?.hex || colors.accent[0]?.hex || '#315efb';
  const bgHex = colors.backgrounds[0]?.hex || '#ffffff';
  const surfaceHex = colors.surfaces[0]?.hex || '#f9fafb';
  const textHex = colors.textPrimary[0]?.hex || '#111827';
  const textMutedHex = colors.textMuted[0]?.hex || '#6b7280';
  const borderHex = colors.borders[0]?.hex || '#e5e7eb';
  const primaryRadius = shapes.radii[0]?.px ?? 8;
  const primaryFont = typography.fontFamilies[0]?.family || 'Inter, system-ui, sans-serif';

  return `---
name: apply-${metadata.hostname.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-design-system
description: Implementation guide and strict design instructions to build interfaces matching the visual identity of ${metadata.hostname}
version: 1.0.0
---

# Design System Implementation Skill: ${metadata.hostname}

## 1. Skill Purpose & Scope
This skill provides an AI coding agent with strict, non-negotiable styling directives to build frontend components and web pages that precisely reflect the visual language extracted from \`${metadata.hostname}\`.

## 2. Design Objectives
- **Aesthetic Fidelity:** Replicate the contrast, geometry, typography hierarchy, and density of the reference site without inventing unobserved tokens.
- **Strict Token Reuse:** Use exclusively the extracted color tokens, typography scales, spacing units, and radius values detailed below.
- **Consistency:** Avoid ad-hoc inline styles or arbitrary Tailwind arbitrary values (\`bg-[#123456]\`) not listed in this specification.

## 3. Required Design Tokens

### 3.1 Color Palette Directives
- **Primary Action / Brand:** \`${brandHex}\`
  - *Rule:* Reserve exclusively for primary call-to-actions, prominent active states, and brand marks.
- **Surface & Backgrounds:**
  - Base Background: \`${bgHex}\`
  - Surface Card / Panels: \`${surfaceHex}\`
  - *Rule:* Use card surfaces for grouping distinct content blocks. Never layer cards on an identical shade without a border or elevation.
- **Typography Colors:**
  - Headings & High-contrast Text: \`${textHex}\`
  - Subtitles, Metadata & Secondary Text: \`${textMutedHex}\`
- **Borders & Dividers:** \`${borderHex}\`
  - *Rule:* Use 1px solid \`${borderHex}\` for separating sections and outlining input fields.

### 3.2 Typography Rules
- **Primary Font Family:** \`${primaryFont}\`
- **Base Body Size:** \`${typography.body.fontSize}\` with line-height \`${typography.body.lineHeight}\`.
- **Heading Scale Directives:**
${typography.headings.map(h => `  - **${h.level.toUpperCase()}:** font-size: \`${h.fontSize}\`, weight: \`${h.fontWeight}\`, line-height: \`${h.lineHeight}\``).join('\n') || '  - H1: 32px / font-bold\n  - H2: 24px / font-semibold\n  - H3: 20px / font-medium'}

### 3.3 Spacing & Layout Constraints
- **Base Grid Multiplier:** \`${spacing.baseUnit}px\`.
- **Approved Spacing Steps:** \`[${spacing.inferredScale.map(s => `${s}px`).join(', ')}]\`.
- *Rule:* Never use arbitrary margin or padding steps (e.g. \`17px\`, \`23px\`). Snap all spacing to the nearest approved token.
- **Container Max-Widths:** Set page wrappers to max-width \`${spacing.containerMaxWidths[0] || 1200}px\` with auto horizontal margins.

### 3.4 Geometry, Borders & Elevation
- **Standard Border Radius:** \`${primaryRadius}px\`
  - Apply \`${primaryRadius}px\` to all buttons, input controls, and badges.
  - Apply \`${Math.round(primaryRadius * 1.5)}px\` to modal dialogs and outer card shells.
- **Box Shadows:** ${shapes.shadows[0] ? `\`${shapes.shadows[0].css}\`` : 'Prefer subtle borders (\`1px solid\`) over heavy dropped shadows.'}

## 4. Component Implementation Guidance

### 4.1 Primary Button Pattern
\`\`\`html
<button class="px-4 py-2 font-medium text-white transition-all rounded-[${primaryRadius}px] bg-[${brandHex}] hover:opacity-90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[${brandHex}]/40">
  Button Text
</button>
\`\`\`

### 4.2 Secondary / Outlined Button Pattern
\`\`\`html
<button class="px-4 py-2 font-medium transition-all rounded-[${primaryRadius}px] border border-[${borderHex}] text-[${textHex}] bg-transparent hover:bg-[${surfaceHex}] focus:outline-none">
  Secondary Action
</button>
\`\`\`

### 4.3 Input & Form Field Pattern
\`\`\`html
<input
  type="text"
  class="w-full px-3 py-2 text-sm transition-colors rounded-[${primaryRadius}px] border border-[${borderHex}] bg-[${surfaceHex}] text-[${textHex}] placeholder:text-[${textMutedHex}] focus:outline-none focus:border-[${brandHex}]"
  placeholder="Placeholder..."
/>
\`\`\`

## 5. Explicit Do's & Don'ts

### ✅ DO
1. **DO** maintain the ${spacing.baseUnit}px vertical rhythm throughout every component.
2. **DO** verify WCAG contrast on all text against its immediate background container.
3. **DO** reuse the exact corner radius (\`${primaryRadius}px\`) across inputs, buttons, and selects for geometric cohesion.
4. **DO** provide visible \`:focus-visible\` states for all keyboard interactions.

### ❌ DON'T
1. **DON'T** introduce arbitrary neon gradients, random drop shadows, or unextracted saturated colors.
2. **DON'T** use multiple competing font families when only one dominant family was observed.
3. **DON'T** mix disparate corner radii (e.g., pill buttons alongside sharp 0px inputs).
4. **DON'T** place pure white text on low-contrast gray backgrounds without checking luminance.

## 6. Visual Quality Gates
Before considering an implementation complete, verify:
- [ ] No colors exist outside of the approved color tokens.
- [ ] Body copy is legible and uses \`${typography.body.fontSize}\` with line-height \`${typography.body.lineHeight}\`.
- [ ] All interactive buttons and inputs have hover and focus states.
- [ ] Layout behaves responsively on mobile (375px), tablet (768px), and desktop (1280px).

## 7. Handling Uncertain or Missing Information
- When a state (such as disabled button) is not explicitly present in the extracted tokens, derive it predictably by applying \`opacity-50 pointer-events-none\` to the existing primary token.
- Do not invent custom decorative artwork or secondary icons not required by the functional spec.
`;
}
