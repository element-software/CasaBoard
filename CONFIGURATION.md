# Dashboard Configuration System

This configuration system allows you to easily customize your Home Assistant dashboard without modifying code.

## File Structure

```
src/config/
├── dashboard.types.ts    # TypeScript type definitions
├── dashboard.config.ts   # Your dashboard configuration
└── index.ts             # Exports

src/components/
├── ComponentRenderer.tsx # Renders components based on config
├── DashboardGrid.tsx    # Grid layout component
└── ...

src/app/
├── [page]/page.tsx      # Dynamic page component
├── config/page.tsx      # Configuration editor
└── ...
```

## Configuration Structure

### Basic Entity Configuration
```typescript
{
  type: "light",
  id: "light.living_room" as EntityName,
  icon: "mdiLightbulb",
  dimmer: true,
  temperature: true,
  color: false
}
```

### Sidebar Configuration
```typescript
{
  sidebar: {
    thermostat: "climate.central_heating_and_hot_water_tank_heat",
    weather: "weather.home",
    showClock: true,
    showWeather: true,
    showThermostat: true,
    showBranding: true,
    brandingImage: "https://example.com/logo.png",
    brandingText: "Powered by"
  }
}
```

### Component Types

#### Light
```typescript
{
  type: "light",
  id: EntityName,
  icon: string,
  dimmer?: boolean,      // Show brightness slider
  temperature?: boolean, // Show color temperature slider
  color?: boolean       // Show color picker
}
```

#### Alarm
```typescript
{
  type: "alarm",
  id: EntityName,
  icon: string
}
```

#### Binary Sensor
```typescript
{
  type: "binary_sensor",
  id: EntityName,
  icon: string
}
```

#### Sensor (Graph)
```typescript
{
  type: "sensor",
  id: EntityName,
  icon: string,
  graphType?: "line" | "bar"
}
```

#### Entities Card
```typescript
{
  type: "entities_card",
  title: string,
  entities: EntityConfig[],
  colspan?: number,
  showTitles?: boolean,
  showAllOn?: boolean,
  disableClick?: boolean,
  openTab?: boolean,
  children?: ComponentConfig[]  // Components inside the card
}
```

## Usage

### 1. Edit Configuration
Modify `src/config/dashboard.config.ts` to add/remove/modify components:

```typescript
export const dashboardConfig: DashboardConfig = {
  pages: {
    "living-room": {
      title: "Living Room",
      layout: {
        columns: 3,
        gap: 8,
        components: [
          {
            type: "light",
            id: "light.living_room_main" as EntityName,
            icon: "mdiLightbulb",
            dimmer: true
          },
          // ... more components
        ]
      }
    }
  }
};
```

### 2. Access Pages
- Visit `/living-room` to see your configured page
- Visit `/kitchen` for kitchen page
- Visit `/config` for the configuration editor

### 3. Configuration Editor
The built-in editor at `/config` allows you to:
- **Tabbed Interface**: Separate tabs for Pages, Sidebar, and Global settings
- **Visual Sidebar Editor**: Form-based editor for sidebar configuration with checkboxes and inputs
- Edit configuration in real-time
- Preview changes
- Import/Export configuration to JSON
- Switch between different pages

#### Sidebar Tab Features:
- **Entity Configuration**: Set thermostat and weather entities
- **Visibility Toggles**: Show/hide clock, weather, thermostat, and branding
- **Branding Customization**: Set custom branding text and image URL
- **Real-time Preview**: See changes immediately in the preview pane

## Adding New Component Types

1. **Add type definition** in `dashboard.types.ts`:
```typescript
export interface MyComponentConfig extends EntityConfig {
  type: "my_component";
  customProperty?: boolean;
}
```

2. **Update ComponentConfig union**:
```typescript
export type ComponentConfig = 
  | LightConfig 
  | MyComponentConfig  // Add here
  | ...
```

3. **Add renderer case** in `ComponentRenderer.tsx`:
```typescript
case "my_component":
  const config = config as MyComponentConfig;
  return <MyComponent entityId={config.id} customProperty={config.customProperty} />;
```

## Migration from Hardcoded

To migrate existing hardcoded pages:

1. **Copy entity definitions** from your current page files
2. **Convert to configuration format**:
   ```typescript
   // Old way
   <Light entityId={"light.kitchen" as EntityName} dimmer={true} />
   
   // New way (in config)
   {
     type: "light",
     id: "light.kitchen" as EntityName,
     icon: "mdiLightbulb",
     dimmer: true
   }
   ```
3. **Replace page component** with dynamic version or use `DashboardGrid`

## Benefits

✅ **No code changes** needed for entity modifications  
✅ **Easy sharing** of dashboard layouts  
✅ **Version control** friendly JSON configuration  
✅ **Real-time editing** with preview  
✅ **Type safety** with TypeScript  
✅ **Modular design** - easy to extend
