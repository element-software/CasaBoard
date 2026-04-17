import { ConfigurationProvider } from "@repo/ui/components/Shared/util/ConfigurationProvider";
import {
  ConfigService,
  getCurrentAuthUser,
} from "@repo/lib";
import { Footer } from "@repo/ui/components/Shared/Footer/index";
import { redirect } from "next/navigation";

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

  return (
    <ConfigurationProvider initialConfig={initialConfig}>
      <div className="min-h-screen">
        <main className="flex-1 h-full">{children}</main>
        <Footer />
      </div>
    </ConfigurationProvider>
  );
}
