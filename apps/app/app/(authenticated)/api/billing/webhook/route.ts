import { NextRequest, NextResponse } from "next/server";
import { SupabaseServer, StripeService  } from "@repo/lib";

export async function POST(req: NextRequest) {
  const stripe = StripeService.getStripe();
  const sig = req.headers.get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!whSecret || !sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  const raw = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await SupabaseServer.createClient();
  switch (event.type) {
    case "checkout.session.completed": {
      const session: any = event.data.object;
      const userId = session?.metadata?.user_id;
      const planId = session?.metadata?.plan_id;
      if (userId && planId) {
        await supabase.from("subscriptions").insert({
          user_id: userId,
          plan_id: planId,
          status: "active",
          current_period_end: new Date().toISOString(),
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.created":
    case "customer.subscription.deleted": {
      const sub: any = event.data.object;
      const userId = sub?.metadata?.user_id;
      if (userId) {
        await supabase.from("subscriptions").insert({
          user_id: userId,
          plan_id: sub.items?.data?.[0]?.price?.nickname ?? "starter",
          status: sub.status,
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        });
      }
      break;
    }
    default:
      break;
  }
  return NextResponse.json({ received: true });
}


