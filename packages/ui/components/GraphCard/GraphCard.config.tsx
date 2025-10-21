"use client";

import { EntityField } from "../EntityAutocomplete/EntityField";
import GraphCard from "./index";

export const GraphCardConfig = {
  label: "Graph Card",
  fields: {
    entityId: {
      type: "custom",
      label: "Sensor Entity",
      description: "Select a sensor entity from your Home Assistant",
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
    showStatistics: {
      type: "radio",
      label: "Show Statistics",
      description: "Show statistics on the graph card",
      options: [
        { value: true, label: "Enabled" },
        { value: false, label: "Disabled" },
      ],
    },
  },
  defaultProps: {
    entityId: "",
    showStatistics: false,
  },
  render: (props: any) =>  <GraphCard {...props} showStatistics={props.showStatistics} />
};  
