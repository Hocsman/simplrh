'use client'

import { useEffect } from 'react'

/**
 * Suppresses Supabase cookie parsing errors that occur in the browser
 * This is a known issue with Vercel deployments where cookies might be in unexpected formats
 */
export function CookieErrorSuppressor() {
  useEffect(() => {
    // Override console.error to suppress Supabase cookie parsing errors
    const originalError = console.error
    console.error = function(...args: any[]) {
      const errorMsg = args[0]?.toString?.() || ''

      // Suppress Supabase cookie parsing errors silently
      if (errorMsg && errorMsg.includes('Failed to parse cookie string')) {
        return // Silently ignore
      }

      // Suppress Supabase unexpected token errors
      if (errorMsg && errorMsg.includes('Unexpected token')) {
        const context = args[0]?.toString?.() || ''
        if (context.includes('base64') || context.includes('sb-')) {
          return // Silently ignore Supabase cookie errors
        }
      }

      // Call original error for other errors
      originalError.apply(console, args)
    }

    return () => {
      // Restore original console.error on cleanup
      console.error = originalError
    }
  }, [])

  return null
}
