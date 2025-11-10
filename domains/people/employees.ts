import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { logAuditEvent } from '../core/audit'

export interface Employee {
  id: string
  org_id: string
  user_id?: string
  full_name: string
  email?: string
  team_id?: string
  hire_date?: string
  created_at: string
  updated_at: string
}

export const createEmployeeSchema = z.object({
  full_name: z.string().min(1, 'Le nom complet est requis'),
  email: z.string().email().optional().or(z.literal('')),
  hire_date: z.string().optional()
})

export type CreateEmployeeData = z.infer<typeof createEmployeeSchema>

export async function createEmployee(orgId: string, data: CreateEmployeeData, actorId?: string) {
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

  const { data: employee, error } = await supabase
    .from('employees')
    .insert({
      org_id: orgId,
      full_name: data.full_name,
      email: data.email || null,
      hire_date: data.hire_date || null
    })
    .select()
    .single()

  if (error) throw error

  // Log audit
  await logAuditEvent(orgId, 'employee.created', {
    actorId,
    targetTable: 'employees',
    targetId: employee.id,
    metadata: { full_name: data.full_name }
  })

  return employee as Employee
}

export async function getEmployees(orgId: string) {
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
    .from('employees')
    .select('*')
    .eq('org_id', orgId)
    .order('full_name')

  if (error) throw error
  return data as Employee[]
}

export async function getEmployee(employeeId: string, orgId: string) {
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
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .eq('org_id', orgId)
    .single()

  if (error) throw error
  return data as Employee
}



