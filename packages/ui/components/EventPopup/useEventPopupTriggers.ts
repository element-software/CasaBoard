"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isOutsideCooldown, matchesTrigger, useHA } from "@casaboard/ha";
import type { EventPopupRule } from "@repo/types/eventPopup";

export interface ActiveEventPopup {
  rule: EventPopupRule;
  /** Changes on every fire, including re-triggers of the same rule. */
  firedAt: number;
}

function isRuleUsable(rule: EventPopupRule | undefined): rule is EventPopupRule {
  return Boolean(rule?.enabled && rule.triggerEntityId && rule.cameraEntityId);
}

/**
 * Watches the HA entity map and opens a popup when a rule's trigger entity
 * changes. The first state seen per entity (page load, reconnect) is only a
 * baseline and never fires.
 */
export function useEventPopupTriggers(rules: EventPopupRule[]) {
  const { entities, connected } = useHA();
  const prevStatesRef = useRef(new Map<string, string>());
  const lastFiredRef = useRef(new Map<number, number>());
  const [active, setActive] = useState<ActiveEventPopup | null>(null);

  useEffect(() => {
    const prevStates = prevStatesRef.current;
    if (!connected) {
      // Re-baseline after reconnect so stale transitions do not replay.
      prevStates.clear();
      return;
    }

    const now = Date.now();
    let fired: ActiveEventPopup | null = null;
    const nextStates = new Map<string, string | undefined>();

    rules.forEach((rule, index) => {
      if (!isRuleUsable(rule)) return;
      const entityId = rule.triggerEntityId;
      const next: string | undefined = entities[entityId]?.state;
      nextStates.set(entityId, next);

      if (!matchesTrigger(rule, prevStates.get(entityId), next)) return;
      if (!isOutsideCooldown(rule, now, lastFiredRef.current.get(index))) {
        return;
      }
      lastFiredRef.current.set(index, now);
      // Single popup for now; the latest matching rule wins.
      fired = { rule, firedAt: now };
    });

    // Update baselines after evaluating, so rules sharing an entity all see
    // the same previous state.
    nextStates.forEach((state, entityId) => {
      if (state === undefined) prevStates.delete(entityId);
      else prevStates.set(entityId, state);
    });

    if (fired) setActive(fired);
  }, [entities, connected, rules]);

  const dismiss = useCallback(() => setActive(null), []);

  return { active, dismiss };
}
