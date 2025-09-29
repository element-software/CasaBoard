import { NextResponse } from "next/server";
import { SubscriptionService } from "@repo/lib";
import { getCurrentAuthUser } from "@repo/lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entitlements = await SubscriptionService.getEntitlementsForCurrentUser();
    
    return NextResponse.json(entitlements);
  } catch (error) {
    console.error("Failed to fetch entitlements:", error);
    return NextResponse.json(
      { error: "Failed to fetch entitlements" },
      { status: 500 }
    );
  }
}
