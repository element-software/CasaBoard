import { Header } from "@repo/ui/components/Header/Header";
import { Footer } from "@repo/ui/components/Footer";
import { getCurrentAuthUser } from "@repo/lib";
import { redirect } from "next/navigation";

// Force dynamic rendering for this layout since it uses cookies
export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentAuthUser();
  console.log("AuthenticatedLayout:: user", user);
  if (!user) {
    redirect("/auth/login");
  }
  return (
    <div className="min-h-screen bg-theme-background">
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
