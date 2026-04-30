import { StorageModeProvider } from "@repo/ui/components/Shared/util/StorageModeProvider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StorageModeProvider>
      {children}
    </StorageModeProvider>
  );
}
