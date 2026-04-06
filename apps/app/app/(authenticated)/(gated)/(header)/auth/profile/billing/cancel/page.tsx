import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Billing cancel page is no longer applicable — redirect to profile
export default async function BillingCancelPage() {
  redirect("/auth/profile");
}
