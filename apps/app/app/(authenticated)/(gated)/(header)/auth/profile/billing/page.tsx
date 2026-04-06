import { redirect } from "next/navigation";

// Billing is no longer available — redirect to profile
export default async function BillingPage() {
  redirect("/auth/profile");
}
