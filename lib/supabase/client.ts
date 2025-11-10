import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Client-side Supabase client (pour les composants clients)
export const createClient = () => createClientComponentClient()

// Admin client (service role)
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClientComponentClient({
    supabaseUrl,
    supabaseKey: supabaseServiceKey
  })
}