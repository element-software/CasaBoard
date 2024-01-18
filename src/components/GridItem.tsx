"use client";
import { EntityName, useEntity, useHass } from "@hakit/core";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import { useCallback } from "react";

interface GridItemProps {
  entityId: EntityName;
}
const GridItem = ({ entityId }: GridItemProps) => {
  const entity = useEntity(entityId);
  console.log("entity", entity)

  const { callService } = useHass();

  const handleTurnOn = useCallback((entityId: EntityName) => {
    console.log(entityId);
    callService({
      domain: "light",
      service: 'turn_on',
      target: {
        entity_id: entityId
      }
    })
  }, [callService]);

  const handleTurnOff = useCallback((entityId: EntityName) => {
    console.log(entityId);
    callService({
      domain: "light",
      service: 'turn_off',
      target: {
        entity_id: entityId
      }
    })
  }, [callService]);

  return (
    <div
      key={entity.entity_id}
      className="w-full divide-y divide-gray-200 bg-black/60 shadow"
    >
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-medium text-white">
              {entity.attributes.friendly_name}
            </h3>
            <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {entity.state}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-white">
            {new Date(entity.last_changed).toLocaleString()}
          </p>
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <div
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-white hover:cursor-pointer"
              onClick={() => handleTurnOn(entity.entity_id as EntityName)}
            >
              <LightBulbIcon
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
              Turn On
            </div>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <div
              className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-white hover:cursor-pointer"
              onClick={() => handleTurnOff(entity.entity_id as EntityName)}
            >
              <LightBulbIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Turn Off
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridItem;
