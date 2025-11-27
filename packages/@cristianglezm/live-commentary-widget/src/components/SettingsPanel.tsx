import React from 'react';
import type { VlmSettings } from '../types';
import { CloseIcon } from './icons';

interface SettingsPanelProps {
  settings: VlmSettings;
  onSettingsChange: (newSettings: Partial<VlmSettings>) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, onClose }) => {
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onSettingsChange({
      [name]: parseFloat(value),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onSettingsChange({ [name]: value });
  };
  
  return (
    <div 
      className="absolute inset-0 bg-lc-bg text-lc-text flex flex-col z-20 animate-lc-fade-in"
    >
      <div className="flex justify-between items-center p-3 border-b border-lc-surface-highlight shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide">Settings</h2>
        <button onClick={onClose} className="text-lc-text-muted hover:bg-lc-surface-hover p-1 rounded transition-colors" aria-label="Close settings">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-twitch">
        
        <div className="space-y-3 animate-lc-fade-in">
            <h3 className="text-xs font-bold text-lc-text-muted uppercase mb-2">Remote Provider</h3>
            <div>
                <label htmlFor="model" className="block text-xs font-bold text-lc-text mb-1">
                Model Name
                </label>
                <input
                type="text" id="model" name="model"
                value={settings.model} onChange={handleInputChange}
                placeholder="gpt-4o"
                className="w-full px-3 py-2 bg-lc-input-bg border border-lc-input-border rounded focus:border-lc-accent focus:ring-1 focus:ring-lc-accent focus:outline-none text-sm transition-colors"
                />
            </div>
            
            <div>
                <label htmlFor="remoteUrl" className="block text-xs font-bold text-lc-text mb-1">
                Server URL
                </label>
                <input
                type="text" id="remoteUrl" name="remoteUrl"
                value={settings.remoteUrl} onChange={handleInputChange}
                placeholder="http://localhost:8080/..."
                className="w-full px-3 py-2 bg-lc-input-bg border border-lc-input-border rounded focus:border-lc-accent focus:ring-1 focus:ring-lc-accent focus:outline-none text-sm transition-colors"
                />
            </div>
            <div>
                <label htmlFor="apiKey" className="block text-xs font-bold text-lc-text mb-1">
                API Key (Optional)
                </label>
                <input
                type="password" id="apiKey" name="apiKey"
                value={settings.apiKey} onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-lc-input-bg border border-lc-input-border rounded focus:border-lc-accent focus:ring-1 focus:ring-lc-accent focus:outline-none text-sm transition-colors"
                />
            </div>
        </div>

        <div className="h-px bg-lc-surface-highlight my-2"></div>

        <h3 className="text-xs font-bold text-lc-text-muted uppercase">Preferences</h3>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="captureInterval" className="text-xs font-bold text-lc-text">Comment Interval</label>
            <span className="text-xs text-lc-text-muted">{settings.captureInterval}s</span>
          </div>
          <input
            type="range" id="captureInterval" name="captureInterval" min="5" max="60" step="1"
            value={settings.captureInterval} onChange={handleSliderChange}
            className="w-full h-1 bg-lc-surface-hover rounded-lg appearance-none cursor-pointer accent-lc-accent"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="temperature" className="text-xs font-bold text-lc-text">Creativity</label>
            <span className="text-xs text-lc-text-muted">{settings.temperature.toFixed(2)}</span>
          </div>
          <input
            type="range" id="temperature" name="temperature" min="0" max="1.5" step="0.05"
            value={settings.temperature} onChange={handleSliderChange}
            className="w-full h-1 bg-lc-surface-hover rounded-lg appearance-none cursor-pointer accent-lc-accent"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="topK" className="text-xs font-bold text-lc-text">Top-K</label>
            <span className="text-xs text-lc-text-muted">{settings.topK}</span>
          </div>
          <input
            type="range" id="topK" name="topK" min="1" max="100" step="1"
            value={settings.topK} onChange={handleSliderChange}
            className="w-full h-1 bg-lc-surface-hover rounded-lg appearance-none cursor-pointer accent-lc-accent"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="topP" className="text-xs font-bold text-lc-text">Top-P</label>
            <span className="text-xs text-lc-text-muted">{settings.topP.toFixed(2)}</span>
          </div>
          <input
            type="range" id="topP" name="topP" min="0" max="1" step="0.05"
            value={settings.topP} onChange={handleSliderChange}
            className="w-full h-1 bg-lc-surface-hover rounded-lg appearance-none cursor-pointer accent-lc-accent"
          />
        </div>
        
      </div>
    </div>
  );
};

export default SettingsPanel;
