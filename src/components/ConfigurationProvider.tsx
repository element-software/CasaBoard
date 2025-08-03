"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DashboardConfig } from '@/config/dashboard.types';
import { dashboardConfig as defaultConfig } from '@/config/dashboard.config';
import { ConfigurationService } from './Setup/ConfigurationService';

interface ConfigurationContextType {
  config: DashboardConfig;
  updateConfig: (newConfig: DashboardConfig) => void;
  resetConfig: () => void;
  saveConfig: () => string;
  importConfig: (configString: string) => boolean;
  exportConfig: () => string;
}

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export const useConfiguration = (): ConfigurationContextType => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider');
  }
  return context;
};

interface ConfigurationProviderProps {
  children: ReactNode;
}

export const ConfigurationProvider: React.FC<ConfigurationProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<DashboardConfig>(defaultConfig);
  const configService = ConfigurationService.getInstance();

  useEffect(() => {
    // Load configuration from localStorage if available
    try {
      const savedConfig = localStorage.getItem('dashboardConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        if (configService.importConfig(JSON.stringify({ config: parsedConfig }))) {
          setConfig(configService.getCurrentConfig());
        }
      }
    } catch (error) {
      console.warn('Failed to load saved configuration:', error);
    }
  }, [configService]);

  const updateConfig = (newConfig: DashboardConfig) => {
    setConfig(newConfig);
    configService.resetToDefault();
    // Update the service with the new config
    Object.keys(newConfig.pages).forEach(pageId => {
      const page = newConfig.pages[pageId as keyof typeof newConfig.pages];
      if (page && page.layout) {
        configService.updatePageConfig(
          pageId,
          page.layout.components.reduce((acc, comp, index) => {
            acc[`component_${index}`] = comp;
            return acc;
          }, {} as Record<string, any>),
          { columns: page.layout.columns, rows: 10 }
        );
      }
    });
    
    // Save to localStorage
    try {
      localStorage.setItem('dashboardConfig', JSON.stringify(newConfig));
    } catch (error) {
      console.warn('Failed to save configuration to localStorage:', error);
    }
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    configService.resetToDefault();
    try {
      localStorage.removeItem('dashboardConfig');
    } catch (error) {
      console.warn('Failed to remove configuration from localStorage:', error);
    }
  };

  const saveConfig = (): string => {
    return configService.saveConfigToFile();
  };

  const importConfig = (configString: string): boolean => {
    if (configService.importConfig(configString)) {
      const newConfig = configService.getCurrentConfig();
      setConfig(newConfig);
      try {
        localStorage.setItem('dashboardConfig', JSON.stringify(newConfig));
      } catch (error) {
        console.warn('Failed to save imported configuration:', error);
      }
      return true;
    }
    return false;
  };

  const exportConfig = (): string => {
    return configService.exportConfig();
  };

  const value: ConfigurationContextType = {
    config,
    updateConfig,
    resetConfig,
    saveConfig,
    importConfig,
    exportConfig,
  };

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  );
};
