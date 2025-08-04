"use client";
import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { ConfigurationService } from './ConfigurationService';
import { useConfiguration } from '../ConfigurationProvider';
import { HistoryManager } from './HistoryManager';

interface GridComponent {
  type: string;
  id?: string;
  icon?: string;
  dimmer?: boolean;
  temperature?: boolean;
  color?: boolean;
  position?: { row: number; col: number };
  colspan?: number;
  graphType?: string;
  // Special component properties
  gridCols?: number;
  className?: string;
  title?: string;
  entities?: Array<{
    id: string;
    icon: string;
    showState?: boolean;
    showTitle?: boolean;
    showLastChanged?: boolean;
  }>;
  children?: any[];
  showTitles?: boolean;
  showLastChanged?: boolean;
  showAllOn?: boolean;
  disableClick?: boolean;
  openTab?: boolean;
}

interface DragDropContextType {
  activeId: string | null;
  gridComponents: Record<string, GridComponent>;
  gridSize: { columns: number; rows: number };
  currentPage: string;
  setActiveId: (id: string | null) => void;
  setGridSize: (size: { columns: number; rows: number }) => void;
  setCurrentPage: (page: string) => void;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  addComponentToGrid: (cellId: string, component: GridComponent) => void;
  removeComponentFromGrid: (cellId: string) => void;
  updateComponent: (cellId: string, updates: Partial<GridComponent>) => void;
  exportConfig: () => string;
  importConfig: (config: string) => boolean;
  saveToFile: () => void;
  loadFromCurrentConfig: (pageId: string) => void;
  applyToLiveDashboard: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isApplyingChanges: boolean;
  lastUpdateTime: Date | null;
}

const DragDropContext = createContext<DragDropContextType | null>(null);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider = ({ children }: DragDropProviderProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [gridComponents, setGridComponents] = useState<Record<string, GridComponent>>({});
  const [gridSize, setGridSize] = useState({ columns: 3, rows: 4 });
  const [currentPage, setCurrentPage] = useState('kitchen');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isApplyingChanges, setIsApplyingChanges] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const configService = ConfigurationService.getInstance();
  const { config, updateConfig } = useConfiguration();
  const historyManager = useRef(new HistoryManager());

  // Define loadFromCurrentConfig early so it can be used in useEffects
  const loadFromCurrentConfig = useCallback((pageId: string) => {
    const config = configService.getCurrentConfig();
    const pageConfig = config.pages[pageId as keyof typeof config.pages];
    
    if (pageConfig) {
      // Convert existing components to grid format
      const convertedComponents: Record<string, GridComponent> = {};
      
      pageConfig.layout.components.forEach((component: any, index: number) => {
        const row = Math.floor(index / pageConfig.layout.columns);
        const col = index % pageConfig.layout.columns;
        const cellId = `cell-${row}-${col}`;
        
        convertedComponents[cellId] = {
          type: component.type,
          id: component.id,
          icon: component.icon,
          dimmer: component.dimmer,
          temperature: component.temperature,
          color: component.color,
          colspan: component.colspan,
          graphType: component.graphType,
          position: { row, col },
          // Special component properties
          gridCols: component.gridCols,
          className: component.className,
          title: component.title,
          entities: component.entities || [],
          children: component.children || [],
          showTitles: component.showTitles,
          showLastChanged: component.showLastChanged,
          showAllOn: component.showAllOn,
          disableClick: component.disableClick,
          openTab: component.openTab,
        };
      });
      
      setGridComponents(convertedComponents);
      setGridSize({
        columns: pageConfig.layout.columns,
        rows: Math.max(4, Math.ceil(pageConfig.layout.components.length / pageConfig.layout.columns)),
      });
    }
    
    setCurrentPage(pageId);
  }, [configService]);

  // Initialize setup editor with current configuration
  // This effect is removed since initialization is now handled in the localStorage effect
  // useEffect(() => {
  //   if (!isInitialized) {
  //     loadFromCurrentConfig(currentPage);
  //     setIsInitialized(true);
  //   }
  // }, [isInitialized, currentPage, loadFromCurrentConfig]);

  // Save setup state to localStorage
  useEffect(() => {
    if (isInitialized) {
      const setupState = {
        gridComponents,
        gridSize,
        currentPage,
        timestamp: Date.now()
      };
      localStorage.setItem('dashboardSetupState', JSON.stringify(setupState));
    }
  }, [gridComponents, gridSize, currentPage, isInitialized]);

  // Load setup state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('dashboardSetupState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Only restore if it's relatively recent (within 24 hours)
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setGridComponents(parsed.gridComponents || {});
          setGridSize(parsed.gridSize || { columns: 3, rows: 4 });
          setCurrentPage(parsed.currentPage || 'kitchen');
          setIsInitialized(true);
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to load setup state from localStorage:', error);
    }
    
    // If no valid localStorage state, load from current config
    loadFromCurrentConfig(currentPage);
    setIsInitialized(true);
  }, [loadFromCurrentConfig, currentPage]);

  // Save state to history when components change
  const saveToHistory = useCallback(() => {
    historyManager.current.pushState({
      gridComponents,
      gridSize,
      currentPage,
    });
    setCanUndo(historyManager.current.canUndo());
    setCanRedo(historyManager.current.canRedo());
  }, [gridComponents, gridSize, currentPage]);

  // Update undo/redo state
  const updateHistoryState = useCallback(() => {
    setCanUndo(historyManager.current.canUndo());
    setCanRedo(historyManager.current.canRedo());
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !over.data.current) {
      setActiveId(null);
      return;
    }

    // Handle reordering existing grid components
    if (active.data.current?.type === 'grid-cell' && over.data.current.type === 'grid-cell') {
      const activeId = active.id as string;
      const overId = over.id as string;
      
      if (activeId !== overId) {
        saveToHistory(); // Save current state before making changes
        
        setGridComponents(prev => {
          const newComponents = { ...prev };
          
          // Get the component being moved
          const movingComponent = newComponents[activeId];
          
          // If there's a component at the target location, swap them
          if (newComponents[overId]) {
            const targetComponent = newComponents[overId];
            newComponents[activeId] = {
              ...targetComponent,
              position: { row: over.data.current!.row, col: over.data.current!.col }
            };
          } else {
            // Target is empty, just remove from source
            delete newComponents[activeId];
          }
          
          // Place the moving component at the target
          if (movingComponent) {
            newComponents[overId] = {
              ...movingComponent,
              position: { row: over.data.current!.row, col: over.data.current!.col }
            };
          }
          
          return newComponents;
        });
      }
    }
    // Handle dropping entity onto grid cell
    else if (active.data.current?.type === 'entity' && over.data.current.type === 'grid-cell') {
      const entityId = active.data.current.entityId;
      const entityType = active.data.current.entityType;
      const cellId = over.id as string;

      saveToHistory(); // Save current state before making changes

      const newComponent: GridComponent = {
        type: entityType,
        id: entityId,
        icon: getDefaultIcon(entityType),
        position: {
          row: over.data.current.row,
          col: over.data.current.col,
        },
      };

      // Add entity-specific defaults
      if (entityType === 'light') {
        newComponent.dimmer = true;
      }
      if (entityType === 'sensor') {
        newComponent.graphType = 'line';
      }

      setGridComponents(prev => ({
        ...prev,
        [cellId]: newComponent,
      }));
    }
    // Handle dropping special component onto grid cell
    else if (active.data.current?.type === 'special-component' && over.data.current.type === 'grid-cell') {
      const specialType = active.data.current.specialType;
      const cellId = over.id as string;

      saveToHistory(); // Save current state before making changes

      const newComponent: GridComponent = {
        type: specialType,
        icon: getDefaultIcon(specialType),
        position: {
          row: over.data.current.row,
          col: over.data.current.col,
        },
      };

      // Add special component defaults
      if (specialType === 'custom_grid') {
        newComponent.gridCols = 2;
      }
      if (specialType === 'entities_card') {
        newComponent.colspan = 1;
      }

      setGridComponents(prev => ({
        ...prev,
        [cellId]: newComponent,
      }));
    }

    setActiveId(null);
  }, [saveToHistory]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Handle drag over logic for visual feedback
  }, []);

  const addComponentToGrid = useCallback((cellId: string, component: GridComponent) => {
    saveToHistory(); // Save current state before making changes
    setGridComponents(prev => ({
      ...prev,
      [cellId]: component,
    }));
  }, [saveToHistory]);

  const removeComponentFromGrid = useCallback((cellId: string) => {
    saveToHistory(); // Save current state before making changes
    setGridComponents(prev => {
      const newComponents = { ...prev };
      delete newComponents[cellId];
      return newComponents;
    });
  }, [saveToHistory]);

  const updateComponent = useCallback((cellId: string, updates: Partial<GridComponent>) => {
    saveToHistory(); // Save current state before making changes
    setGridComponents(prev => ({
      ...prev,
      [cellId]: {
        ...prev[cellId],
        ...updates,
      },
    }));
  }, [saveToHistory]);

  const exportConfig = useCallback(() => {
    const config = {
      gridComponents,
      gridSize,
      currentPage,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(config, null, 2);
  }, [gridComponents, gridSize, currentPage]);

  const importConfig = useCallback((configString: string): boolean => {
    try {
      const config = JSON.parse(configString);
      if (config.gridComponents) {
        setGridComponents(config.gridComponents);
      }
      if (config.gridSize) {
        setGridSize(config.gridSize);
      }
      if (config.currentPage) {
        setCurrentPage(config.currentPage);
      }
      return true;
    } catch (error) {
      console.error('Failed to import config:', error);
      return false;
    }
  }, []);

  const saveToFile = useCallback(() => {
    // Update the configuration service with current grid
    configService.updatePageConfig(currentPage, gridComponents, gridSize);
    
    // Generate the updated config file content
    const configFileContent = configService.saveConfigToFile();
    
    // Download the file
    const blob = new Blob([configFileContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard.config.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    console.log('Configuration saved to dashboard.config.ts');
  }, [currentPage, gridComponents, gridSize, configService]);

  const applyToLiveDashboard = useCallback(async () => {
    setIsApplyingChanges(true);
    
    try {
      // Update the configuration service with current grid
      configService.updatePageConfig(currentPage, gridComponents, gridSize);
      
      // Get the updated config and apply to live dashboard
      const updatedConfig = configService.getCurrentConfig();
      updateConfig(updatedConfig);
      
      setLastUpdateTime(new Date());
      console.log(`Applied changes to live dashboard for page: ${currentPage}`);
    } catch (error) {
      console.error('Failed to apply changes to live dashboard:', error);
    } finally {
      setIsApplyingChanges(false);
    }
  }, [currentPage, gridComponents, gridSize, configService, updateConfig]);

  const undo = useCallback(() => {
    const previousState = historyManager.current.undo();
    if (previousState) {
      setGridComponents(previousState.gridComponents);
      setGridSize(previousState.gridSize);
      setCurrentPage(previousState.currentPage);
      updateHistoryState();
    }
  }, [updateHistoryState]);

  const redo = useCallback(() => {
    const nextState = historyManager.current.redo();
    if (nextState) {
      setGridComponents(nextState.gridComponents);
      setGridSize(nextState.gridSize);
      setCurrentPage(nextState.currentPage);
      updateHistoryState();
    }
  }, [updateHistoryState]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      } else if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
        event.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Auto-apply changes to live dashboard when grid components change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      applyToLiveDashboard();
    }, 1000); // Debounce for 1 second to avoid too many updates

    return () => clearTimeout(debounceTimer);
  }, [gridComponents, gridSize, applyToLiveDashboard]);

  return (
    <DragDropContext.Provider
      value={{
        activeId,
        gridComponents,
        gridSize,
        currentPage,
        setActiveId,
        setGridSize,
        setCurrentPage,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        addComponentToGrid,
        removeComponentFromGrid,
        updateComponent,
        exportConfig,
        importConfig,
        saveToFile,
        loadFromCurrentConfig,
        applyToLiveDashboard,
        undo,
        redo,
        canUndo,
        canRedo,
        isApplyingChanges,
        lastUpdateTime,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};

const getDefaultIcon = (entityType: string) => {
  switch (entityType) {
    case 'light': return 'mdiLightbulb';
    case 'sensor': return 'mdiGauge';
    case 'binary_sensor': return 'mdiMotionSensor';
    case 'alarm_control_panel': return 'mdiShieldHome';
    case 'climate': return 'mdiThermostat';
    case 'custom_grid': return 'mdiGrid';
    case 'entities_card': return 'mdiCards';
    default: return 'mdiHelpCircle';
  }
};
