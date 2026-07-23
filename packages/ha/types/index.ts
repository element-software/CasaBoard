import type { Auth, Connection } from "home-assistant-js-websocket";

export type ConnectResult = {
  connection: Connection;
  auth: Auth;
};

export type EntityDomain =
  | "light"
  | "switch"
  | "cover"
  | "sensor"
  | "binary_sensor"
  | "climate"
  | "camera"
  | "media_player"
  | "lock"
  | "fan"
  | string;

export type EntityId = string;