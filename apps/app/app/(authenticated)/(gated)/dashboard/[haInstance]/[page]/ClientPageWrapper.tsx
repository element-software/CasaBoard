"use client";
import { PuckRenderer } from "@repo/ui/components/puck/PuckRenderer";
import { Page } from "@repo/types/page";

interface ClientPageWrapperProps {
  pageName: string;
  pageData?: Page;
}

export const ClientPageWrapper = ({
  pageName,
  pageData,
}: ClientPageWrapperProps) => {
  return (
    <main className="flex flex-col min-h-screen">
      <PuckRenderer pageId={pageName} pageData={pageData}/>
    </main>
  );
};
