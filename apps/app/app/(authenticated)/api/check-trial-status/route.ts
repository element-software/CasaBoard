import { NextResponse } from "next/server";

// Trial check no longer applicable — app is local-first with no subscription
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ isTrial: true, status: "active" });
}
