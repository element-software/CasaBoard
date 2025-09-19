"use client";
import { PuckRenderer } from "@repo/ui/components/PuckRenderer";
import { UserSettings } from "@repo/types/userSettings";
import { Page } from "@repo/types/page";

interface ClientPageWrapperProps {
  pageName: string;
  pageData?: Page;
  preferredHASettings?: Partial<UserSettings> | null;
}

export const ClientPageWrapper = ({
  pageName,
  pageData,
  preferredHASettings,
}: ClientPageWrapperProps) => {
  return (
    <main className="flex flex-col min-h-screen">
      <PuckRenderer pageId={pageName} pageData={pageData}/>
    </main>
  );
};
