import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

export function middleware(request) {
  // Get pathname of request (e.g. /products, /de/products)
  const pathname = request.nextUrl.pathname;
  
  // Check if the pathname already includes a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) return NextResponse.next();
  
  // Detect user's preferred language
  const preferredLocale = defaultLocale;
  
  // Redirect to URL with locale
  return NextResponse.redirect(
    new URL(
      `/${preferredLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`,
      request.url
    )
  );
}

export const config = {
  matcher: [
    // Skip next internal paths (_next/...)
    '/((?!_next|api|favicon.ico).*)',
  ],
};