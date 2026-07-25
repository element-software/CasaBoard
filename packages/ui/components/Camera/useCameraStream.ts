"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  cameraSupportsHls,
  ensureFreshAccessToken,
  getCameraCapabilities,
  getCameraHlsUrl,
  getCameraMjpegUrl,
  getCameraPosterUrl,
  useHA,
} from "@casaboard/ha";
import { clientLogger } from "@repo/lib";

export type CameraStreamMode = "hls" | "mjpeg" | "idle";

export interface UseCameraStreamOptions {
  entityId: string;
  enabled: boolean;
  supportedFeatures?: number;
  /** Skip IntersectionObserver and treat the player as always on-screen (e.g. modal). */
  forceVisible?: boolean;
}

export function useCameraStream({
  entityId,
  enabled,
  supportedFeatures,
  forceVisible = false,
}: UseCameraStreamOptions) {
  const { connection, auth, hassUrl } = useHA();
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isVisible, setIsVisible] = useState(forceVisible);
  const [mode, setMode] = useState<CameraStreamMode>("idle");
  const [mjpegUrl, setMjpegUrl] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainerEl(node);
  }, []);

  const teardown = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.25 }
    );
    observer.observe(containerEl);
    return () => observer.disconnect();
  }, [containerEl, forceVisible]);

  const shouldStream = enabled && (forceVisible || isVisible);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      if (!shouldStream || !entityId || !connection || !auth || !hassUrl) {
        teardown();
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const accessToken = await ensureFreshAccessToken(auth);
        if (cancelled) return;

        setPosterUrl(getCameraPosterUrl(hassUrl, entityId, accessToken));

        let useHls = false;
        try {
          const caps = await getCameraCapabilities(connection, entityId);
          useHls = cameraSupportsHls(caps, supportedFeatures);
        } catch {
          useHls = cameraSupportsHls(null, supportedFeatures);
        }
        if (cancelled) return;

        if (useHls) {
          const playlistUrl = await getCameraHlsUrl(connection, hassUrl, entityId);
          if (cancelled) return;

          const video = videoRef.current;
          if (!video) {
            throw new Error("Video element not ready");
          }

          if (Hls.isSupported()) {
            const hls = new Hls({
              lowLatencyMode: true,
              maxBufferLength: 10,
              maxMaxBufferLength: 20,
              liveSyncDurationCount: 2,
              enableWorker: true,
              xhrSetup: (xhr) => {
                xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
              },
            });
            hlsRef.current = hls;
            hls.loadSource(playlistUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              void video.play().catch(() => {
                // Autoplay may be blocked until muted — card keeps muted by default.
              });
            });
            hls.on(Hls.Events.ERROR, (_event, data) => {
              if (!data.fatal || cancelled) return;
              clientLogger.error("useCameraStream", "HLS fatal error", data);
              hls.destroy();
              hlsRef.current = null;
              setMjpegUrl(getCameraMjpegUrl(hassUrl, entityId, accessToken));
              setMode("mjpeg");
            });
            setMode("hls");
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            const nativeUrl = new URL(playlistUrl);
            nativeUrl.searchParams.set("token", accessToken);
            video.src = nativeUrl.toString();
            void video.play().catch(() => {});
            setMode("hls");
          } else {
            setMjpegUrl(getCameraMjpegUrl(hassUrl, entityId, accessToken));
            setMode("mjpeg");
          }
        } else {
          setMjpegUrl(getCameraMjpegUrl(hassUrl, entityId, accessToken));
          setMode("mjpeg");
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to start camera stream";
        clientLogger.error("useCameraStream", message, err);
        setError(message);
        teardown();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void start();

    return () => {
      cancelled = true;
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
