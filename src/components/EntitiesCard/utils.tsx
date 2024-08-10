import { HassEntityWithService } from "@hakit/core";
import { mdiCountertop, mdiDiamondStone, mdiDishwasher, mdiDoor, mdiFileCabinet, mdiLedStripVariant, mdiLightRecessed, mdiLightbulb, mdiMotionSensor, mdiToasterOven, mdiTrackLight, mdiTumbleDryer, mdiWashingMachine } from "@mdi/js";
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

  // check the type and return the appropriate icon from the utils folder
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
    case "mdiMotionSensor":
      return <Icon path={mdiMotionSensor} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    case "mdiDishwasher":
      return <Icon path={mdiDishwasher} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    case "mdiOven":
      return <Icon path={mdiToasterOven} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    case "mdiTumbleDryer":
      return <Icon path={mdiTumbleDryer} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    case "mdiWashingMachine":
      return <Icon path={mdiWashingMachine} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
    default:
      return <Icon path={mdiLightbulb} className={classNames("h-10 w-10", stateClassNameIcon(entity))}/>;
  }
}