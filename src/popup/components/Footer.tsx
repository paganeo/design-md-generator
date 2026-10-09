import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="px-4 py-2 border-t border-obsidian-border bg-obsidian-surface/80 flex items-center justify-between text-[11px] text-obsidian-textMuted">
      <div className="flex items-center space-x-1.5">
        <Shield className="w-3 h-3 text-emerald-400" />
        <span>Analysis runs locally in your browser.</span>
      </div>

      <div className="font-mono text-[10px]">
        <span>v1.0.0</span>
      </div>
    </footer>
  );
};
