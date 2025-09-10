import { PagesList } from '@repo/ui/components/Setup/PagesList';
import { PageActions } from '@repo/lib';
import Link from 'next/link';

// Enable dynamic params for unknown routes
export const dynamicParams = true;
// Force dynamic rendering since pages are stored in Supabase
export const dynamic = 'force-dynamic';

export default async function PagesListPage() {
  let pages = [];
  let error = null;

  try {
    pages = await PageActions.getAllPages();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load pages';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pages List */}
        <PagesList initialPages={pages} initialError={error} />

        {/* Back to Setup */}
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