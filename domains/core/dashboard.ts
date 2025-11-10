import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export interface DashboardStats {
  totalInvoices: number
  totalRevenue: number
  pendingInvoices: number
  overdueInvoices: number
  totalEmployees: number
  pendingLeaveRequests: number
  recentDocuments: number
}

export async function getDashboardStats(orgId: string): Promise<DashboardStats> {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // No-op for server components
        },
        remove(name: string, options: any) {
          // No-op for server components
        },
      },
    }
  )

  try {
    // Get invoice stats
    const { data: invoices } = await supabase
      .from('invoices')
      .select('total_ttc, status, due_date')
      .eq('org_id', orgId)

    const totalInvoices = invoices?.length || 0
    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total_ttc || 0), 0) || 0
    const pendingInvoices = invoices?.filter(inv => inv.status === 'sent').length || 0
    
    // Calculate overdue invoices
    const today = new Date()
    const overdueInvoices = invoices?.filter(inv => {
      if (inv.status !== 'sent') return false
      const dueDate = new Date(inv.due_date)
      return dueDate < today
    }).length || 0

    // Get employee stats
    const { data: employees } = await supabase
      .from('employees')
      .select('id')
      .eq('org_id', orgId)

    const totalEmployees = employees?.length || 0

    // Get leave request stats
    const { data: leaveRequests } = await supabase
      .from('leave_requests')
      .select('id')
      .eq('org_id', orgId)
      .eq('status', 'pending')

    const pendingLeaveRequests = leaveRequests?.length || 0

    // Get document stats
    const { data: documents } = await supabase
      .from('doc_requests')
      .select('id')
      .eq('org_id', orgId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

    const recentDocuments = documents?.length || 0

    return {
      totalInvoices,
      totalRevenue,
      pendingInvoices,
      overdueInvoices,
      totalEmployees,
      pendingLeaveRequests,
      recentDocuments
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    // Return default values if there's an error
    return {
      totalInvoices: 0,
      totalRevenue: 0,
      pendingInvoices: 0,
      overdueInvoices: 0,
      totalEmployees: 0,
      pendingLeaveRequests: 0,
      recentDocuments: 0
    }
  }
}

export async function getRecentInvoices(orgId: string, limit = 5) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // No-op for server components
        },
        remove(name: string, options: any) {
          // No-op for server components
        },
      },
    }
  )

  const { data } = await supabase
    .from('invoices')
    .select(`
      id,
      number,
      total_ttc,
      status,
      due_date,
      customers:customer_id (
        name
      )
    `)
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}

export async function getOverdueInvoices(orgId: string, limit = 5) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // No-op for server components
        },
        remove(name: string, options: any) {
          // No-op for server components
        },
      },
    }
  )

  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('invoices')
    .select(`
      id,
      number,
      total_ttc,
      status,
      due_date,
      customers:customer_id (
        name
      )
    `)
    .eq('org_id', orgId)
    .eq('status', 'sent')
    .lt('due_date', today)
    .order('due_date', { ascending: true })
    .limit(limit)

  return data || []
}

export async function getPendingLeaveRequests(orgId: string, limit = 5) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // No-op for server components
        },
        remove(name: string, options: any) {
          // No-op for server components
        },
      },
    }
  )

  const { data } = await supabase
    .from('leave_requests')
    .select(`
      id,
      type,
      start_date,
      end_date,
      status,
      employees:employee_id (
        full_name
      )
    `)
    .eq('org_id', orgId)
    .eq('status', 'pending')
    .order('start_date', { ascending: true })
    .limit(limit)

  return data || []
}

export async function getRecentDocuments(orgId: string, limit = 5) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // No-op for server components
        },
        remove(name: string, options: any) {
          // No-op for server components
        },
      },
    }
  )

  const { data } = await supabase
    .from('doc_requests')
    .select('id, template_key, status, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}



