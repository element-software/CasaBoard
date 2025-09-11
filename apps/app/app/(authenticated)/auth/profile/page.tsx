import { SupabaseServer } from "@repo/lib";
import { redirect } from "next/navigation";
import ProfileClient from "./profile.client";

export default async function ProfilePage() {
  const supabase = await SupabaseServer.createClient();
  const { data: { user } } = await supabase.auth.getUser();
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

  return <ProfileClient profile={profile} />;
}

