import { ConfigurationProvider } from "@repo/ui/components/Shared/util/ConfigurationProvider";
import { ConfigService } from "@repo/lib";

// Force dynamic rendering for this layout since it uses cookies
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch configuration server-side
  const initialConfig = await ConfigService.getServerConfig();

  return (
      <ConfigurationProvider initialConfig={initialConfig}>
        <div className="min-h-screen">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </ConfigurationProvider>
  );
}
