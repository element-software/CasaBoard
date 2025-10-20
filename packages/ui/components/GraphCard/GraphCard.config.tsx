"use client";

import { EntityField } from "../EntityAutocomplete/EntityField";
import GraphCard from "./index";

export const GraphCardConfig = {
  label: "Graph Card",
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
          domain="sensor"
          label="Sensor Entity"
          description="Select a sensor entity from your Home Assistant"
        />
      ),
    },
    defaultProps: {
      entityId: "",
    },
  },
  render: (props: any) =>  <GraphCard {...props} />
};  
