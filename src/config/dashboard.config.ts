import { DashboardConfig } from "./dashboard.types";

export const dashboardConfig: DashboardConfig = {
  pages: {
    kitchen: {
      title: {
        value: "Kitchen",
        showTitle: false,
      },
      layout: {
        columns: 3,
        gap: 8,
        components: [
          {
            type: "light",
            id: "light.office_downlights_dimmer",
            icon: "mdiLightbulb",
            dimmer: true,
          },
          {
            type: "light",
            id: "light.focus_light",
            icon: "mdiLamp",
            dimmer: true,
          },
          {
            type: "light",
            id: "light.living_room_downlights",
            icon: "mdiCeiling",
            dimmer: true,
          },
          {
            type: "light",
            id: "light.kitchen_downlights",
            icon: "mdiLightbulb",
          },
          {
            type: "light",
            id: "light.utility_room",
            icon: "mdiLightbulb",
          },
          {
            type: "sensor",
            id: "sensor.whole_home_energy_usage",
            icon: "mdiFlash",
            graphType: "line",
          },
          {
            type: "entities_card",
            title: "Media Wall",
            openTab: true,
            colspan: 1,
            columns: 3,
            showTitles: true,
            showAllOn: true,
            entities: [
              {
                id: "light.kitchen_projector_wall_middle_left",
                icon: "mdiLedStripVariant",
              },
              {
                id: "light.kitchen_projector_wall_middle_right",
                icon: "mdiLedStripVariant",
              },
              {
                id: "light.kitchen_projector_wall_sides",
                icon: "mdiLedStripVariant",
              },
            ],
            children: [
              {
                type: "light",
                id: "light.kitchen_projector_wall_middle_left",
                icon: "mdiLedStripVariant",
              },
              {
                type: "light",
                id: "light.kitchen_projector_wall_middle_right",
                icon: "mdiLedStripVariant",
              },
              {
                type: "light",
                id: "light.kitchen_projector_wall_sides",
                icon: "mdiLedStripVariant",
              },
            ],
          },
          {
            type: "entities_card",
            title: "Ambient Lighting",
            openTab: true,
            colspan: 2,
            showTitles: true,
            showAllOn: true,
            entities: [
              {
                id: "light.wall_cabinet_lighting",
                icon: "mdiLedStripVariant",
              },
              {
                id: "light.under_worktop_lighting",
                icon: "mdiCountertop",
              },
              {
                id: "light.oven_tower_lighting",
                icon: "mdiToasterOven",
              },
              {
                id: "light.island_stone",
                icon: "mdiDiamondStone",
              },
              {
                id: "light.island_drawers",
                icon: "mdiFileCabinet",
              },
            ],
            children: [
              {
                type: "light",
                id: "light.focus_light",
                icon: "mdiLamp",
                dimmer: true,
                temperature: true,
              },
              {
                type: "light",
                id: "light.wall_cabinet_lighting",
                icon: "mdiLedStripVariant",
                dimmer: true,
                temperature: true,
                color: true,
              },
            ],
          },
          {
            type: "entities_card",
            title: "Sensors",
            colspan: 2,
            showTitles: true,
            disableClick: true,
            entities: [
              {
                id: "binary_sensor.front_door_sensor_contact",
                icon: "mdiDoor",
              },
              {
                id: "binary_sensor.bathroom_window_sensor_contact",
                icon: "mdiDoor",
              },
              {
                id: "binary_sensor.loft_access_door_contact",
                icon: "mdiDoor",
              },
              {
                id: "binary_sensor.gate_door_contact",
                icon: "mdiDoor",
              },
              {
                id: "binary_sensor.downstairs_toilet_door_sensor_contact",
                icon: "mdiDoor",
              },
            ],
          },
          {
            type: "light",
            id: "light.kitchen_wall_panel_led_strips",
            icon: "mdiLedStripVariant",
          },
        ],
      },
    },
    upstairs: {
      title: {
        value: "Upstairs",
        showTitle: false,
      },
      layout: {
        columns: 3,
        gap: 8,
        components: [
          {
            type: "custom_grid",
            gridCols: 2,
            className: "grid-rows-2",
            entities: [],
            children: [
              {
                type: "alarm",
                id: "alarm_control_panel.94_headland_rd_leicester",
                icon: "mdiShieldHome",
              },
              {
                type: "binary_sensor",
                id: "binary_sensor.front_door_sensor_contact",
                icon: "mdiDoor",
              },
            ],
          },
          {
            type: "light",
            id: "light.living_room_downlights",
            icon: "mdiCeiling",
            dimmer: true,
          },
          {
            type: "light",
            id: "light.bedroom_ceiling_fan_lights",
            icon: "mdiCeilingFan",
          },
          {
            type: "light",
            id: "light.baby_room_light",
            icon: "mdiLightbulb",
          },
          {
            type: "light",
            id: "light.guest_bedroom",
            icon: "mdiLightbulb",
          },
          {
            type: "light",
            id: "light.upstairs_hallway_light",
            icon: "mdiLightbulb",
          },
          {
            type: "light",
            id: "light.kitchen_downlights",
            icon: "mdiLightbulb",
          },
          {
            type: "sensor",
            id: "sensor.whole_home_energy_usage",
            icon: "mdiFlash",
            graphType: "line",
          },
          {
            type: "custom_grid",
            gridCols: 3,
            entities: [
              {
                id: "binary_sensor.dishwasher",
                icon: "mdiDishwasher",
                showState: true,
                showTitle: true,
                showLastChanged: true,
              },
              {
                id: "binary_sensor.dryer",
                icon: "mdiTumbleDryer",
                showState: true,
                showTitle: true,
                showLastChanged: true,
              },
              {
                id: "binary_sensor.washing_machine",
                icon: "mdiWashingMachine",
                showState: true,
                showTitle: true,
                showLastChanged: true,
              },
            ],
          },
          {
            type: "entities_card",
            title: "Sensors",
            colspan: 3,
            showTitles: true,
            showLastChanged: true,
            disableClick: true,
            entities: [
              {
                id: "binary_sensor.front_door_sensor_contact",
                icon: "mdiDoor",
              },
              {
                id: "binary_sensor.bathroom_window_sensor_contact",
                icon: "mdiDoor",
              },
              {
                id: "binary_sensor.gate_door_contact",
                icon: "mdiDoor",
              },
              {
                id: "binary_sensor.kitchen_entrance_motion_occupancy",
                icon: "mdiMotionSensor",
              },
              {
                id: "binary_sensor.konnected_d0e418_zone_3",
                icon: "mdiMotionSensor",
              },
              {
                id: "binary_sensor.office_presence_one_occupancy",
                icon: "mdiMotionSensor",
              },
            ],
          },
        ],
      },
    },
  },
  sidebar: {
    thermostat: "climate.central_heating_and_hot_water_tank_heat",
    weather: "weather.home",
    showClock: true,
    showWeather: true,
    showThermostat: true,
    showBranding: true,
    brandingImage: "https://element-connect.co.uk/wp-content/uploads/2024/02/EC-Logo-V2-Trimmed-White.png",
    brandingText: "Powered by",
  },
  global: {
    theme: "dark",
    enableThemeSwitch: true,
    defaultIcons: {
      light: "mdiLightbulb",
      alarm: "mdiShieldHome",
      binary_sensor: "mdiSensorOn",
      sensor: "mdiGauge",
    },
  },
};
