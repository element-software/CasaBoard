import { useEffect, useState, useRef, useCallback } from "react";
import { useHA } from "../provider/HAProvider"; // Your HAProvider context/hook
import type { Connection } from "home-assistant-js-websocket";

// Utility: get domain from entity_id (e.g., "light.kitchen" => "light")
function getDomain(entityId: string): string {
  return entityId.split(".")[0];
}

// Utility: Home Assistant service names by domain for togglable entities
const TOGGLE_DOMAINS = ["switch", "light", "fan", "lock", "cover", "input_boolean"] as const;

export function useEntity<T = any>(entityId: string) {
  const { connection, getEntity } = useHA();
  const [state, setState] = useState<T | null>(() => getEntity(entityId) ?? null);

  // Subscribe to entity updates
  useEffect(() => {
    if (!connection) return;
    const unsubscribe = connection.subscribeEvents((event: any) => {
      if (event.data.entity_id === entityId) {
        setState(getEntity(entityId));
      }
    }, "state_changed");

    // Also update on full entity map change (for fast initial load)
    setState(getEntity(entityId));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, entityId]);

  // Service helpers
  const callService = useCallback(
    async (service: string, serviceData: Record<string, any> = {}) => {
      if (!connection) throw new Error("No HA connection");
      const domain = getDomain(entityId);
      await connection.sendMessagePromise({
        type: "call_service",
        domain,
        service,
        service_data: { entity_id: entityId, ...serviceData },
      });
    },
    [connection, entityId]
  );

  // Add .toggle() if domain supports it (light, switch, etc)
  const domain = getDomain(entityId);

  const entity = {
    ...state,
    callService,
    ...(TOGGLE_DOMAINS.includes(domain as any)
      ? {
          async toggle() {
            await callService("toggle");
          },
          async turn_on() {
            await callService("turn_on");
          },
          async turn_off() {
            await callService("turn_off");
          },
        }
      : {}),
  };

  return entity as T & {
    callService: typeof callService;
    toggle?: () => Promise<void>;
    turn_on?: () => Promise<void>;
    turn_off?: () => Promise<void>;
  };
}