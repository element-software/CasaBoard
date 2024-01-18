"use client";
import GridItem from '@/components/GridItem';
import { DomainService, EntityName, useHass } from '@hakit/core';
import { useCallback } from 'react';

export default function Home() {
  const { callService } = useHass();

  const controlAmbientLighting = useCallback((action: DomainService<"light"> ) => {
    callService({
      domain: 'light',
      service: action,
      target: {
        entity_id: [
          'light.oven_tower_lighting',
          'light.wall_cabinet_lighting',
          'light.under_worktop_lighting',
          'light.island_drawers',
          'light.island_stone',
        ]
      }
    })
  }, [callService]);

  return (
    <main className="flex h-screen flex-col items-center p-8">
      <div className='grid grid-cols-3 gap-2'>
        <GridItem entityId={"light.kitchen_downlights" as EntityName}/>
        <GridItem entityId={"light.office_downlights_dimmer" as EntityName}/>
        <GridItem entityId={"light.focus_light" as EntityName}/>
        <GridItem entityId={"light.utility_room" as EntityName}/>
        <GridItem entityId={"light.kitchen_downlights" as EntityName}/>
      </div>
    </main>
  );
}
