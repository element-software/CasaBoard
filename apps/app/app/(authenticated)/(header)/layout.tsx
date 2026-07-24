import { ConfigurationProvider } from "@repo/ui/components/Shared/util/ConfigurationProvider";
import { ConfigService } from "@repo/lib";
import { SetupLayout } from "@repo/ui/components/Setup/SetupLayout";
import { UnderDevelopmentBanner } from "@repo/ui/components/Shared/util/UnderDevelopmentBanner";

// Force dynamic rendering — reads live server config on every request
export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialConfig = await ConfigService.getServerConfig();

  return (
    <ConfigurationProvider initialConfig={initialConfig}>
      <UnderDevelopmentBanner />
      <SetupLayout>{children}</SetupLayout>
    </ConfigurationProvider>
  );
}
