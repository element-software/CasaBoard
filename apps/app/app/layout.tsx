import { AnalyticsWrapper } from "@repo/ui/components/Shared/util/AnalyticsWrapper";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { cn } from "@heroui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CasaBoard — Dashboard",
  description: "CasaBoard Dashboard",
  icons: {
    icon: "/icon.svg",
  },
  manifest: "./manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <Script async src="https://js.stripe.com/v3/pricing-table.js"></Script>
      <body className={cn("bg-neutral-900",inter.className)}>
        {children}
        <AnalyticsWrapper gaId="G-P2JEHMNT4C" />
      </body>
    </html>
  );
}
