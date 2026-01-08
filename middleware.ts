import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/logout', '/'];

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route => pathname === route);

    // Check if it's an API route or static file
    const isApiRoute = pathname.startsWith('/api');
    const isStaticFile = pathname.startsWith('/_next') || pathname.includes('.');

    // Allow public routes, API routes, and static files
    if (isPublicRoute || isApiRoute || isStaticFile) {
        return NextResponse.next();
    }

    // Redirect to login if not authenticated and trying to access protected route
    if (!token && pathname.startsWith('/dashboard')) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
