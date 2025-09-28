export type PlanId =
  | "free-trial"
  | "starter"
  | "mid"
  | "pro"
  | "super_25"
  | "super_40"
  | "super_60";

export interface Entitlements {
  planId: PlanId;
  maxDashboards: number; // -1 for unlimited
  maxHAInstances: number; // -1 for unlimited
  trialEndsAt: string | null; // ISO when trial ends
  active: boolean; // whether user has active access
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
  status: "trialing" | "active" | "past_due" | "canceled" | "incomplete" | "unpaid" | "incomplete_expired";
}


export interface SubscriptionSummary {
  status: string;
  planId: PlanId | 'unknown';
  trialEndsAt: string | null;
  hasPaymentMethod: boolean | null;
  planLabel?: string | null;
}
