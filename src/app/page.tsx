"use client";
import EntityCard from "@/components/EntityCard";
import GridItem from "@/components/GridItem";
import Popup from "@/components/Popup";
import { EntityName } from "@hakit/core";
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

  return (
    <main className="flex h-screen flex-col items-center p-8">
      <div className="grid grid-cols-3 gap-8 w-full">
        <GridItem entityId={"light.kitchen_downlights" as EntityName} />
        <GridItem entityId={"light.office_downlights_dimmer" as EntityName} />
        <GridItem entityId={"light.focus_light" as EntityName} />
        <GridItem entityId={"light.utility_room" as EntityName} />
        <GridItem entityId={"light.island_stone" as EntityName} />
        <div
          className="relative overflow-hidden w-full flex flex-col items-center justify-between space-y-2 p-6 h-40 cursor-pointer bg-stone-500 bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800"
          onClick={() => setOpen(!open)}
        >
          Ambient Lighting (Popup)
        </div>
        <EntityCard title="Ambient Lighting" entities={entityCardEntities} colspan={2}/>
        <Popup
          open={open}
          setOpen={setOpen}
          className="w-screen h-full bg-stone-900"
        >
          <div className="w-full text-center text-2xl font-medium text-white mb-4">
            Ambient Lighting
          </div>
          <div className="grid grid-cols-3 gap-2">
            <GridItem entityId={"light.wall_cabinet_lighting" as EntityName} />
            <GridItem entityId={"light.under_worktop_lighting" as EntityName} />
            <GridItem entityId={"light.oven_tower_lighting" as EntityName} />
            <GridItem entityId={"light.island_stone" as EntityName} />
            <GridItem entityId={"light.island_drawers" as EntityName} />
          </div>
        </Popup>
      </div>
    </main>
  );
}
