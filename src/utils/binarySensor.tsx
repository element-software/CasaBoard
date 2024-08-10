import { HassEntityWithService } from "@hakit/core";
import {
  mdiDoorClosed,
  mdiDoorOpen,
  mdiMotionSensor,
  mdiMotionSensorOff,
} from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";

export const stateClassNameBg = (
  entity: HassEntityWithService<"binarySensor">
) => {
  switch (entity.state) {
    case "off":
      return "bg-gray-800";
    case "on":
      return "bg-stone-800";
    default:
      return "";
  }
};

export const stateClassNameIcon = (
  entity: HassEntityWithService<"binarySensor">
) => {
  switch (entity.state) {
    case "on":
      return "text-amber-500";
    case "off":
      return "text-gray-400";
    default:
      return "text-amber-500";
  }
};

export const renderIcon = (entity: HassEntityWithService<"binarySensor">) => {
  if (entity.attributes.device_class === "occupancy") {
    switch (entity.state) {
      case "on":
        return (
          <Icon
            path={mdiMotionSensor}
            className={classNames("h-10 w-10", "text-amber-500")}
            aria-hidden="true"
          />
        );
      case "off":
        return (
          <Icon
            path={mdiMotionSensorOff}
            className={classNames("h-10 w-10", "text-gray-400")}
            aria-hidden="true"
          />
        );
      default:
        return (
          <Icon
            path={mdiDoorOpen}
            className={classNames("h-10 w-10", "text-red-500")}
            aria-hidden="true"
          />
        );
    }
  }

  if (entity.attributes.device_class === "door") {
    switch (entity.state) {
      case "on":
        return (
          <Icon
            path={mdiDoorOpen}
            className={classNames("h-12 w-12", "text-amber-500")}
            aria-hidden="true"
          />
        );
      case "off":
        return (
          <Icon
            path={mdiDoorClosed}
            className={classNames("h-12 w-12", "text-gray-400")}
            aria-hidden="true"
          />
        );
      default:
        return (
          <Icon
            path={mdiDoorOpen}
            className={classNames("h-12 w-12", "text-red-500")}
            aria-hidden="true"
          />
        );
    }
  }
};

export const renderState = (entity: HassEntityWithService<"binarySensor">) => {
  if (entity.attributes.device_class === "occupancy") {
    switch (entity.state) {
      case "on":
        return "Occupied";
      case "off":
        return "Clear";
      default:
        return "Unknown";
    }
  }

  if (entity.attributes.device_class === "door") {
    switch (entity.state) {
      case "on":
        return "Open";
      case "off":
        return "Closed";
      default:
        return "Unknown";
    }
  }

  if (entity.attributes.device_class === "running") {
    switch (entity.state) {
      case "on":
        return "Running";
      case "off":
        return "Not Running";
      default:
        return "Unknown";
    }
  }
};
