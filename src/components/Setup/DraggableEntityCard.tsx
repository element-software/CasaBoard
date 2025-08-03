"use client";
import { useDraggable } from '@dnd-kit/core';
import Icon from '@mdi/react';
import { mdiLightbulb, mdiGauge, mdiMotionSensor, mdiShieldHome, mdiThermostat, mdiDrag } from '@mdi/js';
import classNames from 'classnames';

interface DraggableEntityCardProps {
  id: string;
  entity?: any;
  isDragging?: boolean;
}

const getEntityIcon = (entityId: string) => {
  if (entityId.startsWith('light.')) return mdiLightbulb;
  if (entityId.startsWith('sensor.')) return mdiGauge;
  if (entityId.startsWith('binary_sensor.')) return mdiMotionSensor;
  if (entityId.startsWith('alarm_control_panel.')) return mdiShieldHome;
  if (entityId.startsWith('climate.')) return mdiThermostat;
  return mdiGauge;
};

const getEntityType = (entityId: string) => {
  return entityId.split('.')[0];
};

export const DraggableEntityCard = ({ id, entity, isDragging = false }: DraggableEntityCardProps) => {
  const { attributes, listeners, setNodeRef, transform, active } = useDraggable({
    id,
    data: {
      type: 'entity',
      entityId: id,
      entityType: getEntityType(id),
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const isActive = active?.id === id;
  const friendlyName = entity?.attributes?.friendly_name || id.replace(/^[^.]+\./, '').replace(/_/g, ' ');
  const entityType = getEntityType(id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classNames(
        "p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all duration-200",
        {
          "bg-theme-surface border-theme-border hover:border-theme-primary": !isDragging && !isActive,
          "bg-theme-primary/20 border-theme-primary shadow-lg": isActive,
          "bg-theme-surface/90 border-theme-border shadow-2xl rotate-3": isDragging,
        }
      )}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-center gap-3">
        <Icon path={mdiDrag} className="h-4 w-4 text-theme-text-secondary" />
        <Icon path={getEntityIcon(id)} className="h-5 w-5 text-theme-primary" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-theme-text truncate">
            {friendlyName}
          </div>
          <div className="text-xs text-theme-text-secondary">
            {entityType}
          </div>
        </div>
      </div>
    </div>
  );
};
