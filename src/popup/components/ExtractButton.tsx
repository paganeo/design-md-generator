import React from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { ExtractionStage } from '../../core/types';

interface ExtractButtonProps {
  isExtracting: boolean;
  stage: ExtractionStage;
  isSupported: boolean;
  unsupportedReason?: string;
  onExtract: () => void;
}

const STAGE_LABELS: Record<ExtractionStage, string> = {
  idle: 'Extract Design System',
  reading_styles: 'Reading page stylesheets & variables...',
  sampling_dom: 'Sampling visible DOM elements...',
  normalizing_tokens: 'Normalizing design tokens...',
  generating_files: 'Generating DESIGN.md & SKILL.md...',
  complete: 'Re-extract Design System',
  error: 'Extraction Failed — Retry',
};

export const ExtractButton: React.FC<ExtractButtonProps> = ({
  isExtracting,
  stage,
  isSupported,
  unsupportedReason,
  onExtract,
}) => {
  return (
    <div className="px-4 mt-3">
      <button
        onClick={onExtract}
        disabled={isExtracting || !isSupported}
        className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-sm ${
          !isSupported
            ? 'bg-obsidian-elevated text-obsidian-textMuted cursor-not-allowed border border-obsidian-border'
            : isExtracting
            ? 'bg-obsidian-accent/70 text-white cursor-wait'
            : 'bg-obsidian-accent hover:bg-obsidian-accentHover text-white active:scale-[0.99] border border-blue-400/20'
        }`}
      >
        {isExtracting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span className="truncate">{STAGE_LABELS[stage] || 'Extracting...'}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>{stage === 'complete' ? 'Re-extract Design System' : 'Extract Design System'}</span>
          </>
        )}
      </button>

      {/* Helper text or warning message */}
      {!isSupported && unsupportedReason ? (
        <div className="mt-2 px-2 flex items-start space-x-1.5 text-xs text-amber-400/90">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{unsupportedReason}</span>
        </div>
      ) : (
        <p className="mt-1.5 text-[11px] text-center text-obsidian-textMuted">
          Extracts colors, typography scales, layout, radii, and component variants locally.
        </p>
      )}
    </div>
  );
};
