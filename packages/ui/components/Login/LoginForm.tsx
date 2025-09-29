"use client";

import { useState } from "react";
import { LinkService, SupabaseClient } from "@repo/lib";
import { useSearchParams } from "next/navigation";
import { CasaBoardLogo } from "@repo/ui/components/Logo/index";
import { Button, Card, CardBody } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiGoogle } from "@mdi/js";

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
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center">
      {/* Left side - Logo */}
      <div className="flex w-full md:w-1/2 items-center justify-center pr-4 border-r border-theme-border">
        <div className="text-center max-w-md py-4 px-8">
          <CasaBoardLogo size="large" variant="dark" stacked={true} />
          <h1 className="text-3xl font-bold text-theme-text mt-8 mb-4">
            Welcome to CasaBoard
          </h1>
          <p className="text-theme-text text-lg">
            Your smart home dashboard, simplified and beautiful.
          </p>
          <Button
            className="mt-4"
            as={"a"}
            href={LinkService.crossAppHref("public", "/")}
            color="primary"
          >
            Back to Home
          </Button>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="bg-theme-surface/60 backdrop-blur border border-theme-border">
            <CardBody className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-theme-text mb-2">
                  Sign in
                </h2>
              </div>

              <div className="space-y-6">
                {error && (
                  <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button
                  onPress={handleGoogleSignIn}
                  color="primary"
                  className="w-full font-medium"
                  isDisabled={loading}
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      <Icon path={mdiGoogle} className="w-4 h-4 mr-2" />
                      Continue with Google
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-theme-text-secondary">
                  By signing in, you agree to our Terms and Privacy Policy.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
