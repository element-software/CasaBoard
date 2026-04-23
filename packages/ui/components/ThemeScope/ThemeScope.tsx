"use client";

import type { CSSProperties, ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";

export type ThemeScopeProps = {
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
};

/**
 * Applies resolved CSS custom properties to a subtree (dashboard / preview).
 * Custom properties are mirrored with `setProperty` so hyphenated `--theme-*`
 * vars reliably update (the `style` prop alone can miss updates in some cases).
 */
export function ThemeScope({ style, className, children }: ThemeScopeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const applied: string[] = [];
    if (style) {
      for (const [k, v] of Object.entries(style)) {
        if (typeof v === "string" && k.startsWith("--")) {
          el.style.setProperty(k, v);
          applied.push(k);
        }
      }
    }

    return () => {
      for (const k of applied) {
        el.style.removeProperty(k);
      }
    };
  }, [style]);

  return (
    <div ref={ref} data-casaboard-theme className={className} style={style}>
      {children}
    </div>
  );
}
