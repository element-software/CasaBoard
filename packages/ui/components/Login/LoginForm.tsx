"use client";

import { useState } from "react";
import { SupabaseClient } from "@repo/lib";
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
    <div className="min-h-screen bg-theme-background flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <CasaBoardLogo size="large" variant="dark" stacked={true} />
        </div>

        <Card className="bg-theme-surface/60 backdrop-blur border border-theme-border">
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-theme-text mb-2">Welcome</h2>
              <p className="text-theme-text-secondary">Sign in to access your dashboards</p>
              <p className="text-xs text-white">We only support logging in with Google at the moment</p>
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
                {loading ? "Signing in..." :  (
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
  );
}
