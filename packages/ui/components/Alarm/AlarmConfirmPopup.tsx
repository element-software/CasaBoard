"use client";
import { Button } from "@heroui/react";
import { XMarkIcon, BackspaceIcon } from "@heroicons/react/24/outline";
import { Modal, ModalContent, ModalBody } from "@heroui/react";
import { useEffect, useState } from "react";
import classNames from "classnames";
import type { AlarmAction } from "./index";

const ACTION_CONFIRM_LABEL: Record<Exclude<AlarmAction, "none">, string> = {
  alarm_disarm: "Disarm",
  alarm_arm_home: "Arm Home",
  alarm_arm_away: "Arm Away",
  alarm_arm_night: "Arm Night",
  alarm_arm_vacation: "Arm Vacation",
  alarm_trigger: "Trigger Alarm",
};

const KEYPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"] as const;

interface AlarmConfirmPopupProps {
  action: Exclude<AlarmAction, "none"> | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (code?: string) => void;
}

export const AlarmConfirmPopup = ({ action, isOpen, onClose, onConfirm }: AlarmConfirmPopupProps) => {
  const [pin, setPin] = useState("");
  // Render the modal inside the nearest ThemeScope so CSS variables are inherited
  const [portalContainer, setPortalContainer] = useState<HTMLElement | undefined>(undefined);
  const isDisarm = action === "alarm_disarm";

  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-casaboard-theme]");
    setPortalContainer(el ?? undefined);
  }, []);

  useEffect(() => {
    if (isOpen) setPin("");
  }, [isOpen]);

  const handleKey = (key: string) => {
    if (key === "del") {
      setPin((p) => p.slice(0, -1));
    } else {
      setPin((p) => (p.length < 10 ? p + key : p));
    }
  };

  const handleConfirm = () => {
    if (isDisarm && pin.length === 0) return;
    onConfirm(isDisarm ? pin : undefined);
  };

  const label = action ? ACTION_CONFIRM_LABEL[action] : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      portalContainer={portalContainer}
      classNames={{
        base: "bg-theme-surface border border-theme-border shadow-2xl",
        backdrop: "bg-black/60 backdrop-blur-sm",
        closeButton: "hidden",
      }}
    >
      <ModalContent>
        <ModalBody className="relative p-5">
          <button
            className="absolute top-3 right-3 p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-interactive-hover transition-colors z-10"
            onClick={onClose}
            aria-label="Close"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center gap-5 pt-1">
            {/* Title */}
            <div className="flex flex-col items-center gap-1 text-center">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-theme-text-muted">
                {isDisarm ? "Security" : "Confirm action"}
              </h2>
              <p className="text-lg font-semibold text-theme-text">
                {isDisarm ? "Enter PIN to Disarm" : label}
              </p>
            </div>

            {isDisarm ? (
              <>
                {/* PIN dot display */}
                <div
                  className="w-full rounded-xl px-4 py-3 flex items-center justify-center min-h-[48px]"
                  style={{ background: "var(--theme-elevated)" }}
                >
                  {pin.length === 0 ? (
                    <span className="text-sm text-theme-text-muted tracking-widest select-none">
                      ● ● ● ● ●
                    </span>
                  ) : (
                    <div className="flex gap-2.5 items-center">
                      {Array.from({ length: pin.length }).map((_, i) => (
                        <div
                          key={i}
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: "var(--theme-primary)" }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2 w-full">
                  {KEYPAD_KEYS.map((key, i) => {
                    if (key === "") return <div key={i} />;
                    return (
                      <button
                        key={i}
                        className={classNames(
                          "h-12 rounded-xl font-medium text-lg select-none transition-all duration-100",
                          "text-theme-text border border-theme-border",
                          "active:scale-95",
                          key === "del" && "flex items-center justify-center"
                        )}
                        style={{
                          background: "var(--theme-card-background)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "var(--theme-interactive-hover)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "var(--theme-card-background)";
                        }}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          handleKey(key);
                        }}
                      >
                        {key === "del" ? (
                          <BackspaceIcon className="h-5 w-5 mx-auto" />
                        ) : (
                          key
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-theme-text-muted text-center pb-1">
                Are you sure you want to {label.toLowerCase()}?
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 w-full">
              <button
                className="flex-1 h-10 rounded-xl text-sm font-medium text-theme-text border border-theme-border transition-colors"
                style={{ background: "var(--theme-card-background)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--theme-interactive-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--theme-card-background)";
                }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className={classNames(
                  "flex-1 h-10 rounded-xl text-sm font-semibold transition-all",
                  isDisarm && pin.length === 0
                    ? "opacity-40 cursor-not-allowed text-theme-text-on-primary"
                    : "text-theme-text-on-primary active:scale-[0.98]"
                )}
                style={{
                  background: isDisarm
                    ? "var(--theme-error)"
                    : "var(--theme-primary)",
                }}
                disabled={isDisarm && pin.length === 0}
                onClick={handleConfirm}
              >
                {label}
              </button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
