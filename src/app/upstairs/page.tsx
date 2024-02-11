"use client";
import EntityCard from "@/components/EntityCard";
import GraphCard from "@/components/GraphCard";
import { GridItem } from "@/components/Grid";
import Popup from "@/components/Popup";
import { EntityName } from "@hakit/core";
import { mdiOpenInNew } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  const entityCardEntities = [
    {
      id: "light.wall_cabinet_lighting" as EntityName,
      icon: "mdiLedStripVariant",
    },
    {
      id: "light.under_worktop_lighting" as EntityName,
      icon: "mdiCountertop",
    },
    {
      id: "light.oven_tower_lighting" as EntityName,
      icon: "mdiToasterOven",
    },
    {
      id: "light.island_stone" as EntityName,
      icon: "mdiDiamondStone",
    },
    {
      id: "light.island_drawers" as EntityName,
      icon: "mdiFileCabinet",
    },
  ];

  const sensorEntities = [
    {
      id: "binary_sensor.front_door_sensor_contact" as EntityName,
      icon: "mdiDoor",
    },
    {
      id: "binary_sensor.bathroom_window_sensor_contact" as EntityName,
      icon: "mdiDoor",
    },
    {
      id: "binary_sensor.patio_door_sensor_contact" as EntityName,
      icon: "mdiDoor",
    },
    {
      id: "binary_sensor.gate_door_contact" as EntityName,
      icon: "mdiDoor",
    }
  ];

  return (
    <main className="flex h-screen flex-col items-center p-8">
      <div className="grid grid-cols-3 gap-8 w-full">
        <GridItem entityId={"light.baby_room_light" as EntityName} />
        <GridItem entityId={"light.guest_bedroom" as EntityName} />
        <GridItem entityId={"light.master_bedroom_dimmer" as EntityName} />
        <GridItem entityId={"light.upstairs_hallway_light" as EntityName} />
        <GridItem entityId={"light.living_room_downlights" as EntityName} />

        <EntityCard title="Ambient Lighting" entities={entityCardEntities} colspan={2} showTitles={true} showAllOn={true}/>
        <GraphCard entityId={"sensor.whole_home_energy_usage" as EntityName} />
        <EntityCard title="Sensors" entities={sensorEntities} colspan={2} showTitles={true} disableClick={true}/>
      </div>
    </main>
  );
}
