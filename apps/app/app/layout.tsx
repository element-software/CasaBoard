import { AnalyticsWrapper } from "@repo/ui/components/Shared/util/AnalyticsWrapper";
import { UnderDevelopmentBanner } from "@repo/ui/components/Shared/util/UnderDevelopmentBanner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { cn } from "@heroui/react";
import { getCurrentAuthUser } from "@repo/lib";
import { User } from "@supabase/supabase-js";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CasaBoard — Dashboard",
  description: "CasaBoard Dashboard",
  icons: {
    icon: "/icon.svg",
  },
  manifest: "./manifest.webmanifest",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  let user: User | undefined = undefined;

  try {
    user = await getCurrentAuthUser();
  } catch (error) {
    console.error(error);
  }

  return (
    <html lang="en" className="light">
      <Script async src="https://js.stripe.com/v3/pricing-table.js"></Script>
      <body className={cn("bg-white",inter.className)}>
        <UnderDevelopmentBanner />
        {children}
        <AnalyticsWrapper gaId="G-P2JEHMNT4C" user={user} />
      </body>
    </html>
  );
}
