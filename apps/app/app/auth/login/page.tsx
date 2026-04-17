import { LoginForm } from "@repo/ui/components/Login/LoginForm";
import { Suspense } from "react";

function LoginPageSkeleton() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Logo skeleton */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-50 to-indigo-50 items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-violet-100 rounded-2xl mx-auto mb-6 animate-pulse"></div>
          <div className="h-8 bg-violet-100 rounded w-48 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-violet-100 rounded w-64 mx-auto animate-pulse"></div>
        </div>
      </div>

      {/* Right side - Login form skeleton */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
