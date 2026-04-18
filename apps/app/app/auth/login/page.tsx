import { LoginForm } from "@repo/ui/components/Login/LoginForm";
import { Suspense } from "react";

function LoginPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel skeleton */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-violet-600 to-indigo-700 items-center justify-center p-12">
        <div className="text-center">
          <div className="w-32 h-32 bg-white/20 rounded-2xl mx-auto mb-6 animate-pulse"></div>
          <div className="h-8 bg-white/20 rounded w-48 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-white/20 rounded w-64 mx-auto animate-pulse"></div>
        </div>
      </div>
      {/* Right panel skeleton */}
      <div className="flex flex-1 items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm space-y-4">
          <div className="h-9 bg-slate-100 rounded w-32 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-100 rounded w-48 animate-pulse"></div>
          <div className="h-12 bg-slate-100 rounded-lg mt-6 animate-pulse"></div>
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
