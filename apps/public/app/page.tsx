export const dynamic = 'force-dynamic'; // disables static prerender for this route

import { Suspense } from "react";
import { HomePageContent } from "./HomePageContent";

function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-background via-theme-surface to-theme-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-300 rounded-2xl animate-pulse"></div>
          </div>
          <div className="h-16 bg-gray-300 rounded w-64 mx-auto mb-6 animate-pulse"></div>
          <div className="h-8 bg-gray-300 rounded w-96 mx-auto mb-8 animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-12 animate-pulse"></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-12 bg-gray-300 rounded w-32 animate-pulse"></div>
            <div className="h-12 bg-gray-300 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-theme-surface/50 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works Skeleton */}
        <div className="bg-theme-surface/50 rounded-lg p-8 mb-16">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded w-20 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section Skeleton */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-theme-primary/10 to-theme-accent/10 border border-theme-primary/20 rounded-lg p-12">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-8 animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 bg-gray-300 rounded w-40 animate-pulse"></div>
              <div className="h-12 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}