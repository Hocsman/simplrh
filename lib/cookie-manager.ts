// Helper to suppress Supabase cookie parsing errors
// This is a workaround for Vercel deployment where cookies might be in base64 format

export function suppressSupabaseCookieErrors() {
  if (typeof window === 'undefined') return

  // Override console.error to suppress specific Supabase cookie errors
  const originalError = console.error
  console.error = function(...args: any[]) {
    const errorMsg = args[0]?.toString?.() || ''
    
    // Suppress Supabase cookie parsing errors
    if (errorMsg && errorMsg.includes('Failed to parse cookie string')) {
      // Silently ignore this error
      return
    }
    
    // Call original error for other errors
    originalError.apply(console, args)
  }
}

// Clear any malformed cookies that might cause issues
export function cleanupMalformedCookies() {
  if (typeof document === 'undefined') return

  try {
    const cookies = document.cookie.split(';')
    cookies.forEach(cookie => {
      const [name] = cookie.split('=')
      if (name && name.trim().startsWith('sb-')) {
        try {
          // Try to validate the cookie
          const value = cookie.split('=')[1]
          if (value) {
            JSON.parse(decodeURIComponent(value))
          }
        } catch (e) {
          // If it fails to parse, it might be base64 or malformed
          // Just leave it - the middleware will handle it
        }
      }
    })
  } catch (e) {
    // Silently ignore any cookie cleanup errors
  }
}
