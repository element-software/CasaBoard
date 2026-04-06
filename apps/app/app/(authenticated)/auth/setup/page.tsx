import { redirect } from "next/navigation";
import { getCurrentAuthUser } from "@repo/lib";

export const dynamic = "force-dynamic";

export default async function AuthSetupPage() {
  // Ensure user is authenticated before proceeding to main setup
  const user = await getCurrentAuthUser();
  if (!user) {
    redirect("/auth/login?redirectTo=/auth/setup");
  }

  // Redirect directly to main setup — no subscription required
  redirect("/setup");
}
