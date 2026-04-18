"use client";
import { cn } from "@heroui/react";
import { sections } from "./sections";
import Icon from "@mdi/react";

export interface DocsSidebarProps {
  index: number;
  setIndex: (index: number) => void;
}

export const DocsSidebar = ({ index, setIndex }: DocsSidebarProps) => {
  return (
    <aside className="space-y-3">
      <div className="sticky top-24 bg-white border border-slate-100 rounded-xl shadow-sm p-3">
        <nav className="flex flex-col gap-0.5">
          {sections.map((s, i) => (
            <button
              key={s.slug}
              onClick={() => setIndex(i)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-left transition-colors",
                i === index
                  ? "bg-violet-50 text-violet-700 font-medium"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              {s.icon && (
                <Icon
                  path={s.icon}
                  className={cn(
                    "w-4 h-4 flex-shrink-0",
                    i === index ? "text-violet-500" : "text-slate-400"
                  )}
                />
              )}
              <span>{s.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
