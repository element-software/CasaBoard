import { ConfigurationProvider } from "@repo/ui/components/Shared/util/ConfigurationProvider";
import {
  ConfigService,
  getCurrentAuthUser,
} from "@repo/lib";
import { redirect } from "next/navigation";
import { SetupLayout } from "@repo/ui/components/Setup/SetupLayout";

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
    redirect("/auth/login?redirectTo=/auth/setup");
  }

  return (
    <ConfigurationProvider initialConfig={initialConfig}>
      <SetupLayout user={authedUser}>{children}</SetupLayout>
    </ConfigurationProvider>
  );
}
