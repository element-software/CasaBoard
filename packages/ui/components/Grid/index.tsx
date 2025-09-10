"use client";

import { cn } from "@heroui/react";
import { JSX } from "react";

type SlotRenderer = (props?: any) => JSX.Element;

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";

export type GridProps = {
  columns_sm?: number;
  columns_md?: number;
  columns_lg?: number;
  columns_xl?: number;
  gap?: string; // e.g. gap-4
  alignX?: "start" | "center" | "end" | "between" | "around" | "evenly";
  alignY?: "start" | "center" | "end" | "stretch" | "baseline";
  className?: string;

  // Slot renderers
  col1?: SlotRenderer;
  col2?: SlotRenderer;
  col3?: SlotRenderer;
  col4?: SlotRenderer;
  col5?: SlotRenderer;
  col6?: SlotRenderer;

  // Widths per breakpoint (1..12). If not set, defaults to equal split from columns
  col1_base?: number; col1_sm?: number; col1_md?: number; col1_lg?: number; col1_xl?: number;
  col2_base?: number; col2_sm?: number; col2_md?: number; col2_lg?: number; col2_xl?: number;
  col3_base?: number; col3_sm?: number; col3_md?: number; col3_lg?: number; col3_xl?: number;
  col4_base?: number; col4_sm?: number; col4_md?: number; col4_lg?: number; col4_xl?: number;
  col5_base?: number; col5_sm?: number; col5_md?: number; col5_lg?: number; col5_xl?: number;
  col6_base?: number; col6_sm?: number; col6_md?: number; col6_lg?: number; col6_xl?: number;
};

const justifyClassMap: Record<NonNullable<GridProps["alignX"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const itemsClassMap: Record<NonNullable<GridProps["alignY"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

function spanClass(span?: number, bp?: Breakpoint) {
  if (!span) return undefined;
  const cls = `col-span-${span}`;
  if (bp && bp !== "base") return `${bp}:${cls}`;
  return cls;
}

function getDefaultSpan(colIndex: number, columns: number) {
  const base = Math.floor(12 / Math.max(columns, 1));
  // Put any remainder onto the last column
  if (colIndex === columns && 12 % columns !== 0) {
    return 12 - base * (columns - 1);
  }
  return base;
}

export const GridRender = (props: GridProps) => {
  const {
    columns_sm = 2,
    columns_md = 3,
    columns_lg = 4,
    columns_xl = 5,
    gap = "gap-4",
    alignX = "start",
    alignY = "stretch",
    className,
    ...rest
  } = props as any;

  const containerClass = cn(
    "grid w-full",
    {
      // Mobile (base) - 1 column by default for better mobile experience
      "grid-cols-1": columns_sm === 1,
      "grid-cols-2": columns_sm === 2,
      "grid-cols-3": columns_sm === 3,
      "grid-cols-4": columns_sm === 4,
      "grid-cols-5": columns_sm === 5,
      "grid-cols-6": columns_sm === 6,
      // Small screens (sm) - same as mobile for now
      "sm:grid-cols-1": columns_sm === 1,
      "sm:grid-cols-2": columns_sm === 2,
      "sm:grid-cols-3": columns_sm === 3,
      "sm:grid-cols-4": columns_sm === 4,
      "sm:grid-cols-5": columns_sm === 5,
      "sm:grid-cols-6": columns_sm === 6,
      // Medium screens (md) - tablet
      "md:grid-cols-1": columns_md === 1,
      "md:grid-cols-2": columns_md === 2,
      "md:grid-cols-3": columns_md === 3,
      "md:grid-cols-4": columns_md === 4,
      "md:grid-cols-5": columns_md === 5,
      "md:grid-cols-6": columns_md === 6,
      // Large screens (lg) - desktop
      "lg:grid-cols-1": columns_lg === 1,
      "lg:grid-cols-2": columns_lg === 2,
      "lg:grid-cols-3": columns_lg === 3,
      "lg:grid-cols-4": columns_lg === 4,
      "lg:grid-cols-5": columns_lg === 5,
      "lg:grid-cols-6": columns_lg === 6,
      // Extra large screens (xl) - large desktop
      "xl:grid-cols-1": columns_xl === 1,
      "xl:grid-cols-2": columns_xl === 2,
      "xl:grid-cols-3": columns_xl === 3,
      "xl:grid-cols-4": columns_xl === 4,
      "xl:grid-cols-5": columns_xl === 5,
      "xl:grid-cols-6": columns_xl === 6,
    },
    gap,
    justifyClassMap[alignX as NonNullable<GridProps["alignX"]>],
    itemsClassMap[alignY as NonNullable<GridProps["alignY"]>],
    className
  );

  const slots: (keyof GridProps)[] = ["col1", "col2", "col3", "col4", "col5", "col6"];

  const bpKeys: Breakpoint[] = ["base", "sm", "md", "lg", "xl"];

  const getColumnsFor = (bp: Breakpoint) => {
    if (bp === "base" || bp === "sm") return columns_sm;
    if (bp === "md") return (typeof columns_md === "number" ? columns_md : columns_sm) as number;
    if (bp === "lg") return (typeof columns_lg === "number" ? columns_lg : (typeof columns_md === "number" ? columns_md : columns_sm)) as number;
    if (bp === "xl") return (typeof columns_xl === "number" ? columns_xl : (typeof columns_lg === "number" ? columns_lg : (typeof columns_md === "number" ? columns_md : columns_sm))) as number;
    return columns_sm as number;
  };

  const visibilityClasses = (index: number) => {
    const baseCols = getColumnsFor("base");
    const smCols = getColumnsFor("sm");
    const mdCols = getColumnsFor("md");
    const lgCols = getColumnsFor("lg");
    const xlCols = getColumnsFor("xl");

    return cn(
      index <= baseCols ? "block" : "hidden",
      index <= smCols ? "sm:block" : "sm:hidden",
      index <= mdCols ? "md:block" : "md:hidden",
      index <= lgCols ? "lg:block" : "lg:hidden",
      index <= xlCols ? "xl:block" : "xl:hidden"
    );
  };

  const renderColumn = (index: number) => {
    const slotKey = slots[index - 1];
    const Slot = (rest as any)[slotKey] as SlotRenderer | undefined;
    if (!Slot) return null;

    const fallback = getDefaultSpan(index, getColumnsFor("base"));
    const spanBase = (rest as any)[`col${index}_base`] || fallback;
    const spanSm = (rest as any)[`col${index}_sm`] || getDefaultSpan(index, getColumnsFor("sm"));
    const spanMd = (rest as any)[`col${index}_md`] || getDefaultSpan(index, getColumnsFor("md"));
    const spanLg = (rest as any)[`col${index}_lg`] || getDefaultSpan(index, getColumnsFor("lg"));
    const spanXl = (rest as any)[`col${index}_xl`] || getDefaultSpan(index, getColumnsFor("xl"));

    const colClass = cn(
      "flex flex-col w-full",
      spanClass(spanBase, "base"),
      spanClass(spanSm, "sm"),
      spanClass(spanMd, "md"),
      spanClass(spanLg, "lg"),
      spanClass(spanXl, "xl"),
      //visibilityClasses(index)
    );

    return (
      <div className={colClass}>
        <Slot />
      </div>
    );
  };

  const maxCols = Math.min(
    Math.max(columns_sm || 1, columns_md || 1, columns_lg || 1, columns_xl || 1),
    6
  );

  return (
    <div className={containerClass}>
      {Array.from({ length: maxCols }).map((_, i) => (
        <div key={i}>{renderColumn(i + 1)}</div>
      ))}
    </div>
  );
};


