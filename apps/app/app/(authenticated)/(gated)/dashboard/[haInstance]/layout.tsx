import { HassConnectWrapper } from "@repo/ui/components/Shared/util/HassConnectWrapper";
import { HAInstanceActions } from "@repo/lib";
import { notFound } from "next/navigation";

// Force dynamic rendering for this layout since it uses cookies
export const dynamic = "force-dynamic";

interface HAInstanceLayoutProps {
  children: React.ReactNode;
  params: {
    haInstance: string;
  };
}

export default async function HAInstanceLayout({
  children,
  params: { haInstance },
}: HAInstanceLayoutProps) {
  try {
    // Fetch the HA instance data from the server
    const instance = await HAInstanceActions.getHAInstance(haInstance);
    
    if (!instance) {
      notFound();
    }

    return (
      <HassConnectWrapper haInstance={instance}>
        {children}
      </HassConnectWrapper>
    );
  } catch (error) {
    console.error("Failed to load HA instance:", error);
    notFound();
  }
}
