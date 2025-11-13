import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // If there's an error from Supabase
  if (error) {
    console.error('Supabase auth error:', error, errorDescription)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(errorDescription || error)}`
    )
  }

  const supabase = await createClient()

  // Handle email confirmation or password recovery with token_hash
  if (token_hash && type) {
    console.log('Verifying OTP with type:', type, 'token_hash present:', !!token_hash)

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    })

    console.log('Verify OTP result:', { data: !!data, error: verifyError })

    if (verifyError) {
      console.error('Error verifying OTP:', verifyError)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent(verifyError.message || 'Lien expiré ou invalide')}`
      )
    }

    // If it's a password recovery, redirect to reset password page
    if (type === 'recovery') {
      console.log('Redirecting to reset password page')
      return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password?type=recovery`)
    }

    // Otherwise redirect to dashboard
    console.log('Redirecting to:', next)
    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  }

  // Handle OAuth callback with code
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent('Erreur d\'authentification')}`
      )
    }

    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  }

  // If no token_hash, code, or error, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}
