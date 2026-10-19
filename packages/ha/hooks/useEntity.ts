"use client";

import { useMemo } from "react";
import { useHA } from "../provider/HAProvider";

// Generic service caller for any entity
function callService(
  connection: any,
  domain: string,
  service: string,
  entityId: string,
  data: Record<string, any> = {}
) {
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
  climate: [
    "set_temperature",
    "set_hvac_mode",
    "set_fan_mode",
    "turn_on",
    "turn_off",
  ],
  media_player: [
    "play_media",
    "media_play",
    "media_pause",
    "media_play_pause",
    "media_stop",
    "media_next_track",
    "media_previous_track",
    "media_seek",
    "volume_set",
    "volume_mute",
    "volume_up",
    "volume_down",
    "select_source",
    "select_sound_mode",
    "shuffle_set",
    "repeat_set",
    "turn_on",
    "turn_off",
    "toggle",
  ],
  lock: ["lock", "unlock"],
  fan: ["toggle", "turn_on", "turn_off"],
};

/**
 * Read a single entity from the shared HAProvider store.
 * Avoids per-component get_states / state_changed subscriptions (which race
 * under load and can falsely report cameras as unavailable).
 */
export function useEntity<T = any>(entityId: string) {
  const { connection, entities } = useHA();
  const state = entityId ? (entities[entityId] as T | undefined) : undefined;

  return useMemo(() => {
    if (!entityId || !state) return null;

    const domain = String(entityId).split(".")[0];
    const services = DOMAIN_SERVICES[domain] || [];
    const serviceMethods: Record<string, (...args: any[]) => Promise<any>> = {};

    services.forEach((service) => {
      serviceMethods[service] = (data: Record<string, any> = {}) =>
        callService(connection, domain, service, entityId, data);
    });

    serviceMethods.callService = (
      service: string,
      data: Record<string, any> = {}
    ) => callService(connection, domain, service, entityId, data);

    return {
      ...state,
      ...serviceMethods,
    };
  }, [state, connection, entityId]);
}
