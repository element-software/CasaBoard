"use client";
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import Icon from '@mdi/react';
import { mdiPlus, mdiClose, mdiLightbulb, mdiGauge, mdiMotionSensor, mdiShieldHome, mdiThermostat, mdiGrid, mdiCards } from '@mdi/js';
import { useDragDrop } from './DragDropProvider';

interface DroppableGridCellProps {
  id: string;
  row: number;
  col: number;
}

const getIconPath = (iconName?: string) => {
  switch (iconName) {
    case 'mdiLightbulb': return mdiLightbulb;
    case 'mdiGauge': return mdiGauge;
    case 'mdiMotionSensor': return mdiMotionSensor;
    case 'mdiShieldHome': return mdiShieldHome;
    case 'mdiThermostat': return mdiThermostat;
    case 'mdiGrid': return mdiGrid;
    case 'mdiCards': return mdiCards;
    default: return mdiGauge;
  }
};

export const DroppableGridCell = ({ id, row, col }: DroppableGridCellProps) => {
  const { gridComponents, removeComponentFromGrid } = useDragDrop();
  const component = gridComponents[id];
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    data: {
      type: 'grid-cell',
      row,
      col,
      hasComponent: !!component,
    },
  });

  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id,
    data: {
      type: 'grid-cell',
      row,
      col,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeComponentFromGrid(id);
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        setDroppableNodeRef(node);
      }}
      style={style}
      className={classNames(
        "min-h-[120px] rounded-lg border-2 border-dashed transition-all duration-200 flex items-center justify-center relative",
        {
          "border-theme-border bg-theme-surface/30": !isOver && !component,
          "border-theme-primary bg-theme-primary/10": isOver,
          "border-theme-accent bg-theme-surface/50 border-solid": component,
          "opacity-50": isDragging,
        }
      )}
      {...attributes}
    >
      {component ? (
        <>
          {/* Remove button */}
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 h-6 w-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors z-10"
          >
            <Icon path={mdiClose} className="h-3 w-3" />
          </button>
          
          {/* Component preview - draggable area */}
          <div 
            className="w-full h-full p-3 flex flex-col items-center justify-center text-center cursor-move"
            {...listeners}
          >
            <Icon 
              path={getIconPath(component.icon)} 
              className="h-8 w-8 text-theme-primary mb-2" 
            />
            <div className="text-sm font-medium text-theme-text mb-1">
              {component.type}
            </div>
            <div className="text-xs text-theme-text-secondary truncate max-w-full">
              {component.id?.replace(/^[^.]+\./, '').replace(/_/g, ' ') || 'Custom'}
            </div>
            
            {/* Component features */}
            <div className="flex gap-1 mt-2">
              {component.dimmer && (
                <span className="text-xs bg-theme-primary/20 text-theme-primary px-2 py-1 rounded">
                  Dimmer
                </span>
              )}
              {component.temperature && (
                <span className="text-xs bg-theme-accent/20 text-theme-accent px-2 py-1 rounded">
                  Temp
                </span>
              )}
              {component.color && (
                <span className="text-xs bg-theme-secondary/20 text-theme-text px-2 py-1 rounded">
                  Color
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <Icon 
            path={mdiPlus} 
            className={classNames(
              "h-8 w-8 mb-2 mx-auto transition-colors",
              {
                "text-theme-text-secondary": !isOver,
                "text-theme-primary": isOver,
              }
            )} 
          />
          <div className={classNames(
            "text-sm transition-colors",
            {
              "text-theme-text-secondary": !isOver,
              "text-theme-primary": isOver,
            }
          )}>
            {isOver ? 'Drop here' : `${row + 1}, ${col + 1}`}
          </div>
        </div>
      )}
    </div>
  );
};
