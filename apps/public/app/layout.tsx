import { AnalyticsWrapper } from "@repo/ui/components/Shared/util/AnalyticsWrapper";
import { Footer } from "@repo/ui/components/Shared/Footer/index";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@repo/ui/components/Header/Header";
import { Providers } from "./providers";
import { cn } from "@heroui/react";

export const metadata = {
  title: "CasaBoard — Smart Home Dashboard",
  description: "Cloud-hosted, customizable dashboard for Home Assistant",
  metadataBase: new URL("https://casaboard.dev"),
  icons: {
    icon: "/icon.svg",
  },
  manifest: "./manifest.webmanifest",
  openGraph: {
    title: "CasaBoard — Smart Home Dashboard",
    description: "Cloud-hosted, customizable dashboard for Home Assistant",
    url: "https://casaboard.dev",
    siteName: "CasaBoard",
    images: [],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CasaBoard — Smart Home Dashboard",
    description: "Cloud-hosted, customizable dashboard for Home Assistant",
  },
};

const inter = Inter({ subsets: ["latin"] });

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "bg-gradient-to-b from-primary/10 via-transparent to-transparent",
          inter.className
        )}
      >
        <AnalyticsWrapper gaId="G-4N9M4MTHP1" />
        <Providers>
          <Header public={true} />
          <main className="min-h-screen flex-1 -mt-32">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
