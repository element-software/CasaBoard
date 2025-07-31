import { DashboardGrid } from "@/components/DashboardGrid";
import { dashboardConfig } from "@/config/dashboard.config";
import { notFound } from "next/navigation";

// This function is required for static export
export async function generateStaticParams() {
  try {
    return Object.keys(dashboardConfig.pages).map((page) => ({
      page: page,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Enable dynamic params for unknown routes
export const dynamicParams = true;

interface PageProps {
  params: {
    page: string;
  };
}

export default function ConfigurablePage({ params }: PageProps) {
  const pageName = params.page;
  
  // Check if the page exists in configuration
  if (!dashboardConfig.pages || !dashboardConfig.pages[pageName]) {
    // Trigger the not-found page
    notFound();
  }

  const pageConfig = dashboardConfig.pages[pageName];

  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {pageConfig.title?.showTitle && (
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 lg:mb-6 text-center lg:text-left">
            {pageConfig.title.value}
          </h1>
        )}
        <div className="flex justify-center lg:justify-start">
          <DashboardGrid config={pageConfig.layout} className="max-w-7xl w-full" />
        </div>
      </div>
    </main>
  );
}
