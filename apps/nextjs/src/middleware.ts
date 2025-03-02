import { ROUTE_SIGNUP, ROUTE_LOGIN, ROUTE_HOME } from '@/data/routes'
import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

const unauthenticatedRoutes = [ROUTE_SIGNUP, ROUTE_LOGIN]
const authenticatedRoutes = [ROUTE_HOME]

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const route = url.pathname
  const sessionCookie = getSessionCookie(req, {
    cookiePrefix: '__Secure-better-auth',
  })

  if (
    sessionCookie &&
    unauthenticatedRoutes.includes(
      route as (typeof unauthenticatedRoutes)[number]
    )
  ) {
    return NextResponse.redirect(new URL(ROUTE_HOME, url))
  }

  if (
    !sessionCookie &&
    authenticatedRoutes.includes(route as (typeof authenticatedRoutes)[number])
  ) {
    return NextResponse.redirect(new URL(ROUTE_LOGIN, url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - error page
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|error).*)',
  ],
}
