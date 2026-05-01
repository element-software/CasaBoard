"use client";
import { useEntity, useHA } from "@repo/ha";
import classNames from "classnames";
import { AlarmUtils } from "@repo/utils";
import EntityIcon from "../Shared/util/EntityIcon";
import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@heroui/react";
import { useEntityLoading } from "@repo/hooks/useEntityLoading";
import { AlarmConfirmPopup } from "./AlarmConfirmPopup";

export type AlarmAction =
  | "alarm_disarm"
  | "alarm_arm_home"
  | "alarm_arm_away"
  | "alarm_arm_night"
  | "alarm_arm_vacation"
  | "alarm_trigger"
  | "none";

export interface AlarmProps {
  entityId: string;
  tapAction?: AlarmAction;
  longPressAction?: AlarmAction;
  code?: string;
}

const LONG_PRESS_MS = 600;

const ACTION_LABEL: Record<Exclude<AlarmAction, "none">, string> = {
  alarm_disarm: "Disarming",
  alarm_arm_home: "Arming Home",
  alarm_arm_away: "Arming Away",
  alarm_arm_night: "Arming Night",
  alarm_arm_vacation: "Arming Vacation",
  alarm_trigger: "Triggering",
};

export const Alarm = ({
  entityId,
  tapAction = "none",
  longPressAction = "none",
  code,
}: AlarmProps) => {
  const entity = useEntity(entityId);
  const { connection } = useHA();
  const { isEntityReady, showNotAvailable, isLoaded } = useEntityLoading(entity);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const [pendingAction, setPendingAction] = useState<Exclude<AlarmAction, "none"> | null>(null);
  const [confirmAction, setConfirmAction] = useState<Exclude<AlarmAction, "none"> | null>(null);

  // Clear pending once HA reflects the new state, with a 30s safety fallback.
  useEffect(() => {
    if (!pendingAction) return;
    console.log("[Alarm] pendingAction set:", pendingAction, "— starting 30s fallback");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      console.log("[Alarm] 30s fallback fired — clearing pendingAction");
      setPendingAction(null);
    }, 30_000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pendingAction]);

  useEffect(() => {
    console.log("[Alarm] entity.state changed:", entity?.state, "| pendingAction:", pendingAction);
    if (pendingAction) setPendingAction(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity?.state]);

  const callAction = useCallback(
    (action: AlarmAction, enteredCode?: string) => {
      console.log("[Alarm] callAction:", action, "| connection:", !!connection, "| entityId:", entityId);
      if (!connection || !entityId || action === "none") {
        console.warn("[Alarm] callAction aborted — missing connection, entityId, or action is none");
        return;
      }
      setPendingAction(action as Exclude<AlarmAction, "none">);
      const service_data: Record<string, any> = { entity_id: entityId };
      const codeToUse = enteredCode ?? code;
      if (codeToUse) service_data.code = codeToUse;
      console.log("[Alarm] sending call_service:", { domain: "alarm_control_panel", service: action, service_data });
      connection.sendMessagePromise({
        type: "call_service",
        domain: "alarm_control_panel",
        service: action,
        service_data,
      }).then((res: any) => {
        console.log("[Alarm] call_service response:", res);
      }).catch((err: any) => {
        console.error("[Alarm] call_service error:", err);
        setPendingAction(null);
      });
    },
    [connection, entityId, code]
  );

  const openConfirm = useCallback((action: AlarmAction) => {
    if (action === "none" || pendingAction) return;
    setConfirmAction(action as Exclude<AlarmAction, "none">);
  }, [pendingAction]);

  const handleConfirmed = useCallback((enteredCode?: string) => {
    setConfirmAction(null);
    if (confirmAction) callAction(confirmAction, enteredCode);
  }, [confirmAction, callAction]);

  const handlePointerDown = useCallback(() => {
    if (pendingAction) return;
    didLongPress.current = false;
    if (longPressAction && longPressAction !== "none") {
      timerRef.current = setTimeout(() => {
        didLongPress.current = true;
        openConfirm(longPressAction);
      }, LONG_PRESS_MS);
    }
  }, [longPressAction, openConfirm, pendingAction]);

  const handlePointerUp = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!didLongPress.current && !pendingAction) {
      openConfirm(tapAction ?? "none");
    }
  }, [tapAction, openConfirm, pendingAction]);

  const handlePointerLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  if (!entityId)
    return (
      <div className="p-4 border-2 border-dashed border-theme-border rounded-xl text-center text-theme-text-muted">
        Configure Alarm Entity
      </div>
    );

  const isInteractive =
    !pendingAction &&
    isEntityReady &&
    ((tapAction && tapAction !== "none") ||
      (longPressAction && longPressAction !== "none"));

  const stateLabel = entity?.state
    .split("_")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") ?? "";

  return (
    <>
    <AlarmConfirmPopup
      action={confirmAction}
      isOpen={confirmAction !== null}
      onClose={() => setConfirmAction(null)}
      onConfirm={handleConfirmed}
    />
    <Skeleton isLoaded={isLoaded} className="w-full h-14 rounded-xl">
      {showNotAvailable ? (
        <div className="rounded-xl p-3 flex items-center gap-3 opacity-50">
          <EntityIcon entity={{ entity_id: entityId, state: "unknown", attributes: {} } as any} className="h-8 w-8 shrink-0 text-theme-text-muted" />
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-theme-text-muted truncate">{entityId}</p>
            <p className="text-xs text-theme-text-muted">Unavailable</p>
          </div>
        </div>
      ) : isEntityReady ? (
        <div
          key={entity!.entity_id}
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
            {pendingAction ? (
              <div className="h-8 w-8 shrink-0 flex items-center justify-center">
                <div className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              </div>
            ) : (
              <EntityIcon entity={entity!} className="h-8 w-8 shrink-0" />
            )}
            <div className="flex flex-col flex-1 min-w-0">
              <h3 className="text-sm font-semibold capitalize truncate text-theme-text">
                {entity!.attributes?.friendly_name || entityId}
              </h3>
              <div className="text-xs font-medium opacity-80 text-theme-text">
                {pendingAction ? `${ACTION_LABEL[pendingAction]}…` : stateLabel}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-3 opacity-0" />
      )}
    </Skeleton>
    </>
  );
};
