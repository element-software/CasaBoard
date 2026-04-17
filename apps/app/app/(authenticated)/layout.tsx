import { StorageModeProvider } from "@repo/ui/components/Shared/util/StorageModeProvider";

// Force dynamic rendering for this layout since it uses cookies
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StorageModeProvider>{children}</StorageModeProvider>;
}
