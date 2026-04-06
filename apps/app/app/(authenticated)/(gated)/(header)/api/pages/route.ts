import { NextResponse } from "next/server";

// Pages are now stored in localStorage — this server API is no longer used
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { error: "Pages are now stored in localStorage. Use the client-side storage API." },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Pages are now stored in localStorage. Use the client-side storage API." },
    { status: 410 }
  );
}
