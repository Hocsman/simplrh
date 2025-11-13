// Demo mode utilities
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return !!(
    url && 
    key && 
    url !== 'your_supabase_project_url' && 
    key !== 'your_supabase_anon_key'
  )
}

export function isDemoMode(): boolean {
  return !isSupabaseConfigured()
}

// Demo mode banner message
export const DEMO_MODE_MESSAGE = "Mode démo activé - Supabase non configuré. Certaines fonctionnalités sont limitées."







