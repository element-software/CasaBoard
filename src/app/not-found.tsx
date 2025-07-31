import { dashboardConfig } from "@/config/dashboard.config";

export default function NotFound() {
  const availablePages = Object.keys(dashboardConfig.pages || {});

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-neutral-900">
      <div className="text-white text-center max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist in the dashboard configuration.
        </p>
        
        {availablePages.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-400 mb-4 text-sm sm:text-base">Choose a page:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {availablePages.map((page) => (
                  <a
                    key={page}
                    href={page}
                    className="px-3 sm:px-4 py-2 bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors text-sm sm:text-base text-black font-medium"
                  >
                    {dashboardConfig.pages[page].title.value || page}
                  </a>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-400 mb-6 text-sm sm:text-base">No pages are configured.</p>
        )}
        
        <a
          href="config"
          className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors font-medium text-sm sm:text-base"
        >
          Configure Dashboard
        </a>
      </div>
    </main>
  );
}
