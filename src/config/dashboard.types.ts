import { EntityName } from "@hakit/core";

export interface EntityConfig {
  id: EntityName;
  icon: string;
  name?: string;
}

export interface LightConfig extends EntityConfig {
  type: "light";
  dimmer?: boolean;
  temperature?: boolean;
  color?: boolean;
}

export interface AlarmConfig extends EntityConfig {
  type: "alarm";
}

export interface BinarySensorConfig extends EntityConfig {
  type: "binary_sensor";
}

export interface SensorConfig extends EntityConfig {
  type: "sensor";
  graphType?: "line" | "bar";
}

export interface EntitiesCardConfig {
  type: "entities_card";
  title: string;
  entities: EntityConfig[];
  colspan?: number;
  showTitles?: boolean;
  showLastChanged?: boolean;
  showAllOn?: boolean;
  disableClick?: boolean;
  openTab?: boolean;
  children?: ComponentConfig[];
}

export interface PopupConfig {
  type: "popup";
  title: string;
  triggerComponent: ComponentConfig;
  children: ComponentConfig[];
  className?: string;
}

export interface CustomGridConfig {
  type: "custom_grid";
  title?: string;
  className?: string;
  gridCols?: number;
  entities: Array<{
    id: EntityName;
    icon: string;
    showState?: boolean;
    showTitle?: boolean;
    showLastChanged?: boolean;
  }>;
  children?: ComponentConfig[];
}

export type ComponentConfig = 
  | LightConfig 
  | AlarmConfig 
  | BinarySensorConfig 
  | SensorConfig 
  | EntitiesCardConfig 
  | CustomGridConfig
  | PopupConfig;

export interface GridConfig {
  columns: number;
  gap: number;
  components: ComponentConfig[];
}

export interface PageTitleConfig {
  value: string;
  showTitle: boolean;
}

export interface PageConfig {
  title: PageTitleConfig;
  layout: GridConfig;
}

export interface SidebarConfig {
  thermostat: EntityName;
  weather: EntityName;
  showClock?: boolean;
  showWeather?: boolean;
  showThermostat?: boolean;
  showBranding?: boolean;
  brandingImage?: string;
  brandingText?: string;
}

export interface DashboardConfig {
  pages: Record<string, PageConfig>;
  sidebar?: SidebarConfig;
  global?: {
    theme?: string;
    defaultIcons?: Record<string, string>;
  };
}
