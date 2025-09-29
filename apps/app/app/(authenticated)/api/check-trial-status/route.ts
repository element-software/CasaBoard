import { NextResponse } from "next/server";
import { SubscriptionService } from "@repo/lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const subscription = await SubscriptionService.getCurrentSubscriptionSummary();
    const isTrial = subscription.status === 'trialing';
    
    return NextResponse.json({ 
      isTrial,
      status: subscription.status 
    });
  } catch (error) {
    return NextResponse.json({ 
      isTrial: false,
      status: 'error',
      error: 'Failed to check trial status'
    }, { status: 500 });
  }
}
