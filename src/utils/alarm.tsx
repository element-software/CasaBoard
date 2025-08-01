import { HassEntityWithService } from "@hakit/core";
import { mdiShieldLock, mdiShieldLockOpen, mdiShieldAlert } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";

export const stateClassNameBg = (
  entity: HassEntityWithService<"alarmControlPanel">
) => {
  switch (entity.state) {
    case "disarmed":
      return "bg-gray-800";
    case "armed_night":
      return "bg-stone-800";
    default:
      return "";
  }
};

export const renderIcon = (
  entity: HassEntityWithService<"alarmControlPanel">
) => {
  switch (entity.state) {
    case "armed_night":
      return (
        <Icon
          path={mdiShieldLock}
          className={classNames("h-12 w-12", "text-theme-primary")}
          aria-hidden="true"
        />
      );
    case "disarmed":
      return (
        <Icon
          path={mdiShieldLockOpen}
          className={classNames("h-12 w-12", "text-gray-400")}
          aria-hidden="true"
        />
      );
    default:
      return (
        <Icon
          path={mdiShieldAlert}
          className={classNames("h-12 w-12", "text-red-500")}
          aria-hidden="true"
        />
      );
  }
};
