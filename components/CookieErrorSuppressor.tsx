'use client'

import { useEffect } from 'react'

/**
 * Cleans up malformed Supabase cookies in localStorage and suppresses related errors
 * This is a known issue with Vercel deployments where cookies might be stored in base64 format
 */
export function CookieErrorSuppressor() {
  useEffect(() => {
    // Clean up malformed Supabase cookies from localStorage
    try {
      const keysToRemove: string[] = []

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('sb-')) {
          try {
            const value = localStorage.getItem(key)
            if (value) {
              // Try to parse it as JSON
              JSON.parse(value)
            }
          } catch (e) {
            // If it fails to parse, mark it for removal (it's malformed)
            keysToRemove.push(key)
          }
        }
      }

      // Remove malformed keys
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key)
          console.log(`Cleaned up malformed Supabase cookie: ${key}`)
        } catch (err) {
          // Silently ignore if we can't remove it
        }
      })
    } catch (err) {
      // Silently ignore any errors during cleanup
    }

    // Override console.error to suppress Supabase cookie parsing errors
    const originalError = console.error
    console.error = function(...args: any[]) {
      const errorMsg = args[0]?.toString?.() || ''

      // Suppress Supabase cookie parsing errors silently
      if (errorMsg && errorMsg.includes('Failed to parse cookie string')) {
        return // Silently ignore
      }

      // Suppress Supabase unexpected token errors for base64 cookies
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
