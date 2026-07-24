import { ConfigurationProvider } from "@repo/ui/components/Shared/util/ConfigurationProvider";
import { DashboardChromeProvider } from "@repo/ui/components/Shared/util/DashboardChrome";
import { ConfigService } from "@repo/lib";

// Force dynamic rendering for this layout since it uses cookies
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialConfig = await ConfigService.getServerConfig();

  return (
    <ConfigurationProvider initialConfig={initialConfig}>
      <DashboardChromeProvider>{children}</DashboardChromeProvider>
    </ConfigurationProvider>
  );
}
