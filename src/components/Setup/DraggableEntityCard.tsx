"use client";
import { useDraggable } from '@dnd-kit/core';
import Icon from '@mdi/react';
import { mdiDrag, mdiGrid, mdiCards, mdiGauge } from '@mdi/js';
import classNames from 'classnames';
import EntityIcon from '@/components/EntityIcon';

interface DraggableEntityCardProps {
  id: string;
  entity?: any;
  isDragging?: boolean;
  isSpecialComponent?: boolean;
  specialType?: string;
}

const getEntityIcon = (entityId: string, isSpecialComponent?: boolean, specialType?: string) => {
  if (isSpecialComponent && specialType) {
    switch (specialType) {
      case 'custom_grid': return mdiGrid;
      case 'entities_card': return mdiCards;
      default: return mdiGauge;
    }
  }
  
  // Fallback icons only when no entity data is available
  return mdiGauge; // Generic fallback
};

const getEntityType = (entityId: string, isSpecialComponent?: boolean, specialType?: string) => {
  if (isSpecialComponent && specialType) {
    return specialType;
  }
  return entityId.split('.')[0];
};

export const DraggableEntityCard = ({ 
  id, 
  entity, 
  isDragging = false, 
  isSpecialComponent = false, 
  specialType 
}: DraggableEntityCardProps) => {
  const { attributes, listeners, setNodeRef, transform, active } = useDraggable({
    id,
    data: {
      type: isSpecialComponent ? 'special-component' : 'entity',
      entityId: id,
      entityType: getEntityType(id, isSpecialComponent, specialType),
      isSpecialComponent,
      specialType,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const isActive = active?.id === id;
  const friendlyName = isSpecialComponent 
    ? entity?.attributes?.friendly_name || specialType 
    : entity?.attributes?.friendly_name || id.replace(/^[^.]+\./, '').replace(/_/g, ' ');
  const entityType = getEntityType(id, isSpecialComponent, specialType);
  const description = isSpecialComponent ? entity?.attributes?.description : undefined;

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
        
        {/* Use EntityIcon when entity data is available, fallback to basic icon for special components */}
        {isSpecialComponent ? (
          <Icon 
            path={getEntityIcon(id, isSpecialComponent, specialType)} 
            className="h-5 w-5 text-theme-accent" 
          />
        ) : entity ? (
          <EntityIcon 
            entity={entity} 
            size="h-5 w-5"
            className="text-theme-primary"
          />
        ) : (
          <Icon 
            path={getEntityIcon(id, isSpecialComponent, specialType)} 
            className="h-5 w-5 text-theme-primary" 
          />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-theme-text truncate">
            {friendlyName}
          </div>
          <div className="text-xs text-theme-text-secondary">
            {entityType}
          </div>
          {description && (
            <div className="text-xs text-theme-text-secondary opacity-75 truncate">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
