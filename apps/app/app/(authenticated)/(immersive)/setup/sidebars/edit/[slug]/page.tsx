import { SidebarActions, SupabaseServer } from "@repo/lib";
import PuckEditorClient from "@repo/ui/components/puck/PuckEditorClient";
import { notFound } from "next/navigation";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

interface SidebarEditPageProps {
  params: {
    slug: string;
  };
}

export default async function SidebarEditPage({ params }: SidebarEditPageProps) {
  const { slug } = await params;
  const supabase = await SupabaseServer.createClient();

  try {
    const sidebar = await SidebarActions.getSidebar(slug);
    
    if (!sidebar) {
      notFound();
    }

    return (
      <PuckEditorClient
        type="sidebar"
        initialData={sidebar.puck_data}
        itemId={sidebar.id}
        userId={sidebar.user_id}
        initialPublished={true} // Sidebars are always "published"
        initialSlug={sidebar.slug}
      />
    );
  } catch (error) {
    console.error("Error fetching sidebar:", error);
    notFound();
  }
}
