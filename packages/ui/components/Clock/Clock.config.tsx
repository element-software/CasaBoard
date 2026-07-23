"use client";

import Clock from ".";

export const ClockConfig = {
  label: "Clock",
  fields: {
    align: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    hourFormat: {
      type: "radio",
      label: "Time Format",
      description: "Auto follows the device's 12/24-hour preference",
      options: [
        { label: "Auto (device)", value: "auto" },
        { label: "12-hour", value: "12" },
        { label: "24-hour", value: "24" },
      ],
    },
  },
  defaultProps: {
    align: "left",
    hourFormat: "auto",
  },
  render: (props: any) => <Clock {...props} />,
};
