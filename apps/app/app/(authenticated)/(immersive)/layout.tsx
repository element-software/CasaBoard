import { ConfigurationProvider } from "@repo/ui/components/Shared/util/ConfigurationProvider";
import {
  ConfigService,
  getCurrentAuthUser,
} from "@repo/lib";
import { Footer } from "@repo/ui/components/Shared/Footer/index";
import { redirect } from "next/navigation";
import { UnderDevelopmentBanner } from "@repo/ui/components/Shared/util/UnderDevelopmentBanner";
import PlanEmulationWidget from "@repo/ui/components/Shared/util/PlanEmulationWidget";
import { EMULATION_EMAIL, EMULATION_COOKIE } from "@repo/lib/utils/planEmulation";
import { cookies } from "next/headers";
import { setPlanEmulation } from "../actions/planEmulation";

// Force dynamic rendering for this layout since it uses cookies
export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch configuration server-side
  const initialConfig = await ConfigService.getServerConfig();

  // Ensure user is authenticated first
  const authedUser = await getCurrentAuthUser();
  if (!authedUser) {
    redirect("/auth/login?redirectTo=/");
  }

  const isDevUser = authedUser.email === EMULATION_EMAIL;
  let currentTier = "off";
  if (isDevUser) {
    const cookieStore = await cookies();
    currentTier = cookieStore.get(EMULATION_COOKIE)?.value ?? "off";
  }

  return (
    <ConfigurationProvider initialConfig={initialConfig}>
      <UnderDevelopmentBanner />
      <div className="min-h-screen">
        <main className="flex-1 h-full">{children}</main>
        <Footer />
      </div>
      {isDevUser && (
        <PlanEmulationWidget currentTier={currentTier} onSetTier={setPlanEmulation} />
      )}
    </ConfigurationProvider>
  );
}
