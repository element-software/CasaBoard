"use client";
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

export const AlarmConfirmPopup = ({
  action,
  isOpen,
  onClose,
  onConfirm,
}: AlarmConfirmPopupProps) => {
  const [pin, setPin] = useState("");
  const isDisarm = action === "alarm_disarm";

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
  const canConfirm = !isDisarm || pin.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      classNames={{
        base: "hk-modal bg-white opacity-100",
        backdrop: "hk-modal__backdrop",
        wrapper: "items-center",
        closeButton: "hidden",
      }}
    >
      <ModalContent className="hk-modal__content bg-white opacity-100">
        <ModalBody className="hk-modal__body bg-white">
          <button
            type="button"
            className="hk-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>

          <div className="hk-modal__stack">
            <div className="hk-modal__header">
              <p className="hk-modal__eyebrow">
                {isDisarm ? "Security" : "Confirm action"}
              </p>
              <h2 className="hk-modal__title">
                {isDisarm ? "Enter PIN to Disarm" : label}
              </h2>
              {!isDisarm && (
                <p className="hk-modal__desc">
                  Are you sure you want to {label.toLowerCase()}?
                </p>
              )}
            </div>

            {isDisarm && (
              <>
                <div className="hk-modal__pin">
                  {pin.length === 0 ? (
                    <span className="hk-modal__pin-placeholder">● ● ● ●</span>
                  ) : (
                    <div className="hk-modal__pin-dots">
                      {Array.from({ length: pin.length }).map((_, i) => (
                        <span key={i} className="hk-modal__pin-dot" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="hk-modal__keypad">
                  {KEYPAD_KEYS.map((key, i) => {
                    if (key === "") return <div key={i} />;
                    return (
                      <button
                        key={i}
                        type="button"
                        className={classNames(
                          "hk-modal__key",
                          key === "del" && "hk-modal__key--del"
                        )}
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
            )}

            <div className="hk-modal__actions">
              <button
                type="button"
                className="hk-modal__btn hk-modal__btn--cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className={classNames(
                  "hk-modal__btn hk-modal__btn--primary",
                  isDisarm && "hk-modal__btn--danger",
                  !canConfirm && "hk-modal__btn--disabled"
                )}
                disabled={!canConfirm}
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
