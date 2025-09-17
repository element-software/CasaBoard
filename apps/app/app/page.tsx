import { getCurrentAuthUser } from "@repo/lib";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getCurrentAuthUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return redirect("/setup")
}
