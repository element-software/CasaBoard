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
      <div className="p-4 border-2 border-dashed border-theme-border rounded-lg text-center text-theme-text-muted">
        Configure Alarm Entity
      </div>
    );

  if (!entity)
    return (
      <div
        className="relative overflow-hidden w-full text-center flex flex-col items-center justify-between gap-2 p-6 h-44 cursor-pointer bg-gradient-to-br-theme text-theme-text rounded-2xl shadow-card shadow-theme-surface"
      >
        <Icon
          path={mdiShieldAlert}
          className={classNames("h-12 w-12", "text-theme-error")}
          aria-hidden="true"
        />
        <p className="text-xs text-theme-text-secondary">{entityId}</p>
        <p className="text-xs text-theme-text-secondary">Unavailable</p>
      </div>
    );

  const isInteractive =
    (tapAction && tapAction !== "none") ||
    (longPressAction && longPressAction !== "none");

  return (
    <div
      key={entity.entity_id}
      className={classNames(
        "relative overflow-hidden w-full text-center flex flex-col items-center justify-between gap-2 p-6 h-44 text-theme-text rounded-2xl shadow-card shadow-theme-surface select-none",
        AlarmUtils.stateClassNameBg(entity as any),
        { "cursor-pointer active:scale-[0.97] transition-transform": isInteractive }
      )}
      onPointerDown={isInteractive ? handlePointerDown : undefined}
      onPointerUp={isInteractive ? handlePointerUp : undefined}
      onPointerLeave={isInteractive ? handlePointerLeave : undefined}
    >
      <EntityIcon entity={entity} />
      <div className="text-sm font-medium capitalize">
        {entity.state
          .split("_")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")}
      </div>
      <p className="text-xs text-theme-text-secondary">
        Last Changed {new Date(entity.last_changed).toLocaleTimeString()}
      </p>
    </div>
  );
};
