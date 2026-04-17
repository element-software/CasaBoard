// Use Stripe product IDs instead of local plan IDs
export type PlanId = string; // Stripe product ID

export interface Entitlements {
  planId: PlanId; // Stripe product ID
  maxDashboards: number; // -1 for unlimited
  maxHAInstances: number; // -1 for unlimited
  maxSidebars: number; // -1 for unlimited
  maxItemsPerDashboard: number; // -1 for unlimited; free tier = 20
  trialEndsAt: string | null; // ISO when trial ends
  active: boolean; // whether user has active access (free tier = true)
  /** When true, user may opt in to storing HA URLs in Supabase (paid + user toggle). */
  haCloudSync: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  monthly: number;
  yearly: number;
  dashboards: number;
  ha: number;
  popular: boolean;
  features: string[];
}

export interface SubscriptionRecord {
  plan_id: PlanId;
  current_period_end: string; // ISO
  status:
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "incomplete"
    | "unpaid"
    | "incomplete_expired";
}

// Types for simplified subscription data
export interface SubscriptionData {
  subscription: any;
  product: any;
  price: any;
  customerId: string;
  isActive: boolean;
  isTrial: boolean;
  trialEndsAt: string | null;
}

// Public API type derived from SubscriptionData
export interface SubscriptionSummary {
  status: string;
  planId: PlanId | 'unknown';
  trialEndsAt: string | null;
  hasPaymentMethod: boolean | null;
  planLabel?: string | null;
  currentPeriodEnd?: string | null;
}