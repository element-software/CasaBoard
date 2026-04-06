import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Billing portal is no longer available — app is local-first with no subscription
export async function GET() {
  return NextResponse.json(
    { error: "Billing is not available in local-first mode." },
    { status: 410 }
  );
}
