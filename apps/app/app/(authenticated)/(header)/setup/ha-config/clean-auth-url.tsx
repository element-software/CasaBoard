"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LinkService } from "@repo/lib";

export function CleanAuthUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("auth_callback")) {
      router.push(LinkService.crossAppHrefClient("app", "/setup/ha-config"));
    }
  }, [searchParams]);

  return <></>
}