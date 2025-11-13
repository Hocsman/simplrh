// Leave requests domain logic
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export interface LeaveRequest {
  id: string
  org_id: string
  employee_id: string
  type: string
  start_date: string
  end_date: string
  status: 'pending' | 'approved' | 'rejected'
  approver_id?: string
  comment?: string
  created_at: string
  updated_at: string
  employee?: {
    full_name: string
    email?: string
  }
}

export async function getLeaveRequests(orgId: string): Promise<LeaveRequest[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leave_requests')
    .select(`
      *,
      employee:employees(full_name, email)
    `)
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leave requests:', error)
    return []
  }

  return data || []
}

export async function getLeaveRequest(id: string, orgId: string): Promise<LeaveRequest | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leave_requests')
    .select(`
      *,
      employee:employees(full_name, email)
    `)
    .eq('id', id)
    .eq('org_id', orgId)
    .single()

  if (error) {
    console.error('Error fetching leave request:', error)
    return null
  }

  return data
}

export async function updateLeaveRequestStatus(
  id: string,
  orgId: string,
  status: 'approved' | 'rejected',
  approverId: string,
  comment?: string
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('leave_requests')
    .update({
      status,
      approver_id: approverId,
      comment,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('org_id', orgId)

  if (error) {
    console.error('Error updating leave request:', error)
    return false
  }

  return true
}

export async function createLeaveRequest(
  orgId: string,
  employeeId: string,
  type: string,
  startDate: string,
  endDate: string,
  comment?: string
): Promise<LeaveRequest | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leave_requests')
    .insert({
      org_id: orgId,
      employee_id: employeeId,
      type,
      start_date: startDate,
      end_date: endDate,
      status: 'pending',
      comment
    })
    .select(`
      *,
      employee:employees(full_name, email)
    `)
    .single()

  if (error) {
    console.error('Error creating leave request:', error)
    return null
  }

  return data
}

// Schema for updating leave request
export const updateLeaveRequestSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  comment: z.string().optional()
})

export type UpdateLeaveRequestData = z.infer<typeof updateLeaveRequestSchema>

// Update leave request (alias for updateLeaveRequestStatus)
export async function updateLeaveRequest(
  id: string,
  orgId: string,
  data: UpdateLeaveRequestData,
  approverId?: string
): Promise<LeaveRequest | null> {
  const success = await updateLeaveRequestStatus(
    id,
    orgId,
    data.status,
    approverId || 'system',
    data.comment
  )
  
  if (!success) {
    return null
  }
  
  return getLeaveRequest(id, orgId)
}
