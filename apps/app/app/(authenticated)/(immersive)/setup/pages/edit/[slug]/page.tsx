import PageEditorClient from "@repo/ui/components/puck/PageEditorClient";

// Force dynamic rendering since pages are stored client-side
export const dynamicParams = true;
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PageEdit({ params }: PageProps) {
  const { slug } = await params;
  return <PageEditorClient initialSlug={slug} />;
}
