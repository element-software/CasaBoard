import { Entitlements, SubscriptionData, SubscriptionSummary } from "@repo/types/subscription";
import { createClient, getCurrentAuthUser } from "../supabase/server";
import { StripeService } from "./stripeService";
import { serverLogger } from "../logger";

export class SubscriptionService {
  /**
   * Single method to get all subscription data from Stripe
   * Handles errors gracefully and cleans up invalid customer mappings
   */
  static async getCurrentSubscription(): Promise<SubscriptionData | null> {
    const user = await getCurrentAuthUser();
    if (!user) return null;

    // Get customer ID from database (fast lookup)
    const customerId = await this.getStripeCustomerIdForCurrentUser();
    if (!customerId) return null;

    try {
      const stripe = StripeService.getStripe();
      
      // Get all subscriptions from Stripe
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        limit: 10 // Get more to find the right one
      });

      if (subscriptions.data.length === 0) return null;

      // Priority order: Active trials > Active subscriptions > Other
      let selectedSubscription: any = null;
      
      // 1. Look for active trials first
      const activeTrial = subscriptions.data.find(sub => 
        sub.status === 'trialing' && sub.trial_end
      );
      
      // 2. Look for active subscriptions (non-trial)
      const activeSubscription = subscriptions.data.find(sub => 
        sub.status === 'active' && !sub.trial_end
      );
      
      // 3. Look for any active subscription (including past trials)
      const anyActiveSubscription = subscriptions.data.find(sub => 
        ['active', 'trialing'].includes(sub.status)
      );

      selectedSubscription = activeTrial || activeSubscription || anyActiveSubscription;

      if (!selectedSubscription) return null;

      // Get product details from the selected subscription
      const price = selectedSubscription.items.data[0].price;
      const product = await stripe.products.retrieve(price.product as string);

      return {
        subscription: selectedSubscription,
        product,
        price,
        customerId,
        isActive: ['active', 'trialing'].includes(selectedSubscription.status),
        isTrial: !!selectedSubscription.trial_end,
        trialEndsAt: selectedSubscription.trial_end ? new Date(selectedSubscription.trial_end * 1000).toISOString() : null
      };
    } catch (error: any) {
      // Handle case where customer doesn't exist in Stripe
      if (error.code === 'resource_missing') {
        serverLogger.warn('subscriptionService', 'Customer not found in Stripe, cleaning up', {
          customerId,
          userId: user.id,
          error: error.message
        });
        // Clean up invalid customer ID
        await this.cleanupInvalidCustomer(user.id, customerId);
        return null;
      }
      serverLogger.error('subscriptionService', 'Failed to get subscription data', {
        customerId,
        userId: user.id,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get entitlements from Stripe product metadata
   * Prioritizes active trials over other subscriptions
   */
  static async getEntitlementsForCurrentUser(): Promise<Entitlements> {
    const data = await this.getCurrentSubscription();
    if (!data) {
      // Free tier — users with no subscription still get access
      return {
        planId: "free",
        maxDashboards: 1,
        maxHAInstances: 1,
        maxSidebars: 0,
        maxItemsPerDashboard: 20,
        trialEndsAt: null,
        active: true,
        haCloudSync: false,
      };
    }

    // Get entitlements from Stripe product metadata
    // Use -1 for unlimited, fallback to 1 for missing metadata
    const maxDashboards = data.product.metadata?.max_dashboards 
      ? (data.product.metadata.max_dashboards === "-1" ? -1 : parseInt(data.product.metadata.max_dashboards))
      : 1;
    
    const maxHAInstances = data.product.metadata?.max_ha_instances 
      ? (data.product.metadata.max_ha_instances === "-1" ? -1 : parseInt(data.product.metadata.max_ha_instances))
      : 1;

    const maxSidebars = data.product.metadata?.max_sidebars 
      ? (data.product.metadata.max_sidebars === "-1" ? -1 : parseInt(data.product.metadata.max_sidebars))
      : 1;

    const maxItemsPerDashboard = data.product.metadata?.max_items_per_dashboard
      ? (data.product.metadata.max_items_per_dashboard === "-1" ? -1 : parseInt(data.product.metadata.max_items_per_dashboard))
      : -1; // Paid tiers default to unlimited if metadata not set

    const haCloudSync = data.product.metadata?.ha_cloud_sync === "true";

    serverLogger.info('subscriptionService', 'Retrieved entitlements from Stripe product metadata', {
      productId: data.product.id,
      productName: data.product.name,
      maxDashboards,
      maxHAInstances,
      maxSidebars,
      maxItemsPerDashboard,
      isTrial: data.isTrial,
      trialEndsAt: data.trialEndsAt,
      subscriptionStatus: data.subscription.status
    });

    return {
      planId: data.product.id, // Use Stripe product ID
      maxDashboards,
      maxHAInstances,
      maxSidebars,
      maxItemsPerDashboard,
      trialEndsAt: data.trialEndsAt,
      active: data.isActive,
      haCloudSync,
    };
  }

  /**
   * Convert SubscriptionData to public SubscriptionSummary format
   */
  private static async toSubscriptionSummary(data: SubscriptionData | null): Promise<SubscriptionSummary> {
    if (!data) {
      return {
        status: "none",
        planId: "free",
        trialEndsAt: null,
        hasPaymentMethod: null,
        planLabel: "Free",
        currentPeriodEnd: null,
      };
    }

    const hasPaymentMethod = await this.checkPaymentMethod(data.customerId);

    return {
      status: data.subscription.status,
      planId: data.product.id,
      trialEndsAt: data.trialEndsAt,
      hasPaymentMethod,
      planLabel: data.product.name,
      currentPeriodEnd: data.subscription.current_period_end ? 
        new Date(data.subscription.current_period_end * 1000).toISOString() : null
    };
  }

  /**
   * Simplified subscription summary - uses single subscription data source
   */
  static async getCurrentSubscriptionSummary(): Promise<SubscriptionSummary> {
    const data = await this.getCurrentSubscription();
    return this.toSubscriptionSummary(data);
  }
  /**
   * Ensure a Stripe 14‑day mid plan trial exists for the current user.
   * - Creates Stripe customer record and local mapping if missing
   * - Creates a subscription with trial_period_days=14 (no payment method required)
   * - Cancels automatically at trial end if no payment method added
   * - Returns true if a trial was created, false if user already has a subscription
   */
  static async ensureTrialOnFirstLogin(): Promise<boolean> {
    const user = await getCurrentAuthUser();
    if (!user) return false;

    // Check if user already has subscription
    const existing = await this.getCurrentSubscription();
    if (existing) return false;

    try {
      const stripe = StripeService.getStripe();
      
      // Create customer if needed
      let customerId = await this.getStripeCustomerIdForCurrentUser();
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          metadata: { user_id: user.id },
        });
        
        const supabase = await createClient();
        await supabase
          .from("billing_customers")
          .insert({ user_id: user.id, stripe_customer_id: customer.id })
          .select()
          .single();
        customerId = customer.id;
      }

      // Create mid plan trial subscription
      const priceId = await StripeService.getCheckoutPriceForPlan("mid", "monthly");
      await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days: 14,
        collection_method: "charge_automatically",
        trial_settings: { end_behavior: { missing_payment_method: "cancel" } },
        metadata: { plan_id: "mid", origin: "auto-free-trial" },
      });

      serverLogger.info('subscriptionService', 'Created trial subscription', {
        userId: user.id,
        customerId,
        priceId
      });

      return true;
    } catch (error: any) {
      serverLogger.error('subscriptionService', 'Failed to create trial subscription', {
        userId: user.id,
        error: error.message
      });
      throw error;
    }
  }

  static async getStripeCustomerIdForCurrentUser(): Promise<string | null> {
    const supabase = await createClient();
    const user = await getCurrentAuthUser();
    if (!user) return null;

    const { data } = await supabase
      .from("billing_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();
    return data?.stripe_customer_id ?? null;
  }


  /**
   * Check if customer has payment methods
   */
  private static async checkPaymentMethod(customerId: string): Promise<boolean> {
    try {
      const stripe = StripeService.getStripe();
      const paymentMethods = await stripe.paymentMethods.list({ 
        customer: customerId, 
        type: 'card' 
      });
      return (paymentMethods?.data?.length || 0) > 0;
    } catch (error) {
      serverLogger.warn('subscriptionService', 'Failed to check payment methods', {
        customerId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  /**
   * Clean up invalid customer ID from database
   */
  private static async cleanupInvalidCustomer(userId: string, customerId: string): Promise<void> {
    try {
      const supabase = await createClient();
      await supabase
        .from('billing_customers')
        .delete()
        .eq('user_id', userId)
        .eq('stripe_customer_id', customerId);
      
      serverLogger.info('subscriptionService', 'Cleaned up invalid customer mapping', {
        userId,
        customerId
      });
    } catch (error) {
      serverLogger.error('subscriptionService', 'Failed to cleanup invalid customer', {
        userId,
        customerId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}


