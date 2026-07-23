"use client";
import { useEntity, useHA } from "@repo/ha";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

/** Map HA alarm_control_panel state → HomeKit "Mode · Status" line. */
function formatSecurityStatus(state?: string): { mode: string; detail: string; tone: "ok" | "armed" | "alert" | "pending" } {
  switch (state) {
    case "disarmed":
      return { mode: "Home", detail: "Disarmed", tone: "ok" };
    case "armed_home":
      return { mode: "Home", detail: "Armed", tone: "armed" };
    case "armed_away":
      return { mode: "Away", detail: "Armed", tone: "armed" };
    case "armed_night":
      return { mode: "Night", detail: "Armed", tone: "armed" };
    case "armed_vacation":
      return { mode: "Vacation", detail: "Armed", tone: "armed" };
    case "armed_custom_bypass":
      return { mode: "Custom", detail: "Armed", tone: "armed" };
    case "triggered":
      return { mode: "Alarm", detail: "Triggered", tone: "alert" };
    case "pending":
      return { mode: "Security", detail: "Pending", tone: "pending" };
    case "arming":
      return { mode: "Security", detail: "Arming", tone: "pending" };
    default:
      if (!state) return { mode: "Security", detail: "Unknown", tone: "pending" };
      return {
        mode: "Security",
        detail: state
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        tone: "pending",
      };
  }
}

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

  useEffect(() => {
    if (!pendingAction) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setPendingAction(null), 30_000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pendingAction]);

  useEffect(() => {
    if (pendingAction) setPendingAction(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity?.state]);

  const callAction = useCallback(
    (action: AlarmAction, enteredCode?: string) => {
      if (!connection || !entityId || action === "none") return;
      setPendingAction(action as Exclude<AlarmAction, "none">);
      const service_data: Record<string, any> = { entity_id: entityId };
      const codeToUse = enteredCode ?? code;
      if (codeToUse) service_data.code = codeToUse;
      connection
        .sendMessagePromise({
          type: "call_service",
          domain: "alarm_control_panel",
          service: action,
          service_data,
        })
        .catch(() => setPendingAction(null));
    },
    [connection, entityId, code]
  );

  const openConfirm = useCallback(
    (action: AlarmAction) => {
      if (action === "none" || pendingAction) return;
      setConfirmAction(action as Exclude<AlarmAction, "none">);
    },
    [pendingAction]
  );

  const handleConfirmed = useCallback(
    (enteredCode?: string) => {
      setConfirmAction(null);
      if (confirmAction) callAction(confirmAction, enteredCode);
    },
    [confirmAction, callAction]
  );

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

  const status = useMemo(
    () => formatSecurityStatus(entity?.state),
    [entity?.state]
  );

  if (!entityId) {
    return (
      <div className="alarm-hk alarm-hk--empty">
        <span>Configure Alarm Entity</span>
      </div>
    );
  }

  const isInteractive =
    !pendingAction &&
    isEntityReady &&
    ((tapAction && tapAction !== "none") ||
      (longPressAction && longPressAction !== "none"));

  const statusLine = pendingAction
    ? `${ACTION_LABEL[pendingAction]}…`
    : `${status.mode} · ${status.detail}`;

  return (
    <>
      <AlarmConfirmPopup
        action={confirmAction}
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmed}
      />
      <Skeleton isLoaded={isLoaded} className="w-full rounded-[1.75rem]">
        {showNotAvailable ? (
          <div className="alarm-hk alarm-hk--unavailable">
            <div className="alarm-hk__icon" aria-hidden>
              <span className="alarm-hk__glyph" />
            </div>
            <div className="alarm-hk__labels">
              <div className="alarm-hk__title">Security</div>
              <div className="alarm-hk__status">Unavailable</div>
            </div>
          </div>
        ) : isEntityReady ? (
          <div
            className={`alarm-hk alarm-hk--${status.tone}${isInteractive ? " alarm-hk--interactive" : ""}`}
            onPointerDown={isInteractive ? handlePointerDown : undefined}
            onPointerUp={isInteractive ? handlePointerUp : undefined}
            onPointerLeave={isInteractive ? handlePointerLeave : undefined}
            role={isInteractive ? "button" : undefined}
            tabIndex={isInteractive ? 0 : undefined}
          >
            <div className="alarm-hk__icon" aria-hidden>
              {pendingAction ? (
                <span className="alarm-hk__spinner" />
              ) : (
                <span className="alarm-hk__glyph" />
              )}
            </div>
            <div className="alarm-hk__labels">
              <div className="alarm-hk__title">Security</div>
              <div className="alarm-hk__status">{statusLine}</div>
            </div>
          </div>
        ) : (
          <div className="alarm-hk opacity-0" />
        )}
      </Skeleton>
    </>
  );
};
