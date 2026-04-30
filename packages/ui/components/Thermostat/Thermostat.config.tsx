"use client";

import { Thermostat } from "./Thermostat";
import EntityField from "../EntityAutocomplete/EntityField";

export const ThermostatConfig = {
  label: "Thermostat",
  fields: {
    entityId: {
      type: "custom",
      label: "Climate Entity",
      description: "Select a climate entity from your Home Assistant",
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
          domain="climate"
          label="Climate Entity"
          description="Select a climate entity from your Home Assistant"
        />
      ),
    },
  },
  defaultProps: {
    entityId: "",
  },
  render: (props: any) => <Thermostat {...props} />,
};
