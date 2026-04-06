import SidebarEditorClient from "@repo/ui/components/puck/SidebarEditorClient";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

interface SidebarEditPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SidebarEditPage({
  params,
}: SidebarEditPageProps) {
  const { slug } = await params;
  return <SidebarEditorClient initialSlug={slug} />;
}
