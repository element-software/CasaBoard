"use client";
import { LightConfig } from "@repo/ui/components/Light/Light.config";
import { AlarmConfig } from "@repo/ui/components/Alarm/Alarm.config";
import { BinarySensorConfig } from "@repo/ui/components/BinarySensor/BinarySensor.config";
import { EntitiesCardConfig } from "@repo/ui/components/EntitiesCard/EntitiesCard.config";
import { GraphCardConfig } from "@repo/ui/components/GraphCard/GraphCard.config";
import { ClockConfig } from "@repo/ui/components/Clock/Clock.config";
import { Config } from "@measured/puck";
import { GridConfig } from "@repo/ui/components/Grid/Grid.config";
import { NewLightConfig } from "@repo/ui/components/Light/newLight.config";

type Components = {
  Light: {},
  // Alarm: {},
  // BinarySensor: {},
  // EntitiesCard: {},
  // GraphCard: {},
  // Clock: {},
  // Grid: {},
}

// Puck component configuration
export const PuckConfig: Config<Components> = {
  root: {
    render: (props: any) => (
      <div className="w-full mx-auto">{props.children}</div>
    ),
  },
  components: {
    //Light: NewLightConfig,
     Light: LightConfig,
    // Alarm: AlarmConfig,
    // BinarySensor: BinarySensorConfig,
    // EntitiesCard: EntitiesCardConfig,
    // GraphCard: GraphCardConfig,
    // Clock: ClockConfig,
    // Grid: GridConfig,
  },
  categories: {
    // layout: {
    //   title: "Layout",
    //   components: ["Grid"],
    // },
    entities: {
      title: "Entities",
      components: ["Light"
        // , "Clock", "BinarySensor", "EntitiesCard", "GraphCard"
      ],
    },
  },
};
