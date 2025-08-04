"use client";
import { useState, useMemo } from 'react';
import { useHass } from '@hakit/core';
import Icon from '@mdi/react';
import { mdiClose, mdiPlus, mdiDelete, mdiLightbulb, mdiGauge, mdiMotionSensor, mdiShieldHome, mdiThermostat, mdiMagnify } from '@mdi/js';
import { getEntityIconName } from '../../utils/entityIcons';

interface EntitySelectorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEntities: Array<{ id: string; icon: string; showState?: boolean; showTitle?: boolean; showLastChanged?: boolean; }>;
  onEntitiesChange: (entities: Array<{ id: string; icon: string; showState?: boolean; showTitle?: boolean; showLastChanged?: boolean; }>) => void;
  title?: string;
}

export const EntitySelectorPopup = ({ 
  isOpen, 
  onClose, 
  selectedEntities, 
  onEntitiesChange,
  title = "Configure Entities"
}: EntitySelectorPopupProps) => {
  const { useStore } = useHass();
  const entities = useStore(state => state.entities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const ENTITY_TYPES = {
    light: { icon: mdiLightbulb, label: 'Lights' },
    sensor: { icon: mdiGauge, label: 'Sensors' },
    binary_sensor: { icon: mdiMotionSensor, label: 'Binary Sensors' },
    alarm_control_panel: { icon: mdiShieldHome, label: 'Alarms' },
    climate: { icon: mdiThermostat, label: 'Climate' },
  } as const;

  const filteredEntities = useMemo(() => {
    if (!entities) return [];

    const entityArray = Object.entries(entities).map(([entityId, entity]) => ({
      id: entityId,
      ...entity,
    }));

    return entityArray.filter(entity => {
      const matchesSearch = entity.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entity.attributes?.friendly_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || entity.id.startsWith(`${selectedType}.`);
      
      return matchesSearch && matchesType;
    });
  }, [entities, searchTerm, selectedType]);

  const handleAddEntity = (entityId: string) => {
    if (selectedEntities.find(e => e.id === entityId)) return;
    
    // Find the full entity object from the entities store
    const entityObj = entities ? entities[entityId] : null;
    
    // Use the new icon detection utility
    const iconName = entityObj ? getEntityIconName(entityObj) : 'mdiGauge';
    
    const newEntity = {
      id: entityId,
      icon: iconName,
      showState: true,
      showTitle: true,
      showLastChanged: false,
    };
    
    onEntitiesChange([...selectedEntities, newEntity]);
  };

  const handleRemoveEntity = (entityId: string) => {
    onEntitiesChange(selectedEntities.filter(e => e.id !== entityId));
  };

  const handleUpdateEntity = (entityId: string, updates: Partial<{ icon: string; showState: boolean; showTitle: boolean; showLastChanged: boolean; }>) => {
    onEntitiesChange(selectedEntities.map(entity => 
      entity.id === entityId 
        ? { ...entity, ...updates }
        : entity
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-theme-background border border-theme-border rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-theme-border">
          <h3 className="text-lg font-semibold text-theme-text">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-surface rounded-lg transition-colors"
          >
            <Icon path={mdiClose} className="h-5 w-5 text-theme-text" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Selected Entities */}
          <div className="w-1/2 border-r border-theme-border p-4 flex flex-col">
            <h4 className="text-md font-medium text-theme-text mb-3">
              Selected Entities ({selectedEntities.length})
            </h4>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {selectedEntities.length > 0 ? (
                selectedEntities.map((entity) => (
                  <div key={entity.id} className="p-3 bg-theme-surface rounded-lg border border-theme-border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-theme-text truncate">{entity.id}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveEntity(entity.id)}
                        className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Icon path={mdiDelete} className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-theme-text-secondary mb-1">
                          Icon
                        </label>
                        <input
                          type="text"
                          value={entity.icon}
                          onChange={(e) => handleUpdateEntity(entity.id, { icon: e.target.value })}
                          placeholder="mdiLightbulb"
                          className="w-full text-xs px-2 py-1 bg-theme-background border border-theme-border rounded"
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <label className="flex items-center text-xs text-theme-text">
                          <input
                            type="checkbox"
                            checked={entity.showState || false}
                            onChange={(e) => handleUpdateEntity(entity.id, { showState: e.target.checked })}
                            className="mr-1"
                          />
                          Show State
                        </label>
                        <label className="flex items-center text-xs text-theme-text">
                          <input
                            type="checkbox"
                            checked={entity.showTitle || false}
                            onChange={(e) => handleUpdateEntity(entity.id, { showTitle: e.target.checked })}
                            className="mr-1"
                          />
                          Show Title
                        </label>
                        <label className="flex items-center text-xs text-theme-text">
                          <input
                            type="checkbox"
                            checked={entity.showLastChanged || false}
                            onChange={(e) => handleUpdateEntity(entity.id, { showLastChanged: e.target.checked })}
                            className="mr-1"
                          />
                          Last Changed
                        </label>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-theme-text-secondary py-8">
                  No entities selected. Add entities from the right panel.
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Add Entities */}
          <div className="w-1/2 p-4 flex flex-col">
            <h4 className="text-md font-medium text-theme-text mb-3">Add Entities</h4>
            
            {/* Search */}
            <div className="relative mb-3">
              <Icon path={mdiMagnify} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-theme-text-secondary" />
              <input
                type="text"
                placeholder="Search entities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text text-sm"
              />
            </div>

            {/* Entity Type Filter */}
            <div className="mb-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text text-sm"
              >
                <option value="all">All Types</option>
                {Object.entries(ENTITY_TYPES).map(([type, config]) => (
                  <option key={type} value={type}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Entity List */}
            <div className="flex-1 overflow-y-auto border border-theme-border rounded-lg">
              {filteredEntities.length > 0 ? (
                filteredEntities.map(entity => {
                  const isSelected = selectedEntities.find(e => e.id === entity.id);
                  return (
                    <div
                      key={entity.id}
                      className={`flex items-center justify-between p-3 border-b border-theme-border last:border-b-0 ${
                        isSelected ? 'bg-theme-accent/10' : 'hover:bg-theme-surface'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-theme-text truncate">{entity.id}</p>
                        <p className="text-xs text-theme-text-secondary truncate">
                          {entity.attributes?.friendly_name || entity.id}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddEntity(entity.id)}
                        disabled={!!isSelected}
                        className={`ml-2 p-2 rounded ${
                          isSelected 
                            ? 'text-theme-text-secondary cursor-not-allowed' 
                            : 'text-theme-accent hover:bg-theme-accent/10'
                        }`}
                      >
                        <Icon path={mdiPlus} className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-theme-text-secondary py-8">
                  No entities found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-theme-border">
          <div className="text-sm text-theme-text-secondary">
            {selectedEntities.length} entities selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-theme-surface text-theme-text rounded-lg hover:opacity-80"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
