import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { logAuditEvent } from '../core/audit'

export interface Customer {
  id: string
  org_id: string
  name: string
  email?: string
  address: {
    street?: string
    city?: string
    postal_code?: string
    country?: string
  }
  created_at: string
  updated_at: string
}

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email().optional().or(z.literal('')),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().default('France')
  }).optional()
})

export type CreateCustomerData = z.infer<typeof createCustomerSchema>

export async function createCustomer(orgId: string, data: CreateCustomerData, actorId?: string) {
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

  const { data: customer, error } = await supabase
    .from('customers')
    .insert({
      org_id: orgId,
      name: data.name,
      email: data.email || null,
      address: data.address || {}
    })
    .select()
    .single()

  if (error) throw error

  // Log audit
  await logAuditEvent(orgId, 'customer.created', {
    actorId,
    targetTable: 'customers',
    targetId: customer.id,
    metadata: { name: data.name }
  })

  return customer as Customer
}

export async function getCustomers(orgId: string) {
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
    .from('customers')
    .select('*')
    .eq('org_id', orgId)
    .order('name')

  if (error) throw error
  return data as Customer[]
}

export async function getCustomer(customerId: string, orgId: string) {
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
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .eq('org_id', orgId)
    .single()

  if (error) throw error
  return data as Customer
}



