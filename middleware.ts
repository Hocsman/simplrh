import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export async function middleware(req: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: req,
  })

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co') {
    console.log('⚠️ Supabase non configuré - mode développement')
    return supabaseResponse
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: req,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/billing', '/people', '/docs', '/settings', '/onboarding']
  const authPaths = ['/auth/login', '/auth/signup']
  
  const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => req.nextUrl.pathname.startsWith(path))

  // Redirect to login if accessing protected route without session
  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if accessing auth pages with session
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Check if user has organization (except for onboarding page)
  if (session && isProtectedPath && req.nextUrl.pathname !== '/onboarding') {
    const { data: members } = await supabase
      .from('members')
      .select('org_id')
      .eq('user_id', session.user.id)
      .limit(1)

    // If no organization, redirect to onboarding
    if (!members || members.length === 0) {
      console.log('📋 User has no organization, redirecting to onboarding')
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }

  // Special handling for onboarding
  if (req.nextUrl.pathname === '/onboarding' && session) {
    // Check if user already has an organization
    const { data: members } = await supabase
      .from('members')
      .select('org_id')
      .eq('user_id', session.user.id)
      .limit(1)

    if (members && members.length > 0) {
      console.log('✅ User already has organization, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}