"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import type { Connection } from "home-assistant-js-websocket";
import {
  cameraSupportsHls,
  cameraSupportsWebRtc,
  ensureFreshAccessToken,
  getCameraCapabilities,
  getCameraHlsUrl,
  getCameraMjpegUrl,
  getCameraPosterUrl,
  useHA,
  type CameraCapabilities,
} from "@casaboard/ha";
import { clientLogger } from "@repo/lib";
import {
  startWebRtcStream,
  type WebRtcStreamHandle,
} from "./startWebRtcStream";

export type CameraStreamMode = "webrtc" | "hls" | "mjpeg" | "idle";

export interface UseCameraStreamOptions {
  entityId: string;
  enabled: boolean;
  supportedFeatures?: number;
  /** Skip IntersectionObserver and treat the player as always on-screen (e.g. modal). */
  forceVisible?: boolean;
}

/** Keep streams warm briefly when scrolling away to avoid full renegotiation. */
const HIDE_TEARDOWN_MS = 2500;
const VIDEO_READY_TIMEOUT_MS = 2000;

async function waitForVideoElement(
  getVideo: () => HTMLVideoElement | null,
  signal: AbortSignal,
  timeoutMs = VIDEO_READY_TIMEOUT_MS
): Promise<HTMLVideoElement> {
  const started = Date.now();
  while (!signal.aborted) {
    const video = getVideo();
    if (video) return video;
    if (Date.now() - started > timeoutMs) {
      throw new Error("Video element not ready");
    }
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }
  throw new Error("Stream start cancelled");
}

export function useCameraStream({
  entityId,
  enabled,
  supportedFeatures,
  forceVisible = false,
}: UseCameraStreamOptions) {
  const { connection, auth, hassUrl } = useHA();
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const webrtcRef = useRef<WebRtcStreamHandle | null>(null);
  const accessTokenRef = useRef<string | null>(null);
  const [isVisible, setIsVisible] = useState(forceVisible);
  const [mode, setMode] = useState<CameraStreamMode>("idle");
  const [mjpegUrl, setMjpegUrl] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainerEl(node);
  }, []);

  const attachActiveStream = useCallback((video: HTMLVideoElement) => {
    if (webrtcRef.current) {
      webrtcRef.current.attach(video);
      return;
    }
    if (hlsRef.current) {
      hlsRef.current.attachMedia(video);
      return;
    }
  }, []);

  const videoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoElRef.current = node;
      if (node) attachActiveStream(node);
    },
    [attachActiveStream]
  );

  const teardown = useCallback(() => {
    if (webrtcRef.current) {
      webrtcRef.current.destroy();
      webrtcRef.current = null;
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    const video = videoElRef.current;
    if (video) {
      video.srcObject = null;
      video.removeAttribute("src");
      video.load();
    }
    setMjpegUrl(null);
    setMode("idle");
    setLoading(false);
  }, []);

  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }
    if (!containerEl) return;

    let hideTimer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (hideTimer !== undefined) {
            window.clearTimeout(hideTimer);
            hideTimer = undefined;
          }
          setIsVisible(true);
          return;
        }
        if (hideTimer !== undefined) return;
        hideTimer = window.setTimeout(() => {
          hideTimer = undefined;
          setIsVisible(false);
        }, HIDE_TEARDOWN_MS);
      },
      { threshold: 0.05, rootMargin: "120px 0px" }
    );
    observer.observe(containerEl);
    return () => {
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
      observer.disconnect();
    };
  }, [containerEl, forceVisible]);

  const shouldStream = enabled && (forceVisible || isVisible);

  useEffect(() => {
    const abort = new AbortController();

    const startHls = async (
      conn: Connection,
      urlBase: string,
      token: string,
      video: HTMLVideoElement
    ) => {
      const playlistUrl = await getCameraHlsUrl(conn, urlBase, entityId);
      if (abort.signal.aborted) return;

      if (Hls.isSupported()) {
        const hls = new Hls({
          lowLatencyMode: true,
          maxBufferLength: 6,
          maxMaxBufferLength: 12,
          liveSyncDurationCount: 1,
          enableWorker: true,
          xhrSetup: (xhr) => {
            const latest = accessTokenRef.current ?? token;
            xhr.setRequestHeader("Authorization", `Bearer ${latest}`);
          },
        });
        hlsRef.current = hls;
        hls.loadSource(playlistUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          void video.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (!data.fatal || abort.signal.aborted) return;
          clientLogger.error("useCameraStream", "HLS fatal error", data);
          hls.destroy();
          hlsRef.current = null;
          setMjpegUrl(getCameraMjpegUrl(urlBase, entityId, token));
          setMode("mjpeg");
        });
        setMode("hls");
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        const nativeUrl = new URL(playlistUrl);
        nativeUrl.searchParams.set("token", token);
        video.src = nativeUrl.toString();
        void video.play().catch(() => {});
        setMode("hls");
        return;
      }

      setMjpegUrl(getCameraMjpegUrl(urlBase, entityId, token));
      setMode("mjpeg");
    };

    const start = async () => {
      if (!shouldStream || !entityId || !connection || !auth || !hassUrl) {
        teardown();
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [accessToken, caps] = await Promise.all([
          ensureFreshAccessToken(auth),
          getCameraCapabilities(connection, entityId).catch(
            () => null as CameraCapabilities | null
          ),
        ]);
        if (abort.signal.aborted) return;

        accessTokenRef.current = accessToken;
        setPosterUrl(getCameraPosterUrl(hassUrl, entityId, accessToken));

        const video = await waitForVideoElement(
          () => videoElRef.current,
          abort.signal
        );
        if (abort.signal.aborted) return;

        const preferWebRtc = cameraSupportsWebRtc(caps);
        const canHls = cameraSupportsHls(caps, supportedFeatures);

        if (preferWebRtc) {
          try {
            const handle = await startWebRtcStream(connection, entityId, {
              signal: abort.signal,
            });
            if (abort.signal.aborted) {
              handle.destroy();
              return;
            }
            webrtcRef.current = handle;
            handle.attach(video);
            setMode("webrtc");
            return;
          } catch (err) {
            if (abort.signal.aborted) return;
            clientLogger.error(
              "useCameraStream",
              "WebRTC failed, falling back",
              err
            );
            video.srcObject = null;
          }
        }

        if (canHls) {
          await startHls(connection, hassUrl, accessToken, video);
          return;
        }

        setMjpegUrl(getCameraMjpegUrl(hassUrl, entityId, accessToken));
        setMode("mjpeg");
      } catch (err) {
        if (abort.signal.aborted) return;
        const message =
          err instanceof Error ? err.message : "Failed to start camera stream";
        clientLogger.error("useCameraStream", message, err);
        setError(message);
        teardown();
      } finally {
        if (!abort.signal.aborted) setLoading(false);
      }
    };

    void start();

    return () => {
      abort.abort();
      teardown();
    };
  }, [
    shouldStream,
    entityId,
    connection,
    auth,
    hassUrl,
    supportedFeatures,
    teardown,
  ]);

  // Refresh bearer token periodically for long-lived HLS segment fetches.
  useEffect(() => {
    if (!shouldStream || !auth || mode !== "hls") return;
    const id = window.setInterval(() => {
      void ensureFreshAccessToken(auth)
        .then((token) => {
          accessTokenRef.current = token;
        })
        .catch(() => {});
    }, 60_000);
    return () => window.clearInterval(id);
  }, [shouldStream, auth, mode]);

  return {
    containerRef,
    videoRef,
    mode,
    mjpegUrl,
    posterUrl,
    error,
    loading,
    isVisible: forceVisible || isVisible,
  };
}
