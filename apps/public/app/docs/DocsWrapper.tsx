"use client";

import { Button } from "@heroui/react";
import { sections } from "./sections";
import { DocsSidebar } from "./sidebar";
import { useState } from "react";

export const DocsWrapper = () => {
  const [index, setIndex] = useState(0);

  const current = sections[index];
  const prev = index > 0 ? () => setIndex(index - 1) : undefined;
  const next =
    index < sections.length - 1 ? () => setIndex(index + 1) : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0 py-10 grid gap-8 md:grid-cols-[280px_1fr] pt-48">
      <DocsSidebar index={index} setIndex={setIndex} />
      <section>
        <div className="flex items-center justify-between mb-6">
          <Button variant="bordered" onPress={prev} isDisabled={!prev}>
            Previous
          </Button>
          <div className="flex items-center justify-between">{index + 1} of {sections.length}</div>
          <Button color="primary" onPress={next} isDisabled={!next}>
            Next
          </Button>
        </div>
          <current.Content />
      </section>
    </div>
  );
};
