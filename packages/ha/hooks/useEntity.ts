
import { useEffect, useState, useMemo } from "react";
import { useHA } from "../provider/HAProvider";


// Generic service caller for any entity
function callService(connection: any, domain: string, service: string, entityId: string, data: Record<string, any> = {}) {
  if (!connection) throw new Error("No HA connection available");
  return connection.sendMessagePromise({
    type: "call_service",
    domain,
    service,
    service_data: { entity_id: entityId, ...data },
  });
}

// Map of domain to available services
const DOMAIN_SERVICES: Record<string, string[]> = {
  light: ["toggle", "turn_on", "turn_off"],
  switch: ["toggle", "turn_on", "turn_off"],
  cover: ["open_cover", "close_cover", "toggle"],
  climate: ["set_temperature", "turn_on", "turn_off"],
  media_player: ["play_media", "turn_on", "turn_off", "toggle", "volume_up", "volume_down"],
  lock: ["lock", "unlock"],
  fan: ["toggle", "turn_on", "turn_off"],
  // Add more domains/services as needed
};

export function useEntity<T = any>(entityId: string) {
  const { connection } = useHA();
  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | null = null;
    if (connection) {
      connection.sendMessagePromise({ type: "get_states" }).then((states) => {
        const statesArray = states as any[];
        const found = statesArray.find((s) => s.entity_id === entityId);
        setState(found ?? null);
      });
      connection
        .subscribeEvents((event: any) => {
          if (event.data.entity_id === entityId) {
            setState(event.data.new_state ?? null);
          }
        }, "state_changed")
        .then((unsub) => {
          unsubscribe = unsub;
        });
      return () => {
        active = false;
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [connection, entityId]);

  // Memoize the entity object with service methods
  const entity = useMemo(() => {
    if (!state) return null;
    const domain = String(entityId).split(".")[0];
    const services = DOMAIN_SERVICES[domain] || [];
    const serviceMethods: Record<string, (...args: any[]) => Promise<any>> = {};

    services.forEach((service) => {
      serviceMethods[service] = (data: Record<string, any> = {}) =>
        callService(connection, domain, service, entityId, data);
    });

    // Always provide a generic callService method
    serviceMethods.callService = (service: string, data: Record<string, any> = {}) =>
      callService(connection, domain, service, entityId, data);

    return {
      ...state,
      ...serviceMethods,
    };
  }, [state, connection, entityId]);

  return entity;
}
