"use client";
import { Card, cn } from "@heroui/react";
import { sections } from "./sections";
import Icon from "@mdi/react";

export interface DocsSidebarProps {
  index: number;
  setIndex: (index: number) => void;
}

export const DocsSidebar = ({ index, setIndex }: DocsSidebarProps) => {
  return (
    <aside className="space-y-3">
      <Card className="p-3 sticky top-24 h-full md:min-h-screen">
        <nav className="flex flex-col gap-1">
          {sections.map((s, i) => (
            <button
              key={s.slug}
              onClick={() => setIndex(i)}
              className={cn(
                "flex items-center gap-2 rounded px-2 py-2 text-sm text-left transition-colors hover:cursor-pointer",
                {
                  "bg-primary/10 text-theme-text": i === index,
                  "hover:bg-theme-surface text-theme-text-secondary":
                    i !== index,
                }
              )}
            >
              {s.icon && (
                <Icon path={s.icon} className="w-4 h-4 text-primary" />
              )}
              <span>{s.title}</span>
            </button>
          ))}
        </nav>
      </Card>
    </aside>
  );
};
