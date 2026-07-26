"use client";
import { useEntity, useHA } from "@casaboard/ha";
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
  tapAction?: AlarmAction | string;
  longPressAction?: AlarmAction | string;
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

/** Legacy config values → HA alarm_control_panel service names. */
const ACTION_ALIASES: Record<string, AlarmAction> = {
  none: "none",
  disarm: "alarm_disarm",
  alarm_disarm: "alarm_disarm",
  arm_home: "alarm_arm_home",
  alarm_arm_home: "alarm_arm_home",
  arm_away: "alarm_arm_away",
  alarm_arm_away: "alarm_arm_away",
  arm_night: "alarm_arm_night",
  alarm_arm_night: "alarm_arm_night",
  arm_vacation: "alarm_arm_vacation",
  alarm_arm_vacation: "alarm_arm_vacation",
  trigger: "alarm_trigger",
  alarm_trigger: "alarm_trigger",
};

const ACTIVE_ALARM_STATES = new Set([
  "armed_home",
  "armed_away",
  "armed_night",
  "armed_vacation",
  "armed_custom_bypass",
  "triggered",
  "pending",
  "arming",
]);

export function normalizeAlarmAction(action?: string | null): AlarmAction {
  if (!action) return "none";
  return ACTION_ALIASES[action] ?? "none";
}

function isAlarmActive(state?: string): boolean {
  return !!state && ACTIVE_ALARM_STATES.has(state);
}

/** When armed, arm/trigger gestures become disarm so the card can be cleared. */
export function resolveAlarmGestureAction(
  configured: string | undefined,
  state?: string
): AlarmAction {
  const action = normalizeAlarmAction(configured);
  if (action === "none") return "none";
  if (isAlarmActive(state) && action !== "alarm_disarm") {
    return "alarm_disarm";
  }
  return action;
}

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

  const normalizedTap = normalizeAlarmAction(tapAction);
  const normalizedLongPress = normalizeAlarmAction(longPressAction);
  const effectiveTap = resolveAlarmGestureAction(normalizedTap, entity?.state);
  const effectiveLongPress = resolveAlarmGestureAction(
    normalizedLongPress,
    entity?.state
  );

  /** HA `code_format` is set when the panel expects a code (number/text). */
  const codeFormat = entity?.attributes?.code_format as string | null | undefined;
  const codeArmRequired = Boolean(entity?.attributes?.code_arm_required);
  const requiresCode =
    confirmAction === "alarm_disarm"
      ? Boolean(codeFormat)
      : Boolean(codeFormat) && codeArmRequired;

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
      // Prefer the PIN entered in the confirm UI; fall back to optional stored code.
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
    if (effectiveLongPress !== "none") {
      timerRef.current = setTimeout(() => {
        didLongPress.current = true;
        openConfirm(effectiveLongPress);
      }, LONG_PRESS_MS);
    }
  }, [effectiveLongPress, openConfirm, pendingAction]);

  const handlePointerUp = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!didLongPress.current && !pendingAction) {
      openConfirm(effectiveTap);
    }
  }, [effectiveTap, openConfirm, pendingAction]);

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
    (effectiveTap !== "none" || effectiveLongPress !== "none");

  const statusLine = pendingAction
    ? `${ACTION_LABEL[pendingAction]}…`
    : `${status.mode} • ${status.detail}`;

  return (
    <>
      <AlarmConfirmPopup
        action={confirmAction}
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmed}
        requiresCode={requiresCode}
      />
      <Skeleton
        isLoaded={isLoaded}
        className="flex h-full w-full flex-col rounded-[1.75rem]"
        classNames={{ content: "flex h-full min-h-0 w-full flex-1 flex-col" }}
      >
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
