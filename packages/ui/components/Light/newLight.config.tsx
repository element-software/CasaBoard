"use client";

import { NewLight } from "./newLight";
import { EntityField } from "../EntityAutocomplete/EntityField";

export const NewLightConfig = {
  label: "Light",
  fields: {
    entityId: {
      type: "custom",
      label: "Light Entity",
      description: "Select a light entity from your Home Assistant",
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
          domain="light"
          label="Light Entity"
          description="Select a light entity from your Home Assistant"
        />
      ),
    },
  },
  defaultProps: {
    entityId: "",
  },
  render: (props: any) => <NewLight {...props} />,
};
