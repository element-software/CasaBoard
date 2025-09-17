import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SupabaseMiddleware } from '@repo/lib';
import { getCurrentAuthUser } from '@repo/lib';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for static files and certain paths
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/(public)/') ||
    pathname.includes('.') ||
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/instructions' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const { supabase, response } = SupabaseMiddleware.createClient(request);

  // Refresh session if expired - required for Server Components
  const user = await getCurrentAuthUser();

  // Protect API routes that require authentication
  if (pathname.startsWith('/api/') && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Protect all authenticated routes (everything under /(authenticated))
  // These are the actual paths that need protection
  const protectedPaths = ['/setup', '/config', '/api/pages'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // Also protect dynamic routes that are not auth-related
  // Exclude common static files and system files
  const staticFilePatterns = [
    /\.(txt|xml|ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/i,
    /^\/robots\.txt$/,
    /^\/sitemap\.xml$/,
    /^\/favicon\.ico$/,
    /^\/manifest\.json$/
  ];
  
  const isStaticFile = staticFilePatterns.some(pattern => pattern.test(pathname));
  const isDynamicRoute = pathname.match(/^\/[^\/]+$/) && !isStaticFile; // matches /something but not /something/else
  const isNotAuthRoute = !pathname.startsWith('/auth/');
  
  if ((isProtectedPath || (isDynamicRoute && isNotAuthRoute)) && !user) {
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
