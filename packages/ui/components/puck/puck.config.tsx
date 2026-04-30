"use client";
import { LightConfig } from "@repo/ui/components/Light/Light.config";
import { AlarmConfig } from "@repo/ui/components/Alarm/Alarm.config";
import { BinarySensorConfig } from "@repo/ui/components/BinarySensor/BinarySensor.config";
import { EntitiesCardConfig } from "@repo/ui/components/EntitiesCard/EntitiesCard.config";
import { GraphCardConfig } from "@repo/ui/components/GraphCard/GraphCard.config";
import { ClockConfig } from "@repo/ui/components/Clock/Clock.config";
import { ThermostatConfig } from "@repo/ui/components/Thermostat/Thermostat.config";
import { WeatherConfig } from "@repo/ui/components/Weather/Weather.config";
import { Config } from "@measured/puck";
import { GridConfig } from "@repo/ui/components/Grid/Grid.config";
import { cn } from "@heroui/react";

type Components = {
  Light: {};
  Alarm: {};
  BinarySensor: {};
  EntitiesCard: {};
  GraphCard: {};
  Clock: {};
  Grid: {};
  Thermostat: {};
  Weather: {};
};

const GAP_OPTIONS = [
  { label: "None", value: "gap-0" },
  { label: "8px", value: "gap-2" },
  { label: "16px", value: "gap-4" },
  { label: "24px", value: "gap-6" },
  { label: "32px", value: "gap-8" },
] as const;

const PADDING_OPTIONS = [
  { label: "None", value: "p-0" },
  { label: "8px", value: "p-2" },
  { label: "16px", value: "p-4" },
  { label: "24px", value: "p-6" },
  { label: "32px", value: "p-8" },
] as const;

const ALIGN_X_OPTIONS = [
  { label: "Start", value: "start" },
  { label: "Center", value: "center" },
  { label: "End", value: "end" },
  { label: "Space Between", value: "between" },
  { label: "Space Around", value: "around" },
  { label: "Space Evenly", value: "evenly" },
] as const;

const ALIGN_Y_OPTIONS = [
  { label: "Start", value: "start" },
  { label: "Center", value: "center" },
  { label: "End", value: "end" },
  { label: "Stretch", value: "stretch" },
  { label: "Baseline", value: "baseline" },
] as const;

const justifyClassMap: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const itemsClassMap: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const directionClassMap: Record<string, string> = {
  column: "flex-col",
  row: "flex-row",
  "column-reverse": "flex-col-reverse",
  "row-reverse": "flex-row-reverse",
};

const wrapClassMap: Record<string, string> = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
};

const ITEMS_ONLY = new Set([
  "start",
  "center",
  "end",
  "stretch",
  "baseline",
]);

/** align-items only supports a subset of keys; distribute values are invalid. */
function toItemsClass(align: string | undefined): string {
  const a = align ?? "stretch";
  if (ITEMS_ONLY.has(a)) return itemsClassMap[a] ?? "items-stretch";
  return "items-stretch";
}

function toJustifyClass(align: string | undefined): string {
  const a = align ?? "start";
  return justifyClassMap[a] ?? "justify-start";
}

/** Map screen-horizontal/vertical alignment to flex justify/items for the current direction. */
function rootFlexAlignment(
  direction: string | undefined,
  alignX: string | undefined,
  alignY: string | undefined
): { justify: string; items: string } {
  const ax = alignX ?? "start";
  const ay = alignY ?? "stretch";
  const isRow = direction === "row" || direction === "row-reverse";
  if (isRow) {
    return {
      justify: toJustifyClass(ax),
      items: toItemsClass(ay),
    };
  }
  return {
    justify: toJustifyClass(ay),
    items: toItemsClass(ax),
  };
}

function RootCanvas(props: any) {
  const {
    children,
    layoutDirection = "column",
    layoutGap = "gap-4",
    layoutPadding = "p-0",
    alignX = "start",
    alignY = "stretch",
    layoutWrap = "nowrap",
  } = props;

  const { justify, items } = rootFlexAlignment(
    layoutDirection,
    alignX,
    alignY
  );

  return (
    <div
      className={cn(
        "w-full mx-auto flex min-h-0",
        directionClassMap[layoutDirection] ?? "flex-col",
        layoutGap,
        layoutPadding,
        wrapClassMap[layoutWrap] ?? "flex-nowrap",
        justify,
        items
      )}
    >
      {children}
    </div>
  );
}

// Puck component configuration
export const PuckConfig: Config<Components> = {
  root: {
    label: "Page layout",
    fields: {
      layoutDirection: {
        type: "select",
        label: "Direction",
        options: [
          { label: "Column", value: "column" },
          { label: "Row", value: "row" },
          { label: "Column (reversed)", value: "column-reverse" },
          { label: "Row (reversed)", value: "row-reverse" },
        ],
      },
      layoutGap: {
        type: "select",
        label: "Gap",
        options: [...GAP_OPTIONS],
      },
      layoutPadding: {
        type: "select",
        label: "Padding",
        options: [...PADDING_OPTIONS],
      },
      layoutWrap: {
        type: "select",
        label: "Wrap",
        options: [
          { label: "No wrap", value: "nowrap" },
          { label: "Wrap", value: "wrap" },
          { label: "Wrap reverse", value: "wrap-reverse" },
        ],
      },
      alignX: {
        type: "select",
        label: "Align horizontal",
        options: [...ALIGN_X_OPTIONS],
      },
      alignY: {
        type: "select",
        label: "Align vertical",
        options: [...ALIGN_Y_OPTIONS],
      },
    },
    defaultProps: {
      layoutDirection: "column",
      layoutGap: "gap-4",
      layoutPadding: "p-0",
      layoutWrap: "nowrap",
      alignX: "start",
      alignY: "stretch",
    },
    render: (props: any) => <RootCanvas {...props} />,
  },
  components: {
    Light: LightConfig,
    Alarm: AlarmConfig,
    BinarySensor: BinarySensorConfig,
    EntitiesCard: EntitiesCardConfig,
    GraphCard: GraphCardConfig,
    Clock: ClockConfig,
    Grid: GridConfig,
    Thermostat: ThermostatConfig,
    Weather: WeatherConfig,
  },
  categories: {
    layout: {
      title: "Layout",
      components: ["Grid"],
    },
    entities: {
      title: "Entities",
      components: [
        "Light",
        "Clock",
        "BinarySensor",
        "EntitiesCard",
        "GraphCard",
        "Thermostat",
        "Weather",
        "Alarm",
      ],
    },
  },
};
