"use client";
import React from "react";
import { GridConfig } from "../config/dashboard.types";
import { ComponentRenderer } from "./ComponentRenderer";
import classNames from "classnames";

interface DashboardGridProps {
  config: GridConfig;
  className?: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ config, className }) => {
  return (
    <div
      className={classNames(
        "grid w-full grid-cols-1 grid-flow-row",
        {
          "sm:grid-cols-2": config.columns === 2,
          "sm:grid-cols-2 md:grid-cols-3": config.columns === 3,
          "sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4": config.columns === 4,
          "gap-2": config.gap === 2,
          "gap-3 sm:gap-4": config.gap === 4,
          "gap-4 sm:gap-6": config.gap === 6,
          "gap-4 sm:gap-6 lg:gap-8": config.gap === 8,
          "gap-4 sm:gap-6 lg:gap-10": config.gap === 10,
        },
        className
      )}
    >
      {config.components.map((componentConfig, index) => (
        <ComponentRenderer key={index} config={componentConfig} />
      ))}
    </div>
  );
};
