import { ConfigurationProvider } from "@repo/ui/components/Shared/util/ConfigurationProvider";
import { ConfigService, HAConnectionActions } from "@repo/lib";
import { SetupLayout } from "@repo/ui/components/Setup/SetupLayout";
import { UnderDevelopmentBanner } from "@repo/ui/components/Shared/util/UnderDevelopmentBanner";
import { redirect } from "next/navigation";

// Force dynamic rendering — reads live server config on every request
export const dynamic = "force-dynamic";

export default async function HeaderShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialConfig, valid] = await Promise.all([
    ConfigService.getServerConfig(),
    HAConnectionActions.hasValidHAConnection(),
  ]);

  if (!valid) {
    redirect("/onboarding");
  }

  return (
    <ConfigurationProvider initialConfig={initialConfig}>
      <UnderDevelopmentBanner />
      <SetupLayout>{children}</SetupLayout>
    </ConfigurationProvider>
  );
}
