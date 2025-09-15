import { NextRequest, NextResponse } from "next/server";
import { StripeService } from "@repo/lib";
import { SupabaseServer } from "@repo/lib";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const plan = searchParams.get("plan");
    if (!plan) {
      return NextResponse.json({ error: "Missing plan" }, { status: 400 });
    }
    const supabase = await SupabaseServer.createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const stripe = StripeService.getStripe();
    const price = await StripeService.getCheckoutPriceForPlan(plan as any);

    const origin = req.headers.get("origin") || new URL(req.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email ?? undefined,
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/billing?success=true`,
      cancel_url: `${origin}/billing?canceled=true`,
      metadata: { user_id: user.id, plan_id: plan },
    });
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (error) {
    return NextResponse.json({ error: "Checkout init failed" }, { status: 500 });
  }
}


