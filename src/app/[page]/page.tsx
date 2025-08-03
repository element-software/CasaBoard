import { dashboardConfig } from "@/config/dashboard.config";
import { notFound } from "next/navigation";
import { ClientPageWrapper } from "./ClientPageWrapper";

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
  
  // Check if the page exists in static configuration
  if (!dashboardConfig.pages || !dashboardConfig.pages[pageName]) {
    // Trigger the not-found page
    notFound();
  }

  const pageConfig = dashboardConfig.pages[pageName];

  return (
    <ClientPageWrapper 
      pageName={pageName}
      fallbackConfig={pageConfig}
    />
  );
}
