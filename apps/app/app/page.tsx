import { redirect } from "next/navigation";
import { HAConnectionActions } from "@repo/lib";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const connection = await HAConnectionActions.getHAConnection();
  redirect(connection ? "/setup" : "/setup/ha-config");
}
