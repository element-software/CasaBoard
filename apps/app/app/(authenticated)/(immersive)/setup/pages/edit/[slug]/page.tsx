import { PageActions, SidebarActions } from "@repo/lib";
import PageEditorClient from "@repo/ui/components/puck/PageEditorClient";
import { notFound } from "next/navigation";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PageEdit({ params }: PageProps) {
  const { slug } = await params;

  const page = await PageActions.getPage(slug);
  if (!page) {
    notFound();
  }

  const sidebars = await SidebarActions.getAllSidebars();

  return (
    <PageEditorClient
      initialData={page.puck_data}
      pageId={page.id}
      initialPublished={page.published}
      sidebars={sidebars}
      initialSlug={page.slug}
      initialThemeId={page.theme_id ?? null}
      initialThemeOverrides={page.theme_overrides ?? null}
    />
  );
}
