"use client";
import { useState } from "react";
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";

export interface AddInstanceProps {
  form: { name: string; hass_url: string };
  setForm: (form: { name: string; hass_url: string }) => void;
  onCreate: () => void;
  canCreate: () => boolean;
  isPending: boolean;
}

export const AddInstance = ({
  form,
  setForm,
  onCreate,
  canCreate,
  isPending,
}: AddInstanceProps) => {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const handleOpenConfirm = () => {
		if (!canCreate() || !form.hass_url) return;
		setIsConfirmOpen(true);
	};

	const handleConfirm = () => {
		setIsConfirmOpen(false);
		onCreate();
	};

  return (
    <>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          description="The name for this instance"
          required
        />
        <Input
          label="HA URL"
          value={form.hass_url}
          onChange={(e) => setForm({ ...form, hass_url: e.target.value })}
          description="Home Assistant URL (e.g., your-domain.com) - do not include the protocol (https://) or the port (8123)"
          placeholder="your-domain.com"
          startContent={
            <span className="text-primary-400 text-sm">https://</span>
          }
          required
        />
      </div>
      <div className="flex justify-end">
        <Button
          color="primary"
          onPress={handleOpenConfirm}
          isDisabled={!canCreate() || !form.hass_url || !form.name}
          isLoading={isPending}
        >
          Add instance
        </Button>
      </div>

      <Modal isOpen={isConfirmOpen} onOpenChange={setIsConfirmOpen} backdrop="blur">
        <ModalContent className="bg-theme-background text-theme-text border border-theme-border">
          <ModalHeader className="flex flex-col gap-1">Confirm add instance</ModalHeader>
          <ModalBody>
            <p>
              You will be redirected through the Home Assistant authentication flow to authorize access.
            </p>
          </ModalBody>
          <ModalFooter className="justify-between">
            <Button variant="light" onPress={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleConfirm} isLoading={isPending}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
