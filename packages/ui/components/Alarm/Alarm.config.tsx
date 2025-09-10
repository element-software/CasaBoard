"use client";

import { Alarm } from ".";

export const AlarmConfig = {
  label: "Alarm",
  fields: {
    entityId: {
      type: "text",
      label: "Entity ID",
    },
  },
  defaultProps: {
    entityId: "alarm_control_panel.example",
  },
  render: (props: any) => <Alarm {...props} />
};
