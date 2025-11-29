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
  position?: string
  team_id?: string
  hire_date?: string
  salary?: number
  contract_type: 'CDI' | 'CDD' | 'Stage' | 'Freelance'
  status: 'active' | 'inactive' | 'on_leave'
  created_at: string
  updated_at: string
}

export const createEmployeeSchema = z.object({
  full_name: z.string().min(1, 'Le nom complet est requis'),
  email: z.string().email().optional().or(z.literal('')),
  position: z.string().optional(),
  hire_date: z.string().optional(),
  salary: z.number().optional(),
  contract_type: z.enum(['CDI', 'CDD', 'Stage', 'Freelance']).optional().default('CDI'),
  status: z.enum(['active', 'inactive', 'on_leave']).optional().default('active')
})

export const updateEmployeeSchema = z.object({
  full_name: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal('')),
  position: z.string().optional(),
  hire_date: z.string().optional(),
  salary: z.number().optional(),
  contract_type: z.enum(['CDI', 'CDD', 'Stage', 'Freelance']).optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).optional()
})

export type CreateEmployeeData = z.infer<typeof createEmployeeSchema>
export type UpdateEmployeeData = z.infer<typeof updateEmployeeSchema>

export async function createEmployee(orgId: string, data: CreateEmployeeData, actorId?: string) {
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

  const { data: employee, error } = await supabase
    .from('employees')
    .insert({
      org_id: orgId,
      full_name: data.full_name,
      email: data.email || null,
      position: data.position || null,
      hire_date: data.hire_date || null,
      salary: data.salary || null,
      contract_type: data.contract_type || 'CDI',
      status: data.status || 'active'
    })
    .select()
    .single()

  if (error) throw error

  // Log audit
  await logAuditEvent(orgId, 'employee.created', {
    actorId,
    targetTable: 'employees',
    targetId: employee.id,
    metadata: { full_name: data.full_name, position: data.position }
  })

  return employee as Employee
}

export async function getEmployees(orgId: string) {
  try {
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
      .from('employees')
      .select('*')
      .eq('org_id', orgId)
      .order('full_name')

    if (error) throw error
    return data as Employee[]
  } catch (error: any) {
    console.error('Error in getEmployees:', error)
    // Return empty array if cookies/supabase fails
    return []
  }
}

export async function getEmployee(employeeId: string, orgId: string) {
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
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .eq('org_id', orgId)
    .single()

  if (error) throw error
  return data as Employee
}

export async function updateEmployee(employeeId: string, orgId: string, data: UpdateEmployeeData, actorId?: string) {
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

  // Build update object with only provided fields
  const updateData: Record<string, any> = {}
  if (data.full_name !== undefined) updateData.full_name = data.full_name
  if (data.email !== undefined) updateData.email = data.email || null
  if (data.position !== undefined) updateData.position = data.position || null
  if (data.hire_date !== undefined) updateData.hire_date = data.hire_date || null
  if (data.salary !== undefined) updateData.salary = data.salary || null
  if (data.contract_type !== undefined) updateData.contract_type = data.contract_type
  if (data.status !== undefined) updateData.status = data.status

  const { data: employee, error } = await supabase
    .from('employees')
    .update(updateData)
    .eq('id', employeeId)
    .eq('org_id', orgId)
    .select()
    .single()

  if (error) throw error

  // Log audit
  await logAuditEvent(orgId, 'employee.updated', {
    actorId,
    targetTable: 'employees',
    targetId: employee.id,
    metadata: updateData
  })

  return employee as Employee
}

export async function deleteEmployee(employeeId: string, orgId: string, actorId?: string) {
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
    .from('employees')
    .delete()
    .eq('id', employeeId)
    .eq('org_id', orgId)

  if (error) throw error

  // Log audit
  await logAuditEvent(orgId, 'employee.deleted', {
    actorId,
    targetTable: 'employees',
    targetId: employeeId,
    metadata: { deleted_at: new Date().toISOString() }
  })
}

export async function searchEmployees(orgId: string, searchTerm: string) {
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
    .from('employees')
    .select('*')
    .eq('org_id', orgId)
    .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%`)
    .order('full_name')

  if (error) throw error
  return data as Employee[]
}



