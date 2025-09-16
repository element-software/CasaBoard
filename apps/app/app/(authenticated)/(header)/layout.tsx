import { Header } from "@repo/ui/components/Header/Header";
import { Footer } from "@repo/ui/components/Footer";

// Force dynamic rendering for this layout since it uses cookies
export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-theme-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
