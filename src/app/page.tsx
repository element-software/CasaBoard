"use client";
import { ButtonCard, Group } from '@hakit/components';
import { DomainService, useHass } from '@hakit/core';
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
    <main className="flex h-full flex-col items-center p-8">
        <Group title="Main Lighting" gap="1rem">
          <ButtonCard 
            entity="light.kitchen_downlights"
            service="toggle"
          />
          <ButtonCard 
            entity="light.utility_room"
            service="toggle"
          />
        </Group>
        
        <div className='text-xl font-bold block mt-4 py-2'>Ambient Lighting</div>
        <Group title="" gap="1rem">
          <ButtonCard 
            entity="light.oven_tower_lighting"
            onClick={()=>{ controlAmbientLighting('turn_on')}}
            description='Turn On All'
          />
          <ButtonCard 
            entity="light.oven_tower_lighting"
            onClick={()=>{ controlAmbientLighting('turn_off')}}
            description='Turn Off All'
          />
          </Group>
        <Group title="" gap="1rem" className='mt-4'>
          <ButtonCard 
            entity="light.oven_tower_lighting"
            service="toggle"
          />
          <ButtonCard 
            entity="light.wall_cabinet_lighting"
            service="toggle"
          />
          <ButtonCard 
            entity="light.under_worktop_lighting"
            service="toggle"
          />
          <ButtonCard 
            entity="light.island_drawers"
            service="toggle"
          />
          <ButtonCard 
            entity="light.island_stone"
            service="toggle"
          />
        </Group>

        <div className='text-xl font-bold block py-2 mt-4'>Outdoor Lighting</div>
        <Group title="" gap="1rem">
          <ButtonCard 
            entity="light.garden_floodlight"
            service="toggle"
          />
          <ButtonCard 
            entity="light.alleyway_floodlight"
            service="toggle"
          />
          <ButtonCard 
            entity="light.alleyway_lights"
            service="toggle"
          />
        </Group>
    </main>
  );
}
