import { AnalyticsWrapper } from "@repo/ui/components/Shared/util/AnalyticsWrapper";
import { Footer } from "@repo/ui/components/Shared/Footer/index";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@repo/ui/components/Header/Header";
import { Providers } from "./providers";
import { cn } from "@heroui/react";

export const metadata = {
  title: "CasaBoard — Smart Home Dashboard",
  description:
    "Privacy-first Home Assistant dashboards. Credentials stay local by default; optional cloud sync on paid plans.",
  metadataBase: new URL("https://casaboard.dev"),
  icons: {
    icon: "/icon.svg",
  },
  manifest: "./manifest.webmanifest",
  openGraph: {
    title: "CasaBoard — Smart Home Dashboard",
    description:
      "Privacy-first Home Assistant dashboards. Local by default; optional cloud sync for subscribers.",
    url: "https://casaboard.dev",
    siteName: "CasaBoard",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CasaBoard — Smart Home Dashboard",
    description:
      "Privacy-first Home Assistant dashboards. Local credentials by default; optional cloud sync.",
  },
};

const inter = Inter({ subsets: ["latin"] });

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body
        className={cn(
          "bg-white",
          inter.className
        )}
      >
        <AnalyticsWrapper gaId="G-4N9M4MTHP1" />
        <Providers>
          <Header />
          <main className="min-h-screen flex-1 -mt-32">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
