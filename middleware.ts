import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export async function middleware(req: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: req,
  })

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co') {
    return supabaseResponse
  }

  try {
    // Clean up any malformed supabase cookies from the request
    const cookiesToDelete = req.cookies.getAll()
      .filter(c => c.name.startsWith('sb-'))
      .map(c => c.name)

    // Remove malformed cookies from response
    cookiesToDelete.forEach(name => {
      supabaseResponse.cookies.delete(name)
    })

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll().filter(c => !c.name.startsWith('sb-'))
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
              supabaseResponse = NextResponse.next({
                request: req,
              })
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              )
            } catch (error) {
              // Silently ignore cookie errors
            }
          },
        },
      }
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const pathname = req.nextUrl.pathname

    // Auth pages - redirect to dashboard if already logged in
    if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')) && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Protected routes - let the page handle auth checks
    // The pages will use requireOrganization() and handle redirects properly
  } catch (error) {
    // Silently continue on any middleware errors
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