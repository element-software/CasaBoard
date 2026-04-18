"use client";

import { useState } from "react";
import { LinkService, SupabaseClient } from "@repo/lib";
import { useSearchParams } from "next/navigation";
import { CasaBoardLogo } from "@repo/ui/components/Logo/index";
import { Button } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiGoogle, mdiShieldLock, mdiDrag, mdiCloudOutline } from "@mdi/js";
import Link from "next/link";

const features = [
  { icon: mdiDrag, text: "Drag-and-drop dashboard editor" },
  { icon: mdiShieldLock, text: "Credentials stay local by default" },
  { icon: mdiCloudOutline, text: "Optional cloud sync on paid plans" },
];

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/setup";

  const supabase = SupabaseClient.createClient();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel — branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-violet-600 to-indigo-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Subtle background circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />

        <div className="relative z-10 text-center flex flex-col items-center max-w-md">
          <CasaBoardLogo size="large" />
          <h1 className="text-4xl font-bold text-white mt-8 mb-3 tracking-tight">
            CasaBoard
          </h1>
          <p className="text-violet-200 text-lg mb-10">
            Beautiful Home Assistant dashboards, built by you.
          </p>

          <div className="w-full space-y-4 text-left mb-10">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon path={f.icon} className="w-5 h-5 text-white" />
                </div>
                <span className="text-violet-100 text-sm">{f.text}</span>
              </div>
            ))}
          </div>

          <a
            href={LinkService.crossAppHref("public", "/")}
            className="text-violet-300 text-sm hover:text-white transition-colors"
          >
            ← Back to casaboard.dev
          </a>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 md:w-1/2 items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex flex-col items-center mb-8 md:hidden">
            <CasaBoardLogo size="medium" />
            <span className="text-slate-900 font-semibold text-xl mt-3">CasaBoard</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Sign in
          </h2>
          <p className="text-slate-500 mb-8 text-sm">
            Welcome back — sign in to your account.
          </p>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              onPress={handleGoogleSignIn}
              color="primary"
              size="lg"
              className="w-full font-semibold shadow-md shadow-violet-100"
              isDisabled={loading}
            >
              {loading ? (
                "Signing in…"
              ) : (
                <>
                  <Icon path={mdiGoogle} className="w-4 h-4 mr-2" />
                  Continue with Google
                </>
              )}
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            By signing in you agree to our{" "}
            <Link
              href={LinkService.crossAppHref("public", "/terms")}
              className="text-violet-600 hover:underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href={LinkService.crossAppHref("public", "/privacy")}
              className="text-violet-600 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
