import { NextResponse } from "next/server";
import { getCurrentAuthUser } from "@repo/lib";
import { Entitlements } from "@repo/types/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// All limits are now unlimited since data is stored locally
const UNLIMITED_ENTITLEMENTS: Entitlements = {
  planId: "local",
  maxDashboards: -1,
  maxHAInstances: -1,
  maxSidebars: -1,
  trialEndsAt: null,
  active: true,
};

export async function GET() {
  try {
    const user = await getCurrentAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(UNLIMITED_ENTITLEMENTS);
  } catch (error) {
    return NextResponse.json(UNLIMITED_ENTITLEMENTS);
  }
}
