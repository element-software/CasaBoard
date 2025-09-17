import { NextRequest, NextResponse } from "next/server";
import { SupabaseServer, StripeService, getCurrentAuthUser } from "@repo/lib";

export async function POST(req: NextRequest) {
  try {
    const supabase = await SupabaseServer.createClient();
    const user = await getCurrentAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Find mapped Stripe customer id
    const { data: map, error: mapErr } = await supabase
      .from("billing_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();
    if (mapErr || !map?.stripe_customer_id) {
      return NextResponse.json({ error: "No Stripe customer for user" }, { status: 400 });
    }

    const stripe = StripeService.getStripe();
    // Get active subscription for the customer
    const subs = await stripe.subscriptions.list({ customer: map.stripe_customer_id, status: "active", limit: 1 });
    const sub = subs.data[0];
    if (!sub) {
      return NextResponse.json({ error: "No active subscription" }, { status: 404 });
    }

    // Cancel at period end
    const updated = await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });

    const origin = req.headers.get("origin") || new URL(req.url).origin;
    return NextResponse.redirect(`${origin}/billing/cancel?sub_id=${updated.id}`);
  } catch (e) {
    return NextResponse.json({ error: "Cancel failed" }, { status: 500 });
  }
}


