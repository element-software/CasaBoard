"use client";

import { Light } from ".";
import { HassConnectWrapper } from "../HassConnectWrapper";
import { EntityField } from "../EntityAutocomplete/EntityField";

export const LightConfig = {
  label: "Light",
  fields: {
    entityId: {
      type: "custom",
      label: "Light Entity",
      description: "Select a light entity from your Home Assistant",
      render: ({ value, onChange }: { value?: string; onChange: (value: string | null) => void }) => (
        <EntityField
          value={value}
          onChange={onChange}
          domain="light"
          label="Light Entity"
          description="Select a light entity from your Home Assistant"
        />
      ),
    },
    dimmer: {
      type: "radio",
      label: "Dimmer Control",
      description: "Enable brightness control with drag interaction",
      options: [
        { value: true, label: "Enabled" },
        { value: false, label: "Disabled" },
      ],
    },
    temperature: {
      type: "radio",
      label: "Temperature Control",
      options: [
        { value: true, label: "Enabled" },
        { value: false, label: "Disabled" },
      ],
    },
    color: {
      type: "radio",
      label: "Color Control",
      options: [
        { value: true, label: "Enabled" },
        { value: false, label: "Disabled" },
      ],
    },
  },
  defaultProps: {
    entityId: "",
    dimmer: true,
    temperature: false,
    color: false,
  },
  render: (props: any) => (
    <HassConnectWrapper
      userSettings={props.userSettings}
      decryptedToken={props.decryptedToken}
    >
      <Light {...props} />
    </HassConnectWrapper>
  ),
};
