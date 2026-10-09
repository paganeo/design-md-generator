import React from 'react';
import { Settings, ShieldCheck, AlertCircle } from 'lucide-react';
import { ActiveTabInfo } from '../../core/types';

interface HeaderProps {
  tabInfo: ActiveTabInfo | null;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ tabInfo, onOpenSettings }) => {
  const isSupported = tabInfo?.isSupported ?? false;

  return (
    <header className="px-4 py-3 flex items-center justify-between border-b border-obsidian-border bg-obsidian-surface/60 backdrop-blur-md">
      <div className="flex items-center space-x-2.5">
        {/* Brand Icon */}
        <div className="w-7 h-7 rounded-lg bg-obsidian-elevated border border-obsidian-border flex items-center justify-center p-1 shadow-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M10 2v2" />
            <path d="M14 2v4" />
            <path d="M17 2a1 1 0 0 1 1 1v9h-6V7h6" />
            <path d="M6 12a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v2.9a2 2 0 1 0 4 0V17a1 1 0 0 1 1-1h2a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1" />
          </svg>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold tracking-tight text-obsidian-text">
              Design.MD Generator
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Active Page Status Badge */}
        {tabInfo && (
          <div
            className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${
              isSupported
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            {isSupported ? (
              <>
                <ShieldCheck className="w-3 h-3" />
                <span>Ready</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3" />
                <span>Restricted</span>
              </>
            )}
          </div>
        )}

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-md text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-elevated transition-colors border border-transparent hover:border-obsidian-border"
          title="Settings and Options"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
