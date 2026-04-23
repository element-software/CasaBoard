import { listThemes } from "@repo/lib/actions/themeActions";
import { ThemesList } from "@repo/ui/components/Themes/ThemesList";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ThemesPage() {
  const themes = await listThemes();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-theme-text">Themes</h1>
        <Link
          href="/setup"
          className="text-sm text-theme-text-secondary hover:text-theme-text transition-colors"
        >
          Back to setup
        </Link>
      </div>
      <ThemesList initialThemes={themes} />
    </div>
  );
}
