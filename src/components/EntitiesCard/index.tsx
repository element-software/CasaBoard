"use client";
import { EntityName, useHass } from "@hakit/core";
import classNames from "classnames";
import Icon from "@mdi/react";
import { mdiOpenInNew, mdiPower } from "@mdi/js";
import { useCallback, useState } from "react";
import Popup from "../Popup";
import { Entity } from "@/types/shared";
import EntityCard from "./EntityCard";

interface EntitiesCardProps {
  title: string;
  entities: Entity[];
  colspan?: number;
  showAllOn?: boolean;
  showTitles?: boolean;
  disableClick?: boolean;
  openTab?: boolean;
  children?: React.ReactNode;
  showLastChanged?: boolean;
}

const EntitiesCard = ({
  title,
  entities,
  colspan,
  openTab = false,
  showAllOn = false,
  showTitles = false,
  disableClick = false,
  showLastChanged = false,
  children,
}: EntitiesCardProps) => {

  const [allOn, setAllOn] = useState(false);
  const [open, setOpen] = useState(false);

  const { callService } = useHass();

  const toggleLighting = useCallback(
    (entities: EntityName[]) => {
      callService({
        domain: "light",
        service: allOn ? "turn_off" : "turn_on",
        target: {
          entity_id: entities,
        },
      });
      setAllOn(!allOn);
    },
    [allOn, callService]
  );


  return (
    <div
      className={classNames(
        "relative overflow-hidden w-full flex flex-col items-center justify-between space-y-2 p-6 cursor-pointer bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800 col-span-1",
        {
          "sm:col-span-2": colspan === 2,
          "sm:col-span-3": colspan === 3,
          "sm:col-span-4": colspan === 4,
        }
      )}
    >
      <div className="flex flex-row w-full justify-between items-center">
        <div className="text-base inline-flex">
          {title}
          {openTab && (
            <div className="inline-flex" onClick={() => setOpen(true)}>
              <Icon
                path={mdiOpenInNew}
                className="ml-3 h-6 w-6 text-amber-500"
                aria-hidden="true"
              />
              <Popup open={open} setOpen={setOpen} className="w-screen h-full bg-stone-900">
                <div className="w-full text-center text-2xl font-medium text-white mb-4">
                  {title}
                </div>
                {children}
              </Popup>
            </div>
          )}
        </div>
        <div
          onClick={
            disableClick
              ? undefined
              : () => toggleLighting(entities.map((entity) => entity.id))
          }
          className={showAllOn ? "block" : "hidden"}
        >
          <Icon
            path={mdiPower}
            className={classNames(
              "h-10 w-10 p-2 rounded-full bg-gradient-to-l",
              {
                "text-black from-yellow-600 to-amber-500": allOn,
                "text-white from-neutral-800 to-neutral-700 rounded-full": !allOn,
              }
            )}
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 w-full items-start justify-between gap-4">
        {entities.map((entity) => (
          <EntityCard
            key={entity.id}
            entityId={entity.id}
            icon={entity.icon}
            showTitle={showTitles}
            showLastChanged={showLastChanged}
          />
        ))}
      </div>
    </div>
  );
};

export default EntitiesCard;
