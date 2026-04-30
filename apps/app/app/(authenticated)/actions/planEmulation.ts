"use server";
import { cookies } from "next/headers";
import { getCurrentAuthUser } from "@repo/lib";
import {
  EMULATION_EMAIL,
  EMULATION_COOKIE,
  EmulatedTier,
} from "@repo/lib/utils/planEmulation";

export async function setPlanEmulation(tier: EmulatedTier | "off") {
  const user = await getCurrentAuthUser().catch(() => null);
  if (!user || user.email !== EMULATION_EMAIL) return;

  const store = await cookies();
  if (tier === "off") {
    store.delete(EMULATION_COOKIE);
  } else {
    store.set(EMULATION_COOKIE, tier, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }
}
