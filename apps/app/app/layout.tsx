import { AnalyticsWrapper } from "@repo/ui/components/AnalyticsWrapper";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CasaBoard — Dashboard",
  description: "CasaBoard Dashboard",
  icons: {
    icon: "/app/icon.svg",
  },
  manifest: "/app/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <AnalyticsWrapper gaId="G-P2JEHMNT4C" />
      </body>
    </html>
  );
}
