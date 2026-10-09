import React, { useState } from 'react';
import { Copy, Check, Download, RefreshCw, FileText, Code2, Cpu } from 'lucide-react';
import { DesignSystemExtraction } from '../../core/types';
import { generateDesignMd } from '../../core/generators/design-md';
import { generateSkillMd } from '../../core/generators/skill-md';
import { generateDesignSystemJson } from '../../core/generators/json';
import { copyToClipboard } from '../../services/clipboard';
import { downloadFile } from '../../services/downloads';

type TabType = 'design-md' | 'skill-md' | 'json';

interface OutputViewerProps {
  extraction: DesignSystemExtraction | null;
  onRefresh: () => void;
}

export const OutputViewer: React.FC<OutputViewerProps> = ({ extraction, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<TabType>('design-md');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!extraction) {
    return (
      <div className="flex-1 mx-4 mt-3 p-6 rounded-xl bg-obsidian-surface border border-obsidian-border border-dashed flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-full bg-obsidian-elevated flex items-center justify-center text-obsidian-textMuted mb-2">
          <FileText className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-medium text-obsidian-text">No Design System Extracted Yet</h3>
        <p className="text-xs text-obsidian-textMuted mt-1 max-w-[280px]">
          Click "Extract Design System" above to analyze the active tab and generate specification files.
        </p>
      </div>
    );
  }

  // Pre-generate content based on active tab
  const designMdContent = generateDesignMd(extraction);
  const skillMdContent = generateSkillMd(extraction);
  const jsonContent = generateDesignSystemJson(extraction);

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'design-md':
        return { text: designMdContent, filename: 'DESIGN.md', mime: 'text/markdown' };
      case 'skill-md':
        return { text: skillMdContent, filename: 'SKILL.md', mime: 'text/markdown' };
      case 'json':
        return { text: jsonContent, filename: 'design-system.json', mime: 'application/json' };
    }
  };

  const handleCopy = async () => {
    const { text } = getCurrentContent();
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    const { text, filename, mime } = getCurrentContent();
    await downloadFile({
      filename,
      content: text,
      mimeType: mime,
      hostname: extraction.metadata.hostname,
    });
    setDownloading(false);
  };

  const current = getCurrentContent();

  return (
    <div className="flex-1 mx-4 mt-3 flex flex-col min-h-0 bg-obsidian-surface rounded-xl border border-obsidian-border overflow-hidden">
      {/* Tab Navigation & Action Controls */}
      <div className="px-3 py-2 border-b border-obsidian-border flex items-center justify-between bg-obsidian-elevated/40">
        {/* Tabs */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('design-md')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'design-md'
                ? 'bg-obsidian-accent text-white shadow-sm'
                : 'text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-elevated'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>DESIGN.md</span>
          </button>

          <button
            onClick={() => setActiveTab('skill-md')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'skill-md'
                ? 'bg-obsidian-accent text-white shadow-sm'
                : 'text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-elevated'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>SKILL.md</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'json'
                ? 'bg-obsidian-accent text-white shadow-sm'
                : 'text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-elevated'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>

        {/* Action Buttons: Copy, Download, Refresh */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onRefresh}
            className="p-1 rounded text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-elevated transition-colors"
            title="Refresh preview from memory"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-obsidian-elevated border border-obsidian-border text-xs text-obsidian-text hover:text-white hover:border-obsidian-borderHover transition-all"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-obsidian-textMuted" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-obsidian-elevated border border-obsidian-border text-xs text-obsidian-text hover:text-white hover:border-obsidian-borderHover transition-all"
            title={`Download ${current.filename}`}
          >
            <Download className="w-3 h-3 text-obsidian-textMuted" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Code Preview Body */}
      <div className="flex-1 p-3 overflow-y-auto overflow-x-auto font-mono text-[11px] text-[#D8DEE9] leading-relaxed bg-[#0A0B0E] select-text">
        <pre className="whitespace-pre-wrap break-all m-0 font-mono">
          {current.text}
        </pre>
      </div>
    </div>
  );
};
