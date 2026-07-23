"use client";

import { useState, useCallback } from "react";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { EntityTile } from "../EntityTile/EntityTile";
import { CardShell } from "../Shared/Card";

export type RoomConfig = {
  id?: string;
  name: string;
  entities?: { id: string }[];
};

export type RoomsProps = {
  title?: string;
  rooms?: RoomConfig[];
};

export function Rooms({ title = "Rooms", rooms = [] }: RoomsProps) {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const activeRoom = rooms.find(
    (r, i) => (r.id || `room-${i}`) === activeRoomId
  );

  const openRoom = useCallback((key: string) => {
    setActiveRoomId(key);
  }, []);

  const closeRoom = useCallback(() => {
    setActiveRoomId(null);
  }, []);

  if (activeRoom) {
    const entities = (activeRoom.entities || []).filter((e) => e?.id);
    return (
      <div className="flex flex-col gap-4 w-full">
        <button
          type="button"
          onClick={closeRoom}
          className="inline-flex items-center gap-1 text-sm font-medium text-theme-text-secondary hover:text-theme-text self-start"
        >
          <Icon path={mdiChevronLeft} className="h-5 w-5" />
          {title}
        </button>
        <h2 className="text-2xl font-bold text-theme-text">{activeRoom.name}</h2>
        {entities.length === 0 ? (
          <p className="text-sm text-theme-text-muted">
            No accessories selected for this room.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {entities.map((e) => (
              <EntityTile key={e.id} entityId={e.id} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {title && (
        <h2 className="text-xl font-bold text-theme-text tracking-tight">
          {title}
        </h2>
      )}
      <div className="flex flex-col gap-3">
        {rooms.length === 0 && (
          <p className="text-sm text-theme-text-muted py-4">
            Add rooms in the editor and select which entities appear in each.
          </p>
        )}
        {rooms.map((room, index) => {
          const key = room.id || `room-${index}`;
          const count = (room.entities || []).filter((e) => e?.id).length;
          return (
            <CardShell
              key={key}
              interactive
              className="bg-theme-card-background"
              onClick={() => openRoom(key)}
            >
              <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-row items-center justify-between w-full">
                  <h3 className="text-base font-semibold text-theme-text">
                    {room.name || "Room"}
                  </h3>
                  <span className="inline-flex items-center gap-0.5 text-sm text-theme-text-secondary">
                    {count} accessor{count === 1 ? "y" : "ies"}
                    <Icon path={mdiChevronRight} className="h-4 w-4" />
                  </span>
                </div>
                {count > 0 && (
                  <div className="flex flex-col divide-y divide-theme-divider">
                    {(room.entities || [])
                      .filter((e) => e?.id)
                      .slice(0, 6)
                      .map((e) => (
                        <div
                          key={e.id}
                          className="py-1"
                          onClick={(ev) => ev.stopPropagation()}
                          onPointerDown={(ev) => ev.stopPropagation()}
                        >
                          <EntityTile entityId={e.id} tileLayout="row" />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardShell>
          );
        })}
      </div>
    </div>
  );
}

export default Rooms;
