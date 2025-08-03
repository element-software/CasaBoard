"use client";
import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiCog, mdiPalette, mdiGrid, mdiDownload, mdiUpload, mdiEye, mdiRocket, mdiUndo, mdiRedo } from '@mdi/js';
import { useDragDrop } from './DragDropProvider';
import { LiveStatusIndicator } from './LiveStatusIndicator';

export const ConfigPanel = () => {
  const [activeTab, setActiveTab] = useState<'component' | 'page' | 'global'>('component');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const { gridComponents, updateComponent, exportConfig, importConfig, applyToLiveDashboard, saveToFile, currentPage, undo, redo, canUndo, canRedo, isApplyingChanges, lastUpdateTime } = useDragDrop();

  const tabs = [
    { id: 'component', label: 'Component', icon: mdiCog },
    { id: 'page', label: 'Page', icon: mdiGrid },
    { id: 'global', label: 'Global', icon: mdiPalette },
  ] as const;

  const handleExport = () => {
    const config = exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importConfig(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-theme-text mb-4">Configuration</h2>
      
      {/* Tab Navigation */}
      <div className="flex mb-4 bg-theme-background rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors text-sm ${
              activeTab === tab.id
                ? 'bg-theme-primary text-black'
                : 'text-theme-text-secondary hover:text-theme-text'
            }`}
          >
            <Icon path={tab.icon} className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'component' && (
          <ComponentConfig 
            gridComponents={gridComponents}
            selectedComponent={selectedComponent}
            setSelectedComponent={setSelectedComponent}
            updateComponent={updateComponent}
          />
        )}
        
        {activeTab === 'page' && (
          <PageConfig />
        )}
        
        {activeTab === 'global' && (
          <GlobalConfig />
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 space-y-2">
        {/* Undo/Redo */}
        <div className="flex gap-2">
          <button 
            onClick={undo}
            disabled={!canUndo}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-theme-surface text-theme-text rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Icon path={mdiUndo} className="h-4 w-4" />
            Undo
          </button>
          <button 
            onClick={redo}
            disabled={!canRedo}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-theme-surface text-theme-text rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Icon path={mdiRedo} className="h-4 w-4" />
            Redo
          </button>
        </div>

        <div className="p-3 bg-theme-surface rounded-lg border border-theme-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon path={mdiEye} className="h-4 w-4 text-theme-accent" />
            <span className="text-sm font-medium text-theme-text">Live Preview</span>
          </div>
          
          <LiveStatusIndicator 
            isUpdating={isApplyingChanges}
            lastUpdateTime={lastUpdateTime || undefined}
            className="mb-3"
          />
          
          <p className="text-xs text-theme-text-secondary mb-3">
            Changes are automatically applied to the live dashboard. View your page to see updates in real-time.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={applyToLiveDashboard}
              disabled={isApplyingChanges}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-theme-accent text-black rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Icon path={mdiRocket} className="h-4 w-4" />
              Apply Now
            </button>
            <a 
              href={`/${currentPage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-theme-primary text-black rounded-lg hover:opacity-80 text-sm"
            >
              <Icon path={mdiEye} className="h-4 w-4" />
              View Page
            </a>
          </div>
        </div>

        <button 
          onClick={saveToFile}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-theme-secondary text-theme-text rounded-lg hover:opacity-80"
        >
          <Icon path={mdiDownload} className="h-4 w-4" />
          Save Config File
        </button>
        
        <button 
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-theme-accent text-black rounded-lg hover:opacity-80"
        >
          <Icon path={mdiDownload} className="h-4 w-4" />
          Export Config JSON
        </button>
        
        <label className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-theme-secondary text-theme-text rounded-lg hover:opacity-80 cursor-pointer">
          <Icon path={mdiUpload} className="h-4 w-4" />
          Import Config
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

const ComponentConfig = ({ 
  gridComponents, 
  selectedComponent, 
  setSelectedComponent, 
  updateComponent 
}: { 
  gridComponents: any;
  selectedComponent: string | null;
  setSelectedComponent: (id: string | null) => void;
  updateComponent: (cellId: string, updates: any) => void;
}) => {
  const component = selectedComponent ? gridComponents[selectedComponent] : null;

  return (
    <div className="space-y-4">
      {/* Component Selector */}
      <div>
        <label className="block text-sm font-medium text-theme-text mb-2">
          Select Component
        </label>
        <select
          value={selectedComponent || ''}
          onChange={(e) => setSelectedComponent(e.target.value || null)}
          className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text"
        >
          <option value="">Select a component...</option>
          {Object.keys(gridComponents).map(cellId => (
            <option key={cellId} value={cellId}>
              {gridComponents[cellId]?.id || `Cell ${cellId}`}
            </option>
          ))}
        </select>
      </div>

      {component ? (
        <>
          <div>
            <label className="block text-sm font-medium text-theme-text mb-2">
              Component Type
            </label>
            <input
              type="text"
              value={component.type}
              readOnly
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text opacity-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-theme-text mb-2">
              Entity ID
            </label>
            <input
              type="text"
              value={component.id || ''}
              onChange={(e) => updateComponent(selectedComponent!, { id: e.target.value })}
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-theme-text mb-2">
              Icon
            </label>
            <input
              type="text"
              value={component.icon || ''}
              onChange={(e) => updateComponent(selectedComponent!, { icon: e.target.value })}
              placeholder="mdiLightbulb"
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={component.dimmer || false}
                onChange={(e) => updateComponent(selectedComponent!, { dimmer: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm text-theme-text">Enable Dimmer</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={component.temperature || false}
                onChange={(e) => updateComponent(selectedComponent!, { temperature: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm text-theme-text">Temperature Control</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={component.color || false}
                onChange={(e) => updateComponent(selectedComponent!, { color: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm text-theme-text">Color Control</label>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-theme-text-secondary py-8">
          {Object.keys(gridComponents).length === 0 
            ? 'No components in grid. Drag entities from the palette to get started.'
            : 'Select a component to configure'
          }
        </div>
      )}
    </div>
  );
};

const PageConfig = () => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-theme-text mb-2">
          Page Title
        </label>
        <input
          type="text"
          placeholder="Page Title"
          className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text"
        />
      </div>
      
      <div className="flex items-center">
        <input type="checkbox" className="mr-2" />
        <label className="text-sm text-theme-text">Show Title</label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-theme-text mb-2">
          Grid Columns
        </label>
        <input
          type="number"
          min="1"
          max="6"
          defaultValue="3"
          className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-theme-text mb-2">
          Grid Gap
        </label>
        <input
          type="number"
          min="0"
          max="20"
          defaultValue="8"
          className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text"
        />
      </div>
    </div>
  );
};

const GlobalConfig = () => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-theme-text mb-2">
          Default Theme
        </label>
        <select className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
          <option value="green">Green</option>
          <option value="amber">Amber</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <input type="checkbox" defaultChecked className="mr-2" />
        <label className="text-sm text-theme-text">Enable Theme Switch</label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-theme-text mb-2">
          Default Light Icon
        </label>
        <input
          type="text"
          defaultValue="mdiLightbulb"
          className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-theme-text mb-2">
          Default Sensor Icon
        </label>
        <input
          type="text"
          defaultValue="mdiGauge"
          className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text"
        />
      </div>
    </div>
  );
};
