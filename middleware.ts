import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page and auth endpoint
  if (pathname === '/admin' || pathname.startsWith('/api/admin/auth')) {
    return NextResponse.next();
  }

  const session = req.cookies.get('admin-session');
  const expected = process.env.ADMIN_PASSWORD ?? 'halyard-admin';
  const isAuthenticated = session && session.value === expected;

  // Protect Admin UI routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  // Protect Admin API routes
  if (pathname.startsWith('/api/admin')) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
