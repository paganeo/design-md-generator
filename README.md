# Design.MD Generator — Chrome Design System Extractor

A developer-focused Google Chrome extension (Manifest V3) that inspects active websites, reverse-engineers their visual design systems, and generates implementation-ready specifications for human engineers and AI coding agents.

![Design.MD Generator Icon](public/icons/icon128.png)

## Core Deliverables Generated

1. **`DESIGN.md`**: Comprehensive editorial human-readable specification with 15 structured sections covering color roles, type scales, spacing hierarchies, component variants, and accessibility audits.
2. **`SKILL.md`**: Actionable directives and strict Do's & Don'ts for AI coding agents (Claude, Cursor, Gemini, Copilot).
3. **`design-system.json`**: Deterministic, versioned (`1.0.0`) machine-readable design token schema without synthetic hallucinations.

---

## Visual Design & Dark Palette

Designed as a modern developer utility workspace with an ultra-sleek dark aesthetic:
- **Default Theme (Obsidian Pro):**
  - Base Background: `#0D0E12`
  - Surfaces / Cards: `#161820` / `#1E202B`
  - Subtle Borders: `#292C3A`
  - Primary Text: `#F1F3F7` (High-contrast soft white)
  - Secondary Text: `#8D93A5`
  - Primary Accent: `#3B82F6` (Electric Blue)
- **Selectable Themes in Settings:**
  - **Obsidian Pro** (Default high-contrast editorial dark)
  - **Carbon Slate** (`#0B0F19` with Sky Cyan accents)
  - **OLED Pure** (`#000000` absolute black for OLED screens)

---

## How to Install in Google Chrome

1. **Build the extension** (already compiled into `dist/`):
   ```bash
   npm run build
   ```
2. Open Google Chrome and navigate to:
   ```
   chrome://extensions
   ```
3. Enable **Developer mode** toggle in the top-right corner.
4. Click **Load unpacked** (*Cargar descomprimida*).
5. Select the **`dist`** directory inside this repository:
   ```
   c:\Users\ferna\OneDrive\Desktop\Design.md Generator\dist
   ```
6. The extension **Design.MD Generator** will appear in your Chrome toolbar. Pin it for quick access!

---

## Technical Stack & Architecture

- **Manifest V3**: Pure client-side browser automation with least-privilege APIs (`activeTab`, `scripting`, `storage`, `downloads`).
- **React 19 & TypeScript**: Strict type safety and modular components.
- **Tailwind CSS**: Custom tokenized styling with dark palettes.
- **Lucide Icons**: Crisp interface iconography.
- **Vite & Rollup**: High-performance module bundling.
- **Vitest**: Unit testing suite.
- **Sharp**: Crisp multi-resolution icon generation (16px, 32px, 48px, 128px).

### Directory Structure

```
├── dist/                     # Production extension ready to load in Chrome
│   ├── manifest.json
│   ├── index.html
│   ├── service-worker.js
│   ├── assets/
│   └── icons/
├── public/
│   ├── manifest.json
│   └── icons/
├── scripts/
│   └── generate-icons.js     # Script generating icon16, 32, 48, 128 PNGs
├── src/
│   ├── background/
│   │   └── service-worker.ts # MV3 background worker
│   ├── content/
│   │   ├── accessibility.ts  # Contrast and heading audits
│   │   ├── color-analyzer.ts # Color clustering & semantic roles
│   │   ├── component-analyzer.ts # Non-invasive UI component inspection
│   │   ├── dom-sampler.ts    # Deterministic 250-350 element sampling
│   │   ├── extraction.ts     # Main extraction pipeline coordinator
│   │   ├── layout-analyzer.ts# Spacing, grid, flex, radii, shadows
│   │   ├── motion-analyzer.ts# Transitions, animations, durations
│   │   ├── stylesheet-reader.ts # CSS variables and media query reader
│   │   └── typography-analyzer.ts # Font families, type scale, weights
│   ├── core/
│   │   ├── generators/
│   │   │   ├── design-md.ts  # DESIGN.md Markdown generator
│   │   │   ├── json.ts       # design-system.json generator
│   │   │   └── skill-md.ts   # SKILL.md AI Agent directives generator
│   │   ├── normalization.ts  # Color & spacing normalization math
│   │   ├── schema.ts         # Schema 1.0.0 validation
│   │   └── types.ts          # Domain type definitions
│   ├── popup/
│   │   ├── components/       # Header, ActivePageSummary, OutputViewer, etc.
│   │   ├── styles/           # Tailwind CSS directives
│   │   ├── App.tsx           # Main application state and workflow
│   │   └── main.tsx          # React DOM mounting
│   └── services/
│       ├── chrome-messaging.ts # Tab queries and script execution
│       ├── clipboard.ts      # Clipboard copy utility
│       ├── downloads.ts      # Chrome downloads integration
│       └── storage.ts        # chrome.storage.local persistence
└── tests/
    ├── fixtures/
    └── unit/                 # Vitest test suite
```

---

## Privacy & Security Guarantees

- **100% Local Execution**: Analysis runs directly within the active browser tab via `chrome.scripting.executeScript`.
- **Zero External Telemetry**: No tracking pixels, remote APIs, external font requests, or analytics libraries.
- **Privacy Stripping**: URLs are sanitized before display and storage (all query strings and hashes are discarded).
- **Least-Privilege Permissions**: Requests only `activeTab`, `scripting`, `storage`, and `downloads`. No open host permissions (`<all_urls>`).

---

## Development Scripts

```bash
# Run unit tests
npm run test

# Run TypeScript type check
npm run typecheck

# Build production bundle to dist/
npm run build

# Regenerate PNG icons from SVG source
node scripts/generate-icons.js
```
