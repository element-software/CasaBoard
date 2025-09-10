import { SupabaseServer } from "@repo/lib";
import { redirect } from "next/navigation";

const checkAuth = async () => {
  const supabase = await SupabaseServer.createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export default async function HomePage() {
  const user = await checkAuth();

  if (!user) {
    return redirect("/auth/login");
  }

  return redirect("/setup")
}
