import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import "./globals.css";
export const metadata = {
  title: "CasaBoard — Smart Home Dashboard",
  description: "Cloud-hosted, customizable dashboard for Home Assistant",
  metadataBase: new URL("https://casaboard.dev"),
  icons: {
    icon: "/app/icon.svg",
  },
  manifest: "/app/manifest.webmanifest",
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
    <html lang="en">
      <Analytics />
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-4N9M4MTHP1" />
    </html>
  );
}
