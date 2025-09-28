import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { SupabaseMiddleware } from '@repo/lib';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Create Supabase client for auth state
  const { supabase, response } = SupabaseMiddleware.createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Require auth on explicit sections or top-level non-auth routes
  const protectedPaths = ['/setup', '/config', '/api/pages'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const segments = pathname.split('/').filter(Boolean);
  const isTopLevel = segments.length === 1;
  const isAuthRoute = pathname.startsWith('/auth/');
  const requireAuth = isProtected || (isTopLevel && !isAuthRoute);

  if (requireAuth && !user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml, manifest.json (static files)
     * - files with extensions (static files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.).*)',
  ],
};