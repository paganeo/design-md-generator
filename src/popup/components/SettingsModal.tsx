import React from 'react';
import { X, Moon, Trash2, ShieldCheck } from 'lucide-react';
import { AppSettings, AppTheme } from '../../core/types';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  onClose: () => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClearData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
  onClearData,
}) => {
  if (!isOpen) return null;

  const handleThemeChange = (theme: AppTheme) => {
    onUpdateSettings({ ...settings, theme });
  };

  const handleSamplingChange = (limit: number) => {
    onUpdateSettings({ ...settings, samplingLimit: limit });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-[360px] bg-obsidian-surface border border-obsidian-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-obsidian-border flex items-center justify-between bg-obsidian-elevated/40">
          <div className="flex items-center space-x-2">
            <Moon className="w-4 h-4 text-obsidian-accent" />
            <h3 className="text-sm font-semibold text-obsidian-text">Settings & Preferences</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-elevated transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-4 text-xs text-obsidian-text">
          {/* Theme Selector */}
          <div>
            <label className="block text-[11px] font-medium text-obsidian-textMuted uppercase tracking-wider mb-2">
              Dark Theme Palette
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleThemeChange('obsidian')}
                className={`p-2 rounded-lg border text-center transition-all ${
                  settings.theme === 'obsidian'
                    ? 'border-obsidian-accent bg-obsidian-accent/15 text-white font-medium'
                    : 'border-obsidian-border bg-obsidian-elevated text-obsidian-textMuted hover:text-obsidian-text'
                }`}
              >
                <div className="w-full h-3 rounded bg-[#0D0E12] border border-[#292C3A] mb-1.5" />
                <span className="text-[11px]">Obsidian Pro</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('carbon')}
                className={`p-2 rounded-lg border text-center transition-all ${
                  settings.theme === 'carbon'
                    ? 'border-obsidian-accent bg-obsidian-accent/15 text-white font-medium'
                    : 'border-obsidian-border bg-obsidian-elevated text-obsidian-textMuted hover:text-obsidian-text'
                }`}
              >
                <div className="w-full h-3 rounded bg-[#0B0F19] border border-[#374151] mb-1.5" />
                <span className="text-[11px]">Carbon Slate</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('oled')}
                className={`p-2 rounded-lg border text-center transition-all ${
                  settings.theme === 'oled'
                    ? 'border-obsidian-accent bg-obsidian-accent/15 text-white font-medium'
                    : 'border-obsidian-border bg-obsidian-elevated text-obsidian-textMuted hover:text-obsidian-text'
                }`}
              >
                <div className="w-full h-3 rounded bg-[#000000] border border-[#27272A] mb-1.5" />
                <span className="text-[11px]">OLED Pure</span>
              </button>
            </div>
          </div>

          {/* Sampling Depth */}
          <div>
            <label className="block text-[11px] font-medium text-obsidian-textMuted uppercase tracking-wider mb-2">
              DOM Sampling Depth
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[250, 350, 500].map((limit) => (
                <button
                  key={limit}
                  type="button"
                  onClick={() => handleSamplingChange(limit)}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                    settings.samplingLimit === limit
                      ? 'border-obsidian-accent bg-obsidian-accent/15 text-white font-medium'
                      : 'border-obsidian-border bg-obsidian-elevated text-obsidian-textMuted hover:text-obsidian-text'
                  }`}
                >
                  <span className="text-xs">{limit} nodes</span>
                </button>
              ))}
            </div>
          </div>

          {/* Clear Cache */}
          <div className="pt-2 border-t border-obsidian-border">
            <button
              onClick={onClearData}
              className="w-full py-2 px-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cached Extraction Data</span>
            </button>
          </div>

          {/* Privacy Statement */}
          <div className="p-2.5 rounded-lg bg-obsidian-elevated border border-obsidian-border/80 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-obsidian-textMuted leading-relaxed">
              <strong>100% Local Execution:</strong> Analysis executes directly in your browser tab. No code or design assets are ever uploaded to remote servers or analytics.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 border-t border-obsidian-border bg-obsidian-elevated/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-obsidian-accent text-white text-xs font-medium hover:bg-obsidian-accentHover transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
