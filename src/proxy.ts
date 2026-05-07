import { NextRequest, NextResponse } from 'next/server';

import { guestOnlyRoutes } from './proxy/routes';
import { isLoggedInHeaderKey } from './proxy/const';
import { getIsAllowedPath } from './proxy/helpers';

export const proxy = async (req: NextRequest) => {
  const session = req.cookies.get('session')?.value;
  const sessionSig = req.cookies.get('session.sig')?.value;
  const isLoggedIn = !!session && !!sessionSig;

  const { pathname } = req.nextUrl;
  const isGuestOnlyPath = getIsAllowedPath(pathname, guestOnlyRoutes);

  if (isGuestOnlyPath && isLoggedIn) return NextResponse.redirect(new URL('/', req.url));

  const isGuestAccessingProtectedRoute = !isGuestOnlyPath && !isLoggedIn;
  if (isGuestAccessingProtectedRoute) {
    const newURL = new URL('/signin', req.url);

    newURL.searchParams.set('from', pathname + req.nextUrl.search);

    return NextResponse.redirect(newURL);
  }

  const headers = new Headers(req.headers);
  headers.set(isLoggedInHeaderKey, String(isLoggedIn));
  headers.set('x-pathname', req.nextUrl.pathname);

  return NextResponse.next({ request: { headers } });
};

export const config = {
  matcher: ['/((?!api|_next|assets|favicon.ico|robots.txt|sitemap.xml).*)'],
};
