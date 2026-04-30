import { StorageModeProvider } from "@repo/ui/components/Shared/util/StorageModeProvider";
import PlanEmulationWidget from "@repo/ui/components/Shared/util/PlanEmulationWidget";
import { getCurrentAuthUser } from "@repo/lib";
import { EMULATION_EMAIL, EMULATION_COOKIE } from "@repo/lib/utils/planEmulation";
import { cookies } from "next/headers";
import { setPlanEmulation } from "./actions/planEmulation";

// Force dynamic rendering for this layout since it uses cookies
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentAuthUser().catch(() => null);
  const isDevUser = user?.email === EMULATION_EMAIL;

  let currentTier = "off";
  if (isDevUser) {
    const cookieStore = await cookies();
    currentTier = cookieStore.get(EMULATION_COOKIE)?.value ?? "off";
  }

  return (
    <StorageModeProvider>
      {children}
      {isDevUser && (
        <PlanEmulationWidget
          currentTier={currentTier}
          onSetTier={setPlanEmulation}
        />
      )}
    </StorageModeProvider>
  );
}
