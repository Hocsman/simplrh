import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // If there's an error from Supabase
  if (error) {
    console.error('Supabase auth error:', error, errorDescription)

    // Redirect to login with error
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(errorDescription || error)}`
    )
  }

  if (code) {
    const supabase = await createClient()

    // Exchange the code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent('Erreur d\'authentification')}`
      )
    }

    // Check if this is a password recovery
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Check if this is a password reset flow
      const isPasswordReset = requestUrl.searchParams.get('type') === 'recovery'

      if (isPasswordReset) {
        // Redirect to password reset page
        return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password?type=recovery`)
      }

      // Otherwise redirect to next page (usually dashboard)
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }
  }

  // If no code and no error, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}
