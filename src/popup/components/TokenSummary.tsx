import React from 'react';
import { Palette, Type, Box, ShieldCheck } from 'lucide-react';
import { DesignSystemExtraction } from '../../core/types';

interface TokenSummaryProps {
  extraction: DesignSystemExtraction;
}

export const TokenSummary: React.FC<TokenSummaryProps> = ({ extraction }) => {
  const { colors, typography, shapes, spacing } = extraction;

  // Gather top representative colors
  const primaryColors = [
    ...colors.brand.slice(0, 2),
    ...colors.accent.slice(0, 1),
    ...colors.surfaces.slice(0, 1),
    ...colors.backgrounds.slice(0, 1),
  ].slice(0, 5);

  const primaryFont = typography.fontFamilies[0]?.family || 'Inter';
  const primaryRadius = shapes.radii[0]?.px ?? 8;

  return (
    <div className="mx-4 mt-3 p-3 rounded-xl bg-obsidian-surface border border-obsidian-border space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-obsidian-text uppercase tracking-wider">
          Observed Tokens
        </span>
        <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3" />
          <span>High Evidence</span>
        </span>
      </div>

      {/* Colors Row */}
      <div className="flex items-center space-x-2">
        <Palette className="w-3.5 h-3.5 text-obsidian-textMuted flex-shrink-0" />
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
          {primaryColors.map((col, idx) => (
            <div
              key={`${col.hex}-${idx}`}
              className="flex items-center space-x-1 bg-obsidian-elevated px-1.5 py-0.5 rounded-md border border-obsidian-border text-[11px] font-mono"
              title={`${col.role}: ${col.hex}`}
            >
              <span
                className="w-3 h-3 rounded-sm border border-black/20 flex-shrink-0"
                style={{ backgroundColor: col.hex }}
              />
              <span className="text-obsidian-text truncate max-w-[55px]">{col.hex}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Typography & Geometry Chips */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Typography */}
        <div className="flex items-center space-x-1.5 bg-obsidian-elevated p-1.5 rounded-lg border border-obsidian-border truncate">
          <Type className="w-3.5 h-3.5 text-obsidian-accent flex-shrink-0" />
          <span className="text-obsidian-text truncate" title={primaryFont}>
            {primaryFont}
          </span>
        </div>

        {/* Geometry & Spacing */}
        <div className="flex items-center space-x-1.5 bg-obsidian-elevated p-1.5 rounded-lg border border-obsidian-border">
          <Box className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          <span className="text-obsidian-text truncate font-mono text-[11px]">
            {primaryRadius}px r • {spacing.baseUnit}px grid
          </span>
        </div>
      </div>
    </div>
  );
};
