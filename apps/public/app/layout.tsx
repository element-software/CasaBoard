import { AnalyticsWrapper } from "@repo/ui/components/AnalyticsWrapper";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@repo/ui/components/ThemeSwitch/ThemeProvider";
import { Header } from "@repo/ui/components/Header/Header";

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
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-theme-background">
            <Header public={true} />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
        <AnalyticsWrapper gaId="G-4N9M4MTHP1" />
      </body>
    </html>
  );
}
