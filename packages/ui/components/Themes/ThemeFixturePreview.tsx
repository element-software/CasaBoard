"use client";

import { themeTokenLabel } from "@repo/types/theme";

export function ThemeFixturePreview() {
  return (
    <div className="rounded-xl border border-theme-border bg-theme-surface p-4 space-y-3">
      <p className="text-sm font-medium text-theme-text">Preview</p>
      <div
        className="rounded-lg border border-dashed border-theme-border px-3 py-2 text-xs text-theme-text-secondary bg-theme-page-background"
        title="Full-page canvas behind the dashboard (main Puck area)"
      >
        {themeTokenLabel("page-background")}
      </div>
      <div
        className="rounded-lg border border-dashed border-theme-border px-3 py-2 text-xs text-theme-text bg-theme-background"
        title="Sidebars, mobile header, drawer panels, and similar chrome (not the main canvas)"
      >
        {themeTokenLabel("background")}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg p-3 bg-theme-entity-on text-theme-text-on-primary">
          On / active
        </div>
        <div className="rounded-lg p-3 bg-theme-entity-off text-theme-text">
          Off / inactive
        </div>
        <div className="rounded-lg p-3 bg-theme-alarm-armed text-theme-text-on-primary">
          Alarm armed
        </div>
        <div className="rounded-lg p-3 bg-theme-alarm-disarmed text-theme-text">
          Alarm disarmed
        </div>
        <div className="rounded-lg p-3 bg-theme-interactive-hover text-theme-text col-span-2">
          Hover surface
        </div>
        <div className="rounded-lg p-3 border border-theme-border bg-theme-card text-theme-text-secondary col-span-2">
          Card
        </div>
      </div>
    </div>
  );
}
