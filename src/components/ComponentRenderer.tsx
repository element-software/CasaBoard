"use client";
import React from "react";
import { ComponentConfig, LightConfig, AlarmConfig, BinarySensorConfig, SensorConfig, EntitiesCardConfig, CustomGridConfig } from "../config/dashboard.types";
import { Light } from "../components/Grid/Light";
import { Alarm } from "../components/Grid/Alarm";
import { BinarySensor } from "../components/Grid/BinarySensor";
import GraphCard from "../components/GraphCard";
import EntitiesCard from "../components/EntitiesCard";
import EntityCard from "../components/EntitiesCard/EntityCard";
import classNames from "classnames";

interface ComponentRendererProps {
  config: ComponentConfig;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ config }) => {
  switch (config.type) {
    case "light":
      const lightConfig = config as LightConfig;
      return (
        <Light
          entityId={lightConfig.id}
          dimmer={lightConfig.dimmer}
          temperature={lightConfig.temperature}
          color={lightConfig.color}
        />
      );

    case "alarm":
      const alarmConfig = config as AlarmConfig;
      return <Alarm entityId={alarmConfig.id} />;

    case "binary_sensor":
      const binarySensorConfig = config as BinarySensorConfig;
      return <BinarySensor entityId={binarySensorConfig.id} />;

    case "sensor":
      const sensorConfig = config as SensorConfig;
      return <GraphCard entityId={sensorConfig.id} />;

    case "entities_card":
      const entitiesCardConfig = config as EntitiesCardConfig;
      return (
        <EntitiesCard
          title={entitiesCardConfig.title}
          entities={entitiesCardConfig.entities}
          colspan={entitiesCardConfig.colspan}
          showTitles={entitiesCardConfig.showTitles}
          showLastChanged={entitiesCardConfig.showLastChanged}
          showAllOn={entitiesCardConfig.showAllOn}
          disableClick={entitiesCardConfig.disableClick}
          openTab={entitiesCardConfig.openTab}
        >
          {entitiesCardConfig.children && (
            <div className="grid grid-cols-2 gap-2">
              {entitiesCardConfig.children.map((childConfig, index) => (
                <ComponentRenderer key={index} config={childConfig} />
              ))}
            </div>
          )}
        </EntitiesCard>
      );

    case "custom_grid":
      const customGridConfig = config as CustomGridConfig;
      return (
        <div className={classNames(
          "relative overflow-hidden w-full items-center justify-between p-2 h-40 cursor-pointer bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800",
          `grid grid-cols-${customGridConfig.gridCols || 3} gap-4`,
          customGridConfig.className
        )}>
          {customGridConfig.entities.map((entity, index) => (
            <EntityCard
              key={`entity-${index}`}
              entityId={entity.id}
              icon={entity.icon}
              showState={entity.showState}
              showTitle={entity.showTitle}
              showLastChanged={entity.showLastChanged}
            />
          ))}
          {customGridConfig.children?.map((childConfig, index) => (
            <ComponentRenderer key={`child-${index}`} config={childConfig} />
          ))}
        </div>
      );

    default:
      console.warn(`Unknown component type: ${(config as any).type}`);
      return null;
  }
};
