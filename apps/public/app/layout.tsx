
import { Header } from "@repo/ui/components/Header/Header";
import { ThemeProvider } from "@repo/ui/components/ThemeSwitch/ThemeProvider";
import { Inter } from "next/font/google";
import "@repo/tailwind-config";

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
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ThemeProvider>
    </body>
    </html>
  );
}
