import { Input, Button } from "@heroui/react";

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
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          description="The name for this instance"
        />
        <Input
          label="HA URL"
          value={form.hass_url}
          onChange={(e) => setForm({ ...form, hass_url: e.target.value })}
          description="Home Assistant URL (e.g., http://homeassistant.local:8123)"
        />
      </div>
      <div className="flex justify-end">
        <Button
          color="primary"
          onPress={onCreate}
          isDisabled={!canCreate() || !form.hass_url}
          isLoading={isPending}
        >
          Add instance
        </Button>
      </div>
    </>
  );
};
