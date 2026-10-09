import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ActivePageSummary } from './components/ActivePageSummary';
import { ExtractButton } from './components/ExtractButton';
import { TokenSummary } from './components/TokenSummary';
import { OutputViewer } from './components/OutputViewer';
import { Footer } from './components/Footer';
import { SettingsModal } from './components/SettingsModal';
import { ActiveTabInfo, AppSettings, DesignSystemExtraction, ExtractionStage } from '../core/types';
import { getActiveTabInfo, triggerExtractionOnTab } from '../services/chrome-messaging';
import { loadSettings, saveSettings, loadLastExtraction, saveLastExtraction, clearStoredData } from '../services/storage';

export const App: React.FC = () => {
  const [tabInfo, setTabInfo] = useState<ActiveTabInfo | null>(null);
  const [extraction, setExtraction] = useState<DesignSystemExtraction | null>(null);
  const [stage, setStage] = useState<ExtractionStage>('idle');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'obsidian',
    samplingLimit: 350,
    exportFormatVersion: '1.0.0',
  });

  // Load initial tab information, settings, and any cached extraction
  useEffect(() => {
    async function initialize() {
      const [tab, savedSettings, cachedExtraction] = await Promise.all([
        getActiveTabInfo(),
        loadSettings(),
        loadLastExtraction(),
      ]);

      setTabInfo(tab);
      setSettings(savedSettings);
      if (cachedExtraction) {
        setExtraction(cachedExtraction);
        setStage('complete');
      }
    }
    initialize();
  }, []);

  const handleExtract = async () => {
    if (!tabInfo || !tabInfo.isSupported) return;

    setIsExtracting(true);
    try {
      setStage('reading_styles');
      await new Promise((r) => setTimeout(r, 200));

      setStage('sampling_dom');
      await new Promise((r) => setTimeout(r, 200));

      setStage('normalizing_tokens');
      const result = await triggerExtractionOnTab(tabInfo.id);

      setStage('generating_files');
      await new Promise((r) => setTimeout(r, 200));

      setExtraction(result);
      await saveLastExtraction(result);
      setStage('complete');
    } catch (err) {
      console.error('Extraction failed:', err);
      setStage('error');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRefresh = async () => {
    const cached = await loadLastExtraction();
    if (cached) {
      setExtraction(cached);
    }
  };

  const handleUpdateSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleClearData = async () => {
    await clearStoredData();
    setExtraction(null);
    setStage('idle');
    setIsSettingsOpen(false);
  };

  // Determine container theme background class based on theme selection
  const getThemeClass = () => {
    switch (settings.theme) {
      case 'carbon':
        return 'bg-[#0B0F19] text-[#F9FAFB]';
      case 'oled':
        return 'bg-[#000000] text-[#FFFFFF]';
      case 'obsidian':
      default:
        return 'bg-obsidian-bg text-obsidian-text';
    }
  };

  return (
    <div className={`w-[420px] h-[600px] flex flex-col justify-between overflow-hidden ${getThemeClass()}`}>
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <Header tabInfo={tabInfo} onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* Active Page Summary */}
        <ActivePageSummary tabInfo={tabInfo} extraction={extraction} />

        {/* Action Button */}
        <ExtractButton
          isExtracting={isExtracting}
          stage={stage}
          isSupported={tabInfo?.isSupported ?? false}
          unsupportedReason={tabInfo?.unsupportedReason}
          onExtract={handleExtract}
        />

        {/* Token Summary Preview (when extraction exists) */}
        {extraction && <TokenSummary extraction={extraction} />}

        {/* Document Output Viewer */}
        <OutputViewer extraction={extraction} onRefresh={handleRefresh} />
      </div>

      {/* Footer */}
      <Footer />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={handleUpdateSettings}
        onClearData={handleClearData}
      />
    </div>
  );
};
