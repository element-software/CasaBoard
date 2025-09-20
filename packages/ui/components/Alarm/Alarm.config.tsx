"use client";

import { Alarm } from ".";
import EntityField from "../EntityAutocomplete/EntityField";

export const AlarmConfig = {
  label: "Alarm",
  fields: {
    entityId: {
      type: "custom",
      label: "Switch Entity",
      description: "Select a switch entity from your Home Assistant",
      render: ({
        value,
        onChange,
      }: {
        value?: string;
        onChange: (value: string | null) => void;
      }) => (
        <EntityField
          value={value}
          onChange={onChange}
          domain="switch"
          label="Switch Entity"
          description="Select a switch entity from your Home Assistant"
        />
      ),
    },
  },
  defaultProps: {
    entityId: "",
  },
  render: (props: any) => <Alarm {...props} />,
};
