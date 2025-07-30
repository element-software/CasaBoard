import { DashboardGrid } from "@/components/DashboardGrid";
import { dashboardConfig } from "@/config/dashboard.config";

// This function is required for static export
export async function generateStaticParams() {
  return Object.keys(dashboardConfig.pages).map((page) => ({
    page: page,
  }));
}

interface PageProps {
  params: {
    page: string;
  };
}

export default function ConfigurablePage({ params }: PageProps) {
  const pageName = params.page;
  const pageConfig = dashboardConfig.pages[pageName];

  if (!pageConfig) {
    return (
      <main className="flex h-screen flex-col items-center justify-center p-8">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p>Configuration for page &ldquo;{pageName}&rdquo; not found.</p>
          <p className="mt-4 text-gray-400">
            Available pages: {Object.keys(dashboardConfig.pages).join(", ")}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col items-center p-8">
      {pageConfig.title.showTitle && (
        <h1 className="text-2xl font-bold text-white mb-4">
          {pageConfig.title.value}
        </h1>
      )}
      <DashboardGrid config={pageConfig.layout} />
    </main>
  );
}
