import {
  SupabaseServer,
  SubscriptionService,
  getCurrentAuthUser,
} from "@repo/lib";
import { redirect } from "next/navigation";
import ProfileClient from "./profile.client";

export default async function ProfilePage() {
  const supabase = await SupabaseServer.createClient();
  const user = await getCurrentAuthUser();
  if (!user) {
    redirect("/auth/login?redirectTo=/auth/profile");
  }

  const profile = {
    email: user?.email || null,
    id: user?.id || null,
    // @ts-ignore
    verified: Boolean(user?.email_confirmed_at || user?.email_confirmed),
    // @ts-ignore
    lastSignIn: user?.last_sign_in_at || null,
  };

  const entitlements =
    await SubscriptionService.getEntitlementsForCurrentUser();
  const subscription =
    await SubscriptionService.getCurrentSubscriptionSummary();

  return (
    <ProfileClient
      profile={profile}
      entitlements={entitlements}
      subscription={subscription}
    />
  );
}
