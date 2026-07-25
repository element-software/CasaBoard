"use client";
import { LinkService } from "@repo/lib";
import Link from "next/link";

export function UnderDevelopmentBanner() {
  return (
    <div
      className="sticky top-0 z-50 w-full border-b border-primary/25 bg-secondary px-4 py-2 text-center text-white shadow-sm flex flex-row items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Under development
      </p>
      <p className="text-xs text-foreground-600 ml-2">
        Features and behavior may change. Refer to the <Link href={LinkService.crossAppHref("public", "/terms")} className="text-primary hover:underline">Terms of Service</Link> for more information.
      </p>
    </div>
  );
}
