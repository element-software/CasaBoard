import { AnalyticsWrapper } from "@repo/ui/components/AnalyticsWrapper";
import { Footer } from "@repo/ui/components/Footer";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "CasaBoard — Smart Home Dashboard",
  description: "Cloud-hosted, customizable dashboard for Home Assistant",
  metadataBase: new URL("https://casaboard.dev"),
  icons: {
    icon: "./icon.svg",
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

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <AnalyticsWrapper gaId="G-4N9M4MTHP1" />
        <Footer />
      </body>
    </html>
  );
}
