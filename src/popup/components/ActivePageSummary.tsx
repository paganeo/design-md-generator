import React from 'react';
import { Globe, Layers, Clock } from 'lucide-react';
import { ActiveTabInfo, DesignSystemExtraction } from '../../core/types';

interface ActivePageSummaryProps {
  tabInfo: ActiveTabInfo | null;
  extraction: DesignSystemExtraction | null;
}

export const ActivePageSummary: React.FC<ActivePageSummaryProps> = ({ tabInfo, extraction }) => {
  const hostname = tabInfo?.hostname || 'Inspecting active tab...';
  const title = tabInfo?.title || 'Active Web Page';

  return (
    <div className="p-3.5 mx-4 mt-3 rounded-xl bg-obsidian-surface border border-obsidian-border shadow-sm">
      <div className="flex items-start space-x-3">
        {/* Favicon or Globe */}
        <div className="w-8 h-8 rounded-lg bg-obsidian-elevated border border-obsidian-border flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
          {tabInfo?.favicon ? (
            <img
              src={tabInfo.favicon}
              alt="Favicon"
              className="w-4 h-4 object-contain"
              onError={(e) => {
                // If favicon fails, hide image
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <Globe className="w-4 h-4 text-obsidian-textMuted" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-obsidian-text truncate" title={title}>
              {title}
            </h2>
          </div>
          <p className="text-xs text-obsidian-textMuted font-mono truncate" title={hostname}>
            {hostname}
          </p>
        </div>
      </div>

      {/* Metadata metrics footer */}
      {extraction && (
        <div className="mt-3 pt-2.5 border-t border-obsidian-border/60 flex items-center justify-between text-[11px] text-obsidian-textMuted">
          <div className="flex items-center space-x-1">
            <Layers className="w-3 h-3 text-obsidian-accent" />
            <span>{extraction.metadata.sampledElementsCount} elements inspected</span>
          </div>

          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-obsidian-textMuted" />
            <span>{extraction.metadata.durationMs}ms</span>
          </div>
        </div>
      )}
    </div>
  );
};
