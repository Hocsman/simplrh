import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

// Custom storage that doesn't actually store anything (in-memory only)
// This prevents Supabase from trying to parse malformed cookies from localStorage
class NoOpStorage implements Storage {
  length = 0

  clear(): void {}
  getItem(): string | null {
    return null
  }
  key(): string | null {
    return null
  }
  removeItem(): void {}
  setItem(): void {}
}

// Client-side Supabase client (pour les composants clients)
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Use a no-op storage to prevent reading/writing malformed cookies from localStorage
      storage: new NoOpStorage(),
    }
  )
}