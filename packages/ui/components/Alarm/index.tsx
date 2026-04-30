"use client";
import { useEntity, useHA } from "@repo/ha";
import classNames from "classnames";
import Icon from "@mdi/react";
import { mdiShieldAlert } from "@mdi/js";
import { AlarmUtils } from "@repo/utils";
import EntityIcon from "../Shared/util/EntityIcon";
import { useCallback, useRef } from "react";

export type AlarmAction =
  | "disarm"
  | "arm_home"
  | "arm_away"
  | "arm_night"
  | "arm_vacation"
  | "trigger"
  | "none";

export interface AlarmProps {
  entityId: string;
  tapAction?: AlarmAction;
  longPressAction?: AlarmAction;
  code?: string;
}

const LONG_PRESS_MS = 600;

export const Alarm = ({
  entityId,
  tapAction = "none",
  longPressAction = "none",
  code,
}: AlarmProps) => {
  const entity = useEntity(entityId);
  const { connection } = useHA();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const callAction = useCallback(
    (action: AlarmAction) => {
      if (!connection || !entityId || action === "none") return;
      const service_data: Record<string, any> = { entity_id: entityId };
      if (code) service_data.code = code;
      connection.sendMessagePromise({
        type: "call_service",
        domain: "alarm_control_panel",
        service: action,
        service_data,
      });
    },
    [connection, entityId, code]
  );

  const handlePointerDown = useCallback(() => {
    didLongPress.current = false;
    if (longPressAction && longPressAction !== "none") {
      timerRef.current = setTimeout(() => {
        didLongPress.current = true;
        callAction(longPressAction);
      }, LONG_PRESS_MS);
    }
  }, [longPressAction, callAction]);

  const handlePointerUp = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!didLongPress.current) {
      callAction(tapAction ?? "none");
    }
  }, [tapAction, callAction]);

  const handlePointerLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  if (!entityId)
    return (
      <div className="p-4 border-2 border-dashed border-theme-border rounded-xl text-center text-theme-text-muted">
        Configure Alarm Entity
      </div>
    );

  if (!entity)
    return (
      <div className="border-2 border-dashed border-theme-border rounded-xl p-3 text-center text-theme-text-muted">
        <Icon path={mdiShieldAlert} className="h-8 w-8 mx-auto mb-1 text-theme-error" aria-hidden="true" />
        <p className="text-xs">{entityId} unavailable</p>
      </div>
    );

  const isInteractive =
    (tapAction && tapAction !== "none") ||
    (longPressAction && longPressAction !== "none");

  const stateLabel = entity.state
    .split("_")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div
      key={entity.entity_id}
      className={classNames(
        "w-full rounded-xl overflow-hidden select-none transition-all duration-200",
        AlarmUtils.stateClassNameBg(entity as any),
        { "cursor-pointer hover:brightness-110": isInteractive }
      )}
      onPointerDown={isInteractive ? handlePointerDown : undefined}
      onPointerUp={isInteractive ? handlePointerUp : undefined}
      onPointerLeave={isInteractive ? handlePointerLeave : undefined}
    >
      <div className="p-3 flex items-center gap-3">
        <EntityIcon entity={entity} className="h-8 w-8 flex-shrink-0" />
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-sm font-semibold capitalize truncate text-theme-text">
            {entity.attributes?.friendly_name || entityId}
          </h3>
          <div className="text-xs font-medium opacity-80 text-theme-text">
            {stateLabel}
          </div>
        </div>
      </div>
    </div>
  );
};
