import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { logAuditEvent } from '../core/audit'

export interface Invoice {
  id: string
  org_id: string
  customer_id: string
  number: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  due_date?: string
  total_ht: number
  total_ttc: number
  vat: number
  pdf_path?: string
  facturx_xml_path?: string
  created_at: string
  updated_at: string
  customer?: Customer
  items?: InvoiceItem[]
}

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

export interface InvoiceItem {
  id: string
  invoice_id: string
  label: string
  qty: number
  unit_price: number
  vat_rate: number
  created_at: string
}

export const createInvoiceSchema = z.object({
  customer_id: z.string().uuid(),
  due_date: z.string().optional(),
  items: z.array(z.object({
    label: z.string().min(1),
    qty: z.number().min(0.01),
    unit_price: z.number().min(0),
    vat_rate: z.number().min(0).max(100).default(20)
  })).min(1)
})

export type CreateInvoiceData = z.infer<typeof createInvoiceSchema>

export async function createInvoice(orgId: string, data: CreateInvoiceData, actorId?: string) {
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

  // Générer le numéro de facture
  const { count } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)

  const invoiceNumber = `FAC-${String((count || 0) + 1).padStart(4, '0')}`

  // Calculer les totaux
  const totalHT = data.items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0)
  const vat = data.items.reduce((sum, item) => 
    sum + (item.qty * item.unit_price * item.vat_rate / 100), 0
  )
  const totalTTC = totalHT + vat

  // Créer la facture
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      org_id: orgId,
      customer_id: data.customer_id,
      number: invoiceNumber,
      due_date: data.due_date,
      total_ht: totalHT,
      total_ttc: totalTTC,
      vat: vat,
      status: 'draft'
    })
    .select()
    .single()

  if (invoiceError) throw invoiceError

  // Créer les items
  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(
      data.items.map(item => ({
        invoice_id: invoice.id,
        label: item.label,
        qty: item.qty,
        unit_price: item.unit_price,
        vat_rate: item.vat_rate
      }))
    )

  if (itemsError) throw itemsError

  // Log audit
  await logAuditEvent(orgId, 'invoice.created', {
    actorId,
    targetTable: 'invoices',
    targetId: invoice.id,
    metadata: { number: invoiceNumber, total_ttc: totalTTC }
  })

  return invoice as Invoice
}

export async function getInvoices(orgId: string, limit = 50) {
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
    .from('invoices')
    .select(`
      *,
      customer:customers(*),
      items:invoice_items(*)
    `)
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Invoice[]
}

export async function updateInvoiceStatus(
  invoiceId: string, 
  status: Invoice['status'], 
  orgId: string,
  actorId?: string
) {
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

  const { data, error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', invoiceId)
    .eq('org_id', orgId)
    .select()
    .single()

  if (error) throw error

  // Log audit
  await logAuditEvent(orgId, 'invoice.status_updated', {
    actorId,
    targetTable: 'invoices',
    targetId: invoiceId,
    metadata: { status }
  })

  return data as Invoice
}

export async function getOverdueInvoices(orgId: string) {
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

  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customer:customers(*)
    `)
    .eq('org_id', orgId)
    .in('status', ['sent'])
    .lt('due_date', today)

  if (error) throw error
  return data as Invoice[]
}



