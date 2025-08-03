import { DashboardConfig } from '@/config/dashboard.types';
import { dashboardConfig } from '@/config/dashboard.config';

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
}

export class ConfigurationService {
  private static instance: ConfigurationService;
  private config: DashboardConfig = dashboardConfig;

  static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  getCurrentConfig(): DashboardConfig {
    return this.config;
  }

  updatePageConfig(pageId: string, gridComponents: Record<string, GridComponent>, gridSize: { columns: number; rows: number }): void {
    // Convert grid components to dashboard config format
    const components = Object.values(gridComponents).map(component => {
      const configComponent: any = {
        type: component.type,
        id: component.id,
        icon: component.icon,
      };

      // Add component-specific properties
      if (component.dimmer) configComponent.dimmer = true;
      if (component.temperature) configComponent.temperature = true;
      if (component.color) configComponent.color = true;
      if (component.graphType) configComponent.graphType = component.graphType;
      if (component.colspan) configComponent.colspan = component.colspan;

      return configComponent;
    });

    // Update the configuration
    if (this.config.pages[pageId as keyof typeof this.config.pages]) {
      this.config.pages[pageId as keyof typeof this.config.pages].layout.components = components;
      this.config.pages[pageId as keyof typeof this.config.pages].layout.columns = gridSize.columns;
    }
  }

  saveConfigToFile(): string {
    const configString = `import { DashboardConfig } from "./dashboard.types";

export const dashboardConfig: DashboardConfig = ${JSON.stringify(this.config, null, 2)};`;
    
    return configString;
  }

  exportConfig(): string {
    return JSON.stringify({
      config: this.config,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }

  importConfig(configString: string): boolean {
    try {
      const imported = JSON.parse(configString);
      if (imported.config && this.validateConfig(imported.config)) {
        this.config = imported.config;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import configuration:', error);
      return false;
    }
  }

  private validateConfig(config: any): boolean {
    // Basic validation - check if it has the required structure
    return config && 
           typeof config === 'object' &&
           config.pages &&
           typeof config.pages === 'object' &&
           config.sidebar &&
           config.global;
  }

  resetToDefault(): void {
    this.config = { ...dashboardConfig };
  }

  addNewPage(pageId: string, title: string): void {
    this.config.pages[pageId as keyof typeof this.config.pages] = {
      title: {
        value: title,
        showTitle: true,
      },
      layout: {
        columns: 3,
        gap: 8,
        components: [],
      },
    } as any;
  }

  deletePage(pageId: string): void {
    delete this.config.pages[pageId as keyof typeof this.config.pages];
  }

  updateGlobalSettings(settings: Partial<typeof this.config.global>): void {
    this.config.global = { ...this.config.global, ...settings };
  }

  updateSidebarSettings(settings: any): void {
    this.config.sidebar = { ...this.config.sidebar, ...settings };
  }
}
