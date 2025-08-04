"use client";
import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { DroppableGridCell } from './DroppableGridCell';
import { useDragDrop } from './DragDropProvider';
import classNames from 'classnames';

interface GridEditorProps {
  selectedPage: string;
}

export const GridEditor = ({ selectedPage }: GridEditorProps) => {
  const { gridComponents, gridSize, setGridSize, currentPage } = useDragDrop();
  
  // Create grid cells
  const gridCells = useMemo(() => {
    const cells = [];
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.columns; col++) {
        const cellId = `cell-${row}-${col}`;
        cells.push({
          id: cellId,
          row,
          col,
          component: gridComponents[cellId],
        });
      }
    }
    return cells;
  }, [gridSize, gridComponents]);

  // Get current components for display
  const components = Object.values(gridComponents);

  const { setNodeRef } = useDroppable({
    id: 'grid-container',
  });

  return (
    <div className="h-full flex flex-col">
      {/* Grid Controls */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-theme-text">
          Grid Layout - {selectedPage}
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-theme-text">Columns:</label>
            <input
              type="number"
              min="1"
              max="6"
              value={gridSize.columns}
              onChange={(e) => setGridSize({ ...gridSize, columns: parseInt(e.target.value) })}
              className="w-16 px-2 py-1 bg-theme-background border border-theme-border rounded text-theme-text"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-theme-text">Rows:</label>
            <input
              type="number"
              min="1"
              max="8"
              value={gridSize.rows}
              onChange={(e) => setGridSize({ ...gridSize, rows: parseInt(e.target.value) })}
              className="w-16 px-2 py-1 bg-theme-background border border-theme-border rounded text-theme-text"
            />
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div
        ref={setNodeRef}
        className={classNames(
          "flex-1 grid gap-4 p-4 bg-theme-background/50 rounded-lg border-2 border-dashed border-theme-border min-h-96",
          `grid-cols-${gridSize.columns}`
        )}
        style={{
          gridTemplateColumns: `repeat(${gridSize.columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSize.rows}, minmax(120px, 1fr))`,
        }}
      >
        <SortableContext items={gridCells.map(cell => cell.id)} strategy={rectSortingStrategy}>
          {gridCells.map((cell) => (
            <DroppableGridCell
              key={cell.id}
              id={cell.id}
              row={cell.row}
              col={cell.col}
            />
          ))}
        </SortableContext>
      </div>

      {/* Current Components */}
      <div className="mt-6">
        <h3 className="text-md font-medium text-theme-text mb-3">
          Current Components ({components.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
          {components.map((component, index) => (
            <div
              key={index}
              className="p-3 bg-theme-surface rounded-lg border border-theme-border"
            >
              <div className="text-sm font-medium text-theme-text">
                {component.type}
              </div>
              <div className="text-xs text-theme-text-secondary">
                {'id' in component ? component.id : 'Custom component'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
