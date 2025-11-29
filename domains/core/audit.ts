import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export interface AuditLog {
  id: string
  org_id: string
  actor_id?: string
  action: string
  target_table?: string
  target_id?: string
  metadata: Record<string, any>
  created_at: string
}

export async function logAuditEvent(
  orgId: string,
  action: string,
  options: {
    actorId?: string
    targetTable?: string
    targetId?: string
    metadata?: Record<string, any>
  } = {}
) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { error } = await supabase
    .from('audit_logs')
    .insert({
      org_id: orgId,
      actor_id: options.actorId,
      action,
      target_table: options.targetTable,
      target_id: options.targetId,
      metadata: options.metadata || {}
    })

  if (error) {
    console.error('Failed to log audit event:', error)
  }
}

export async function getAuditLogs(orgId: string, limit = 50) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      users:actor_id (
        full_name,
        email
      )
    `)
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as AuditLog[]
}



