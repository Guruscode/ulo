import { NextResponse, type NextRequest } from 'next/server'

import { getDashboardPathForRole } from '@/lib/auth/redirects'
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/server/auth/session'

const AUTH_PAGES = ['/login', '/signup']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value

  let sessionRole: 'user' | 'admin' | null = null

  if (token) {
    try {
      const session = await verifySessionToken(token)
      sessionRole = session.role
    } catch (_error) {
      sessionRole = null
    }
  }

  if (AUTH_PAGES.includes(pathname) && sessionRole) {
    return NextResponse.redirect(new URL(getDashboardPathForRole(sessionRole), request.url))
  }

  if (pathname.startsWith('/dashboard')) {
    if (!sessionRole) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (sessionRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  if (pathname.startsWith('/admin')) {
    if (!sessionRole) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (sessionRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard/:path*', '/admin/:path*'],
}
