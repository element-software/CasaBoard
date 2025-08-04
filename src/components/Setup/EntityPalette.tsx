"use client";
import { useState, useMemo } from 'react';
import { useHass } from '@hakit/core';
import { DraggableEntityCard } from './DraggableEntityCard';
import Icon from '@mdi/react';
import { mdiMagnify, mdiLightbulb, mdiShieldHome, mdiMotionSensor, mdiGauge, mdiThermostat, mdiGrid, mdiCards } from '@mdi/js';

const ENTITY_TYPES = {
  light: { icon: mdiLightbulb, label: 'Lights' },
  sensor: { icon: mdiGauge, label: 'Sensors' },
  binary_sensor: { icon: mdiMotionSensor, label: 'Binary Sensors' },
  alarm_control_panel: { icon: mdiShieldHome, label: 'Alarms' },
  climate: { icon: mdiThermostat, label: 'Climate' },
} as const;

const SPECIAL_COMPONENTS = {
  custom_grid: { icon: mdiGrid, label: 'Custom Grid', description: 'Grid container for multiple entities' },
  entities_card: { icon: mdiCards, label: 'Entities Card', description: 'Card container for grouped entities' },
} as const;

export const EntityPalette = () => {
  const { useStore } = useHass();
  const entities = useStore(state => state.entities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

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

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-theme-text mb-4">Entity Palette</h2>
      
      {/* Search */}
      <div className="relative mb-4">
        <Icon path={mdiMagnify} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-theme-text-secondary" />
        <input
          type="text"
          placeholder="Search entities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text placeholder-theme-text-secondary"
        />
      </div>

      {/* Entity Type Filter */}
      <div className="mb-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text"
        >
          <option value="all">All Types</option>
          <option value="special">Special Components</option>
          {Object.entries(ENTITY_TYPES).map(([type, config]) => (
            <option key={type} value={type}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {/* Special Components Section */}
      {(selectedType === 'all' || selectedType === 'special') && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-theme-text mb-2">Special Components</h3>
          <div className="space-y-2">
            {Object.entries(SPECIAL_COMPONENTS).map(([type, config]) => (
              <DraggableEntityCard
                key={`special-${type}`}
                id={`special-${type}`}
                entity={{
                  id: `special.${type}`,
                  entity_id: `special.${type}`,
                  state: 'available',
                  attributes: {
                    friendly_name: config.label,
                    description: config.description,
                  },
                  last_changed: new Date().toISOString(),
                  last_updated: new Date().toISOString(),
                  context: { id: '', parent_id: null, user_id: null },
                }}
                isSpecialComponent={true}
                specialType={type}
              />
            ))}
          </div>
        </div>
      )}

      {/* Entity List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {selectedType !== 'special' && filteredEntities.map(entity => (
          <DraggableEntityCard
            key={entity.id}
            id={entity.id}
            entity={entity}
          />
        ))}
        
        {selectedType !== 'special' && filteredEntities.length === 0 && (
          <div className="text-center text-theme-text-secondary py-8">
            No entities found
          </div>
        )}
      </div>

      {/* Entity Count */}
      <div className="mt-4 text-sm text-theme-text-secondary">
        {selectedType === 'special' 
          ? `${Object.keys(SPECIAL_COMPONENTS).length} special components`
          : selectedType === 'all'
          ? `${filteredEntities.length} entities + ${Object.keys(SPECIAL_COMPONENTS).length} special components`
          : `${filteredEntities.length} entities found`
        }
      </div>
    </div>
  );
};
