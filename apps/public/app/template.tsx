"use client";
import { Header } from "@repo/ui/components/Header/Header";
import { ThemeProvider } from "@repo/ui/components/ThemeSwitch/ThemeProvider";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme-background">
        <Header public={true} />
        <main className="flex-1">{children}</main>
      </div>
    </ThemeProvider>
  );
}
