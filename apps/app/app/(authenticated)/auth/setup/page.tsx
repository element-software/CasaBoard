import { redirect } from "next/navigation";
import { LinkService, SubscriptionService, getCurrentAuthUser, serverLogger } from "@repo/lib";
import TrialSetupWrapper from "./TrialSetupWrapper";

export const dynamic = "force-dynamic";

export default async function AuthSetupPage() {
  // Ensure user is authenticated
  const user = await getCurrentAuthUser();
  if (!user) {
    redirect("/auth/login?redirectTo=/auth/setup");
  }

  // Check if user already has an active subscription
  const subscription = await SubscriptionService.getCurrentSubscriptionSummary();
  if (subscription.status === 'trialing' || subscription.status === 'active') {
    // User already has a subscription, redirect to main setup
    redirect("/setup");
  }

  // Create trial subscription for first-time user
  let trialCreated = false;
  try {
    trialCreated = await SubscriptionService.ensureTrialOnFirstLogin();
    if (trialCreated) {
      serverLogger.info("AuthSetupPage", "Trial subscription created for first-time user");
    }
  } catch (err) {
    serverLogger.error("AuthSetupPage", "Failed to ensure trial on first login", err);
  }

  return (
    <TrialSetupWrapper trialCreated={trialCreated} />
  );
}
