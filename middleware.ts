import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // 🔧 MODE DÉVELOPPEMENT : Authentification désactivée temporairement
  // Pour activer l'authentification, changez cette valeur à false
  const DEV_MODE_NO_AUTH = true
  
  if (DEV_MODE_NO_AUTH) {
    console.log('🔓 Mode développement : authentification désactivée')
    return res
  }
  
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co') {
    // If Supabase is not configured, allow access to all routes
    return res
  }
  
  const supabase = createMiddlewareClient({ req, res })

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

  // Special handling for onboarding
  if (req.nextUrl.pathname === '/onboarding' && session) {
    // Check if user already has an organization
    const { data: orgs } = await supabase
      .from('members')
      .select('org_id')
      .eq('user_id', session.user.id)
      .limit(1)

    if (orgs && orgs.length > 0) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
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