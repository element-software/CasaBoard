import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={cn("bg-white",inter.className)}>
        {children}
      </body>
    </html>
  );
}
