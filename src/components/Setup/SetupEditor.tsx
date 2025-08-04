"use client";
import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useDragDrop } from './DragDropProvider';
import { EntityPalette } from './EntityPalette';
import { GridEditor } from './GridEditor';
import { ConfigPanel } from './ConfigPanel';
import { DraggableEntityCard } from './DraggableEntityCard';
import { SetupNavigation } from './SetupNavigation';

export const SetupEditor = () => {
  const { activeId, handleDragStart, handleDragEnd, handleDragOver, currentPage } = useDragDrop();

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex flex-col h-screen">
        {/* Navigation Bar */}
        <SetupNavigation />
        
        <div className="flex h-full">
          {/* Left Sidebar - Entity Palette */}
          <div className="w-80 bg-theme-surface border-r border-theme-border overflow-y-auto">
            <EntityPalette />
          </div>

          {/* Main Grid Editor */}
          <div className="flex-1 flex flex-col">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              <GridEditor selectedPage={currentPage} />
            </div>
          </div>

          {/* Right Sidebar - Config Panel */}
          <div className="w-80 bg-theme-surface border-l border-theme-border overflow-y-auto">
            <ConfigPanel />
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId ? <DraggableEntityCard id={activeId} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
};
