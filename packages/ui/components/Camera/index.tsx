"use client";

import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiCamera } from "@mdi/js";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Skeleton,
} from "@heroui/react";
import { useEntity } from "@casaboard/ha";
import { useEntityLoading } from "@repo/hooks/useEntityLoading";
import { CardShell } from "../Shared/Card";
import { CameraPlayer } from "./CameraPlayer";
import { useCameraStream } from "./useCameraStream";

export interface CameraProps {
  entityId: string;
  audioEnabled?: boolean;
  showName?: boolean;
  [key: string]: unknown;
}

export const Camera = ({
  entityId,
  audioEnabled = false,
  showName = true,
}: CameraProps) => {
  const entity = useEntity(entityId);
  const { isEntityReady, showNotAvailable, isLoaded } = useEntityLoading(entity);
  const [muted, setMuted] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const supportedFeatures =
    typeof entity?.attributes?.supported_features === "number"
      ? entity.attributes.supported_features
      : undefined;

  // Only one live stream at a time: card when collapsed, modal when expanded.
  const cardStream = useCameraStream({
    entityId,
    enabled: isEntityReady && !expanded,
    supportedFeatures,
  });

  const modalStream = useCameraStream({
    entityId,
    enabled: isEntityReady && expanded,
    supportedFeatures,
    forceVisible: true,
  });

  const activeStream = expanded ? modalStream : cardStream;
  const showConnecting =
    isEntityReady &&
    !activeStream.error &&
    (activeStream.loading ||
      (activeStream.mode === "idle" && activeStream.isVisible));

  useEffect(() => {
    const video = activeStream.videoRef.current;
    if (!video) return;
    video.muted = muted || !audioEnabled;
  }, [muted, audioEnabled, activeStream.videoRef, activeStream.mode, expanded]);

  useEffect(() => {
    if (!audioEnabled) setMuted(true);
  }, [audioEnabled]);

  if (!entityId) {
    return (
      <div className="p-4 border-2 border-dashed border-theme-border rounded-xl text-center text-theme-text-muted">
        <Icon path={mdiCamera} className="h-12 w-12 mx-auto mb-2 opacity-40" />
        Configure Camera Entity
      </div>
    );
  }

  const name =
    entity?.attributes?.friendly_name || entityId.replace(/^camera\./, "");
  const canToggleAudio = audioEnabled && activeStream.mode === "hls";

  return (
    <>
      <Skeleton
        isLoaded={isLoaded}
        className="flex h-full w-full flex-col rounded-xl"
        classNames={{ content: "flex h-full min-h-0 w-full flex-1 flex-col" }}
      >
        {showNotAvailable ? (
          <CardShell status="unavailable" className="min-h-[160px]">
            <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 p-4 text-theme-text-muted">
              <Icon path={mdiCamera} className="h-8 w-8 opacity-50" />
              <span className="text-sm">{entityId}</span>
              <span className="text-xs">Unavailable</span>
            </div>
          </CardShell>
        ) : (
          <CardShell
            status="on"
            domain="camera"
            interactive
            className="relative min-h-[160px] bg-black"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("button")) return;
              setExpanded(true);
            }}
          >
            {expanded ? (
              // Poster placeholder while the live stream runs in the modal
              <div className="relative h-full min-h-[160px] w-full bg-black">
                {cardStream.posterUrl || modalStream.posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={
                      (cardStream.posterUrl || modalStream.posterUrl) as string
                    }
                    alt={name}
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                    draggable={false}
                  />
                ) : (
                  <div className="flex h-full min-h-[160px] items-center justify-center text-white/50 text-sm">
                    Expanded
                  </div>
                )}
                {showName && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <span className="truncate text-sm font-medium text-white drop-shadow">
                      {name}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[160px] w-full">
                <CameraPlayer
                  name={name}
                  showName={showName}
                  mode={cardStream.mode}
                  mjpegUrl={cardStream.mjpegUrl}
                  posterUrl={cardStream.posterUrl}
                  error={cardStream.error}
                  showConnecting={showConnecting}
                  muted={muted || !audioEnabled}
                  canToggleAudio={canToggleAudio}
                  onToggleMute={() => setMuted((m) => !m)}
                  containerRef={cardStream.containerRef}
                  videoRef={cardStream.videoRef}
                />
              </div>
            )}
          </CardShell>
        )}
      </Skeleton>

      <Modal
        isOpen={expanded}
        onClose={() => setExpanded(false)}
        size="5xl"
        backdrop="blur"
        classNames={{
          base: "bg-black text-white max-w-[min(96vw,1200px)]",
          body: "p-0",
          header: "border-b border-white/10",
          closeButton: "text-white hover:bg-white/10",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-2 text-base font-medium">
            <Icon path={mdiCamera} className="h-5 w-5 opacity-80" />
            {name}
          </ModalHeader>
          <ModalBody>
            <div className="relative aspect-video w-full max-h-[80vh] bg-black">
              <CameraPlayer
                name={name}
                showName={false}
                mode={modalStream.mode}
                mjpegUrl={modalStream.mjpegUrl}
                posterUrl={modalStream.posterUrl}
                error={modalStream.error}
                showConnecting={
                  !modalStream.error &&
                  (modalStream.loading || modalStream.mode === "idle")
                }
                muted={muted || !audioEnabled}
                canToggleAudio={audioEnabled && modalStream.mode === "hls"}
                onToggleMute={() => setMuted((m) => !m)}
                containerRef={modalStream.containerRef}
                videoRef={modalStream.videoRef}
                objectFit="contain"
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Camera;
