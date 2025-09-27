"use client";
import { useEntity } from "@repo/ha";

export function NewLight({ entityId }: { entityId: string }) {
  const entity = useEntity(entityId);

  if (!entity) return <div>Loading...</div>;

  return (
    <div>
      <div>{entity.attributes?.friendly_name || entity.entity_id}</div>
      <div>State: {entity.state}</div>
      <button onClick={() => entity.toggle?.()}>Toggle</button>
      <button onClick={() => entity.turn_on?.()}>Turn On</button>
      <button onClick={() => entity.turn_off?.()}>Turn Off</button>
    </div>
  );
}