import { NextRequest, NextResponse } from "next/server";
import { StripeService } from "@repo/lib";
import { SupabaseServer } from "@repo/lib";
import { getCurrentAuthUser } from "@repo/lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = await SupabaseServer.createClient();
    const user = await getCurrentAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const stripe = StripeService.getStripe();
    const origin = req.headers.get("origin") || new URL(req.url).origin;

    // Create a customer portal session using email lookup
    const customers = await stripe.customers.list({ email: user.email ?? undefined, limit: 1 });
    const customer = customers.data[0];
    if (!customer) return NextResponse.json({ error: "No customer" }, { status: 404 });

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${origin}/billing`,
    });
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    return NextResponse.json({ error: "Portal init failed" }, { status: 500 });
  }
}


