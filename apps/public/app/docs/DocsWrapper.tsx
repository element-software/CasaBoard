"use client";

import { Button } from "@heroui/react";
import { sections } from "./sections";
import { DocsSidebar } from "./sidebar";
import { useState } from "react";

export const DocsWrapper = () => {
  const [index, setIndex] = useState(0);

  const current = sections[index];
  const prev = index > 0 ? () => setIndex(index - 1) : undefined;
  const next = index < sections.length - 1 ? () => setIndex(index + 1) : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DocsSidebar index={index} setIndex={setIndex} />

        <section>
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="bordered"
              onPress={prev}
              isDisabled={!prev}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Previous
            </Button>
            <span className="text-sm text-slate-400">{index + 1} of {sections.length}</span>
            <Button
              color="primary"
              onPress={next}
              isDisabled={!next}
            >
              Next
            </Button>
          </div>
          <current.Content />
        </section>
      </div>
    </div>
  );
};
