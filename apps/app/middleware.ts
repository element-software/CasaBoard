import { NextResponse, type NextRequest } from "next/server";
import {
  INGRESS_COOKIE,
  INGRESS_HEADER,
  normalizeIngressPrefix,
} from "@repo/lib/ingress/path";

const SUPERVISOR_INGRESS_IP = "172.30.32.2";

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "";
  }
  return request.headers.get("x-real-ip") ?? "";
}

function isAllowedSupervisorClient(ip: string): boolean {
  return (
    ip === SUPERVISOR_INGRESS_IP ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === ""
  );
}

export function middleware(request: NextRequest) {
  if (process.env.SUPERVISOR_TOKEN) {
    const ip = clientIp(request);
    if (!isAllowedSupervisorClient(ip)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  const ingressPath = normalizeIngressPrefix(
    request.headers.get(INGRESS_HEADER)
  );
  const response = NextResponse.next();

  if (ingressPath) {
    response.cookies.set(INGRESS_COOKIE, ingressPath, {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
    });
  } else {
    response.cookies.delete(INGRESS_COOKIE);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
