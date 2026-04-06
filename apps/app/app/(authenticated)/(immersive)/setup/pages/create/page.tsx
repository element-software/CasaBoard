import PageEditorClient from "@repo/ui/components/puck/PageEditorClient";

// Force dynamic rendering since pages are stored client-side
export const dynamic = 'force-dynamic';

export default async function PageCreate() {
  return <PageEditorClient />;
}
