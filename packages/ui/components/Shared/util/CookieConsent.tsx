"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Link as UiLink,
} from "@heroui/react";
import { CasaBoardLogo } from "../../Logo";

type CookieConsentProps = {
  onAccept?: () => void;
  onReject?: () => void;
};

const CONSENT_KEY = "casaboard-cookie-consent";

export function getCookieConsent(): "accepted" | "rejected" | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(CONSENT_KEY) as any) || null;
}

export function setCookieConsent(value: "accepted" | "rejected") {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {}
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onAccept,
  onReject,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const existing = getCookieConsent();
    if (!existing) setOpen(true);
  }, []);

  const handleAccept = () => {
    setCookieConsent("accepted");
    setOpen(false);
    onAccept?.();
  };

  const handleReject = () => {
    setCookieConsent("rejected");
    setOpen(false);
    onReject?.();
  };

  return (
    <Modal
      isOpen={open}
      onOpenChange={setOpen}
      placement="bottom-center"
      backdrop="blur"
      closeButton={false}
    >
      <ModalContent className="bg-theme-background text-theme-text border border-theme-border">
        <ModalHeader className="flex flex-col items-center gap-3 text-theme-text">
          <CasaBoardLogo size="small"/>
          <span className="font-semibold">Cookies & Privacy</span>
        </ModalHeader>
        <ModalBody className="text-theme-text-secondary">
          <p>
            CasaBoard uses analytics cookies to help us understand usage and improve the product. You can
            choose whether to enable analytics. Your choice will be stored on this device.
          </p>
          <div className="text-sm">
            <UiLink
              href="https://casaboard.dev/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-text-primary hover:opacity-80"
            >
              Privacy Policy
            </UiLink>
            <span className="mx-2">•</span>
            <UiLink
              href="https://casaboard.dev/cookies"
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-text-primary hover:opacity-80"
            >
              Cookie Policy
            </UiLink>
          </div>
        </ModalBody>
        <ModalFooter className="justify-between">
          <Button
            variant="bordered"
            onPress={handleReject}
            className="text-theme-text border-theme-border"
          >
            Reject
          </Button>
          <div className="flex gap-2 grow ">
            <Button color="primary" variant="solid" onPress={handleAccept} className="text-black w-full bg-theme-primary">
              Accept
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
