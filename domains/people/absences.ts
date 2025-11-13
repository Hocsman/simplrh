import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { logAuditEvent } from '../core/audit'

export interface Absence {
  id: string
  org_id: string
  employee_id: string
  date: string
  type: string
  source: 'manual' | 'import' | 'auto'
  created_at: string
  employee?: {
    full_name: string
    email?: string
  }
}

export const createAbsenceSchema = z.object({
  employee_id: z.string().uuid(),
  date: z.string(),
  type: z.string().min(1),
  source: z.enum(['manual', 'import', 'auto']).default('manual')
})

export type CreateAbsenceData = z.infer<typeof createAbsenceSchema>

export async function createAbsence(
  orgId: string, 
  data: CreateAbsenceData, 
  actorId?: string
): Promise<Absence> {
  const cookieStore = cookies()
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

  const { data: absence, error } = await supabase
    .from('absences')
    .insert({
      org_id: orgId,
      employee_id: data.employee_id,
      date: data.date,
      type: data.type,
      source: data.source
    })
    .select(`
      *,
      employee:employees(full_name, email)
    `)
    .single()

  if (error) throw error

  // Log audit
  await logAuditEvent(orgId, 'absence.created', {
    actorId,
    targetTable: 'absences',
    targetId: absence.id,
    metadata: { employee_id: data.employee_id, date: data.date, type: data.type }
  })

  return absence as Absence
}

export async function getAbsences(orgId: string, startDate?: string, endDate?: string) {
  const cookieStore = cookies()
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

  let query = supabase
    .from('absences')
    .select(`
      *,
      employee:employees(full_name, email)
    `)
    .eq('org_id', orgId)

  if (startDate) {
    query = query.gte('date', startDate)
  }
  if (endDate) {
    query = query.lte('date', endDate)
  }

  const { data, error } = await query.order('date', { ascending: false })

  if (error) throw error
  return data as Absence[]
}

export async function getAbsencesByEmployee(orgId: string, employeeId: string) {
  const cookieStore = cookies()
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
    .from('absences')
    .select(`
      *,
      employee:employees(full_name, email)
    `)
    .eq('org_id', orgId)
    .eq('employee_id', employeeId)
    .order('date', { ascending: false })

  if (error) throw error
  return data as Absence[]
}

export async function deleteAbsence(absenceId: string, orgId: string, actorId?: string) {
  const cookieStore = cookies()
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
    .from('absences')
    .delete()
    .eq('id', absenceId)
    .eq('org_id', orgId)

  if (error) throw error

  // Log audit
  await logAuditEvent(orgId, 'absence.deleted', {
    actorId,
    targetTable: 'absences',
    targetId: absenceId
  })
}






