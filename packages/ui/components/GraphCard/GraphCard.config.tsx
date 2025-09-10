"use client";

import GraphCard from "./index";

export const GraphCardConfig = {
  label: "Graph Card",
  fields: {
    entity: {
      type: "text",
      label: "Entity ID",
    },
  },
  render: (props: any) => <GraphCard {...props} />
};
