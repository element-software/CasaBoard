"use client"
import { HeroUIProvider } from "@heroui/react";
import { Header } from "@repo/ui/components/Header/Header";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeroUIProvider>
      <div className="min-h-screen bg-theme-background">
        <Header public={true} />
        <main className="flex-1">{children}</main>
      </div>
    </HeroUIProvider>
  );
}
