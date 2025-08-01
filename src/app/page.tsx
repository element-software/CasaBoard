"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { dashboardConfig } from "@/config/dashboard.config";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first available page
    const availablePages = Object.keys(dashboardConfig.pages || {});
    if (availablePages.length > 0) {
      router.replace(`/${availablePages[0]}`);
    } else {
      // If no pages configured, redirect to config
      router.replace("/config");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-theme-background">
      <div className="text-theme-text text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary mx-auto mb-4"></div>
        <p className="text-theme-text-secondary">Loading dashboard...</p>
      </div>
    </main>
  );
}
