import { getTheme } from "@repo/lib/actions/themeActions";
import { ThemeEditorForm } from "@repo/ui/components/Themes/ThemeEditorForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ThemeEditPage({ params }: Props) {
  const { id } = await params;
  try {
    const theme = await getTheme(id);
    return <ThemeEditorForm theme={theme} />;
  } catch {
    notFound();
  }
}
