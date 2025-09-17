import { Header } from "@repo/ui/components/Header/Header";
import { Footer } from "@repo/ui/components/Footer";
import { getCurrentAuthUser } from "@repo/lib";

// Force dynamic rendering for this layout since it uses cookies
export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentAuthUser();
  return (
    <div className="min-h-screen bg-theme-background">
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
