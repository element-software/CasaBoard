import type { Auth, Connection } from "home-assistant-js-websocket";

export type CameraStreamType = "hls" | "webrtc";

export interface CameraCapabilities {
  frontend_stream_types?: CameraStreamType[];
}

/** CameraEntityFeature.STREAM bit from Home Assistant. */
export const CAMERA_FEATURE_STREAM = 2;

export function joinHassUrl(hassUrl: string, path: string): string {
  const base = hassUrl.replace(/\/$/, "");
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export async function ensureFreshAccessToken(auth: Auth): Promise<string> {
  if (auth.expired) {
    await auth.refreshAccessToken();
  }
  return auth.accessToken;
}

export async function getCameraCapabilities(
  connection: Connection,
  entityId: string
): Promise<CameraCapabilities> {
  return connection.sendMessagePromise({
    type: "camera/capabilities",
    entity_id: entityId,
  }) as Promise<CameraCapabilities>;
}

export function cameraSupportsHls(
  capabilities: CameraCapabilities | null | undefined,
  supportedFeatures?: number
): boolean {
  // Prefer explicit capabilities when present (WebRTC-only cameras omit HLS).
  if (capabilities?.frontend_stream_types) {
    return capabilities.frontend_stream_types.includes("hls");
  }
  if (
    typeof supportedFeatures === "number" &&
    (supportedFeatures & CAMERA_FEATURE_STREAM) === CAMERA_FEATURE_STREAM
  ) {
    return true;
  }
  return false;
}

/**
 * Request an HLS playlist URL from Home Assistant's stream integration.
 * Returns a path (or absolute URL) that must be fetched with the access token.
 */
export async function getCameraHlsUrl(
  connection: Connection,
  hassUrl: string,
  entityId: string
): Promise<string> {
  const result = (await connection.sendMessagePromise({
    type: "camera/stream",
    entity_id: entityId,
    format: "hls",
  })) as { url: string };
  return joinHassUrl(hassUrl, result.url);
}

export function getCameraMjpegUrl(
  hassUrl: string,
  entityId: string,
  accessToken: string
): string {
  const url = new URL(
    joinHassUrl(hassUrl, `/api/camera_proxy_stream/${entityId}`)
  );
  url.searchParams.set("token", accessToken);
  return url.toString();
}

export function getCameraPosterUrl(
  hassUrl: string,
  entityId: string,
  accessToken: string
): string {
  const url = new URL(joinHassUrl(hassUrl, `/api/camera_proxy/${entityId}`));
  url.searchParams.set("token", accessToken);
  return url.toString();
}
