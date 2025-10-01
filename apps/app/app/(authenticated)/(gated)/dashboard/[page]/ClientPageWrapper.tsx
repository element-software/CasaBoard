"use client";
import { PuckRenderer } from "@repo/ui/components/puck/PuckRenderer";
import { Page } from "@repo/types/page";
import { HassConnectWrapper } from "@repo/ui/components/Shared/util/HassConnectWrapper";

interface ClientPageWrapperProps {
  pageName: string;
  pageData?: Page;
  instanceId?: string;
}

export const ClientPageWrapper = ({
  pageName,
  pageData,
  instanceId,
}: ClientPageWrapperProps) => {
  return (
    <HassConnectWrapper instanceId={instanceId}>
      <main className="flex flex-col min-h-screen">
        <PuckRenderer pageId={pageName} pageData={pageData}/>
      </main>
    </HassConnectWrapper>
  );
};
