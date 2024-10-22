import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  if (!session && (
    req.nextUrl.pathname.startsWith('/trips') ||
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/profile') ||
    req.nextUrl.pathname.startsWith('/activity') ||
    req.nextUrl.pathname.startsWith('/itinerary')
  )) {
    // Redirect to login page if accessing protected routes
    return NextResponse.redirect(new URL('/auth?mode=login', req.url))
  }

  // If the user is authenticated and trying to access login, signup, forgot password, or home pages, redirect to dashboard
  if (session && (
    req.nextUrl.pathname === '/auth' ||
    req.nextUrl.pathname === '/login' ||
    req.nextUrl.pathname === '/signup' ||
    req.nextUrl.pathname === '/auth/forgot-password' ||
    req.nextUrl.pathname === '/'
  )) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/',
    '/trips/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/activity/:path*',
    '/itinerary/:path*',
    '/auth',
    '/auth/forgot-password',
    '/login',
    '/signup'
  ],
}
