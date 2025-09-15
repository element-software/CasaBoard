"use client";
import { PagesManagement } from "@repo/ui/components/Setup/PagesManagement";
import { Page } from "@repo/types/page";
import { HAInstanceManager } from "@repo/ui/components/Setup/HAInstanceManager";
import { Entitlements } from "@repo/types/subscription";

export interface SetupProps {
  pages: Page[];
  error?: string;
  entitlements: Entitlements;
}

export const Setup = ({ pages, error, entitlements }: SetupProps) => {
  return (
    <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
      <PagesManagement initialPages={pages} initialError={error} />
      <HAInstanceManager entitlements={entitlements} compact />
    </div>
  );
};
