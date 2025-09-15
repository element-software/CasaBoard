import PageEditorClient from "@repo/ui/components/puck/PageEditorClient";

// Enable dynamic params for unknown routes
export const dynamicParams = true;
// Force dynamic rendering since pages are stored in Supabase
export const dynamic = 'force-dynamic';

export default async function PageCreate() {
  return <PageEditorClient />;
}
