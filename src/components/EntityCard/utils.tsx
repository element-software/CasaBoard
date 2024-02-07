import { HassEntityWithService } from "@hakit/core";
import { mdiCountertop, mdiDiamondStone, mdiDoor, mdiFileCabinet, mdiLedStripVariant, mdiLightRecessed, mdiLightbulb, mdiToasterOven, mdiTrackLight } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";

export const stateClassNameIcon = (entity: HassEntityWithService<any>) => {
  switch (entity.state) {
    case "on":
      return "text-amber-500";
    case "off":
      return "text-gray-400";
    default:
      return "text-amber-500";
  }
};

export const renderIcon = (entity: HassEntityWithService<any>, icon: string) => {
  switch (icon) {
    case "mdiTrackLight":
      return <Icon path={mdiTrackLight} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    case "mdiDoor":
      return <Icon path={mdiDoor} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    case "mdiFileCabinet":
      return <Icon path={mdiFileCabinet} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    case "mdiToasterOven":
      return <Icon path={mdiToasterOven} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    case "mdiLightRecessed":
      return <Icon path={mdiLightRecessed} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    case "mdiDiamondStone":
      return <Icon path={mdiDiamondStone} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    case "mdiLightbulb":
      return <Icon path={mdiLightbulb} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    case "mdiCountertop":
      return <Icon path={mdiCountertop} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    case "mdiLedStripVariant":
      return <Icon path={mdiLedStripVariant} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    default:
      return <Icon path={mdiLightbulb} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
  }
}