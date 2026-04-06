import Link from "next/link";
import { PagesManagement } from "@repo/ui/components/Pages/PagesManagement";

// Force dynamic rendering for this page since it uses cookies
export const dynamic = "force-dynamic";

export default async function PagesListPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PagesManagement showAllPages />

      <div className="mt-8 pt-6 border-t border-theme-border">
        <Link
          href="/setup"
          className="inline-flex items-center text-theme-text-secondary hover:text-theme-text transition-colors"
        >
          ← Back to Setup Dashboard
        </Link>
      </div>
    </div>
  );
}
