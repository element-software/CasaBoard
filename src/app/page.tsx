"use client";
import GridItem from "@/components/GridItem";
import Popup from "@/components/Popup";
import Toggle from "@/components/Toggle";
import { DomainService, EntityName, useHass } from "@hakit/core";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";

export default function Home() {
  const { callService } = useHass();
  const [open, setOpen] = useState(false);

  const controlAmbientLighting = useCallback(
    (action: DomainService<"light">) => {
      callService({
        domain: "light",
        service: action,
        target: {
          entity_id: [
            "light.oven_tower_lighting",
            "light.wall_cabinet_lighting",
            "light.under_worktop_lighting",
            "light.island_drawers",
            "light.island_stone",
          ],
        },
      });
    },
    [callService]
  );

  return (
    <main className="flex h-screen flex-col items-center p-8">
      <div className="grid grid-cols-3 gap-2 w-full">
        <div className="relative rounded-md overflow-hidden w-full shadow flex flex-col items-center text-center justify-between space-y-2 p-4 h-40 cursor-pointer bg-gradient-to-tl from-zinc-900 via-neutral-900 to-neutral-600" onClick={() => setOpen(!open)}>
          <div className="text-lg font-bold uppercase text-white">Main Lighting</div>
          <div className="absolute -left-4 -bottom-4 bg-yellow-100 rounded-full p-8">
            <LightBulbIcon className="h-12 w-12 text-black" aria-hidden="true" />
          </div>
        </div>
        <div className="relative rounded-md overflow-hidden w-full shadow flex flex-col items-center text-center justify-between space-y-2 p-4 h-40 cursor-pointer bg-gradient-to-tl from-zinc-900 via-neutral-900 to-neutral-600">
          <div className="flex-row w-full flex items-center justify-start">
            <LightBulbIcon className="h-10 w-10 text-yellow-600" aria-hidden="true" />
            <div className="w-full justify-end">
              <Toggle />
            </div>
          </div>
          <div className="w-full text-left text-lg font-normal text-white border-b border-gray-600 pb-1">Kitchen Lights</div>
        </div>
        <Popup open={open} setOpen={setOpen} className="w-screen h-full bg-stone-900">
          <div className="w-full text-center text-2xl font-bold text-white mb-4 uppercase">Main Lighting</div>
          <div className="grid grid-cols-3 gap-2">
            <GridItem entityId={"light.kitchen_downlights" as EntityName} />
            <GridItem
              entityId={"light.office_downlights_dimmer" as EntityName}
            />
            <GridItem entityId={"light.focus_light" as EntityName} />
            <GridItem entityId={"light.utility_room" as EntityName} />
            <GridItem entityId={"light.kitchen_downlights" as EntityName} />
          </div>
        </Popup>
      </div>
    </main>
  );
}
