import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Billing success page is no longer applicable — redirect to profile
export default async function BillingSuccessPage() {
  redirect("/auth/profile");
}
