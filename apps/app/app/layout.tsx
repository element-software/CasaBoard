import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@repo/tailwind-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CasaBoard - Smart Home Dashboard",
  description:
    "A modern smart home dashboard built with Next.js and Home Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
