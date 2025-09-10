"use client";
import { useState } from 'react';
import { useConfiguration } from '../ConfigurationProvider';
import { SidebarConfig } from '@/config/dashboard.types';

interface SidebarConfigPanelProps {
  pageId: string;
}

export const SidebarConfigPanel = ({ pageId }: SidebarConfigPanelProps) => {
  const { config, updateConfig } = useConfiguration();
  const [useGlobalSidebar, setUseGlobalSidebar] = useState(() => {
    // Check if current page has its own sidebar config
    return !config.pages[pageId]?.sidebar;
  });

  // Get current sidebar config (page-specific or global)
  const currentSidebarConfig = config.pages[pageId]?.sidebar || config.sidebar || {
    showClock: true,
    showWeather: true,
    showThermostat: true,
    showBranding: true,
    brandingImage: "https://element-connect.co.uk/wp-content/uploads/2024/02/EC-Logo-V2-Trimmed-White.png",
    brandingText: "Powered by",
  };

  const updateSidebarConfig = (updates: Partial<SidebarConfig>) => {
    const newConfig = { ...config };
    
    if (useGlobalSidebar) {
      // Update global sidebar config
      newConfig.sidebar = { 
        ...currentSidebarConfig,
        ...newConfig.sidebar, 
        ...updates 
      } as SidebarConfig;
      // Remove any page-specific sidebar config
      if (newConfig.pages[pageId]?.sidebar) {
        delete newConfig.pages[pageId].sidebar;
      }
    } else {
      // Update page-specific sidebar config
      if (!newConfig.pages[pageId]) {
        return; // Page doesn't exist
      }
      newConfig.pages[pageId].sidebar = { 
        ...currentSidebarConfig, 
        ...updates 
      } as SidebarConfig;
    }
    
    updateConfig(newConfig);
  };

  const toggleSidebarScope = (global: boolean) => {
    setUseGlobalSidebar(global);
    const newConfig = { ...config };
    
    if (global) {
      // Switch to global: remove page-specific config
      if (newConfig.pages[pageId]?.sidebar) {
        delete newConfig.pages[pageId].sidebar;
      }
    } else {
      // Switch to page-specific: copy current config to page
      if (!newConfig.pages[pageId]) {
        return;
      }
      newConfig.pages[pageId].sidebar = { ...currentSidebarConfig };
    }
    
    updateConfig(newConfig);
  };

  const resetSidebarConfig = () => {
    const newConfig = { ...config };
    
    const cleanSidebarConfig = {
      showClock: true,
      showWeather: false,
      showThermostat: false,
      showBranding: true,
      brandingImage: "https://element-connect.co.uk/wp-content/uploads/2024/02/EC-Logo-V2-Trimmed-White.png",
      brandingText: "Powered by",
    };
    
    if (useGlobalSidebar) {
      newConfig.sidebar = cleanSidebarConfig;
      if (newConfig.pages[pageId]?.sidebar) {
        delete newConfig.pages[pageId].sidebar;
      }
    } else {
      if (!newConfig.pages[pageId]) {
        return;
      }
      newConfig.pages[pageId].sidebar = cleanSidebarConfig;
    }
    
    updateConfig(newConfig);
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-theme-text mb-4 flex items-center justify-between">
          Sidebar Configuration
          <button
            onClick={resetSidebarConfig}
            className="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            title="Reset sidebar configuration and clear any invalid entities"
          >
            Reset Config
          </button>
        </h3>
        
        {/* Sidebar Scope Selection */}
        <div className="mb-6 p-4 bg-theme-background rounded-lg border border-theme-border">
          <label className="block text-sm font-medium text-theme-text mb-3">
            Sidebar Scope
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                checked={useGlobalSidebar}
                onChange={() => toggleSidebarScope(true)}
                className="mr-3"
              />
              <div className="flex-1">
                <span className="text-sm text-theme-text font-medium">Global Sidebar</span>
                <p className="text-xs text-theme-text-secondary">Applies to all pages unless overridden</p>
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={!useGlobalSidebar}
                onChange={() => toggleSidebarScope(false)}
                className="mr-3"
              />
              <div className="flex-1">
                <span className="text-sm text-theme-text font-medium">Page-Specific Sidebar</span>
                <p className="text-xs text-theme-text-secondary">Applies only to the &ldquo;{pageId}&rdquo; page</p>
              </div>
            </label>
          </div>
          
          {/* Current Status Indicator */}
          <div className="mt-3 pt-3 border-t border-theme-border">
            <div className="text-xs text-theme-text-secondary">
              Currently editing: <span className="font-medium text-theme-accent">
                {useGlobalSidebar ? 'Global sidebar configuration' : `${pageId} page sidebar configuration`}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Configuration Options */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-text mb-2">
              Thermostat Entity
            </label>
            <input
              type="text"
              value={currentSidebarConfig.thermostat}
              onChange={(e) => updateSidebarConfig({ thermostat: e.target.value as any })}
              placeholder="climate.thermostat"
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text mb-2">
              Weather Entity
            </label>
            <input
              type="text"
              value={currentSidebarConfig.weather}
              onChange={(e) => updateSidebarConfig({ weather: e.target.value as any })}
              placeholder="weather.home"
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text mb-2">
              Branding Image URL
            </label>
            <input
              type="text"
              value={currentSidebarConfig.brandingImage || ''}
              onChange={(e) => updateSidebarConfig({ brandingImage: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text mb-2">
              Branding Text
            </label>
            <input
              type="text"
              value={currentSidebarConfig.brandingText || ''}
              onChange={(e) => updateSidebarConfig({ brandingText: e.target.value })}
              placeholder="Powered by"
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text"
            />
          </div>

          {/* Toggle Options */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={currentSidebarConfig.showClock || false}
                onChange={(e) => updateSidebarConfig({ showClock: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm text-theme-text">Show Clock</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={currentSidebarConfig.showWeather || false}
                onChange={(e) => updateSidebarConfig({ showWeather: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm text-theme-text">Show Weather</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={currentSidebarConfig.showThermostat || false}
                onChange={(e) => updateSidebarConfig({ showThermostat: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm text-theme-text">Show Thermostat</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={currentSidebarConfig.showBranding || false}
                onChange={(e) => updateSidebarConfig({ showBranding: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm text-theme-text">Show Branding</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
