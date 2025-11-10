import { NextRequest, NextResponse } from 'next/server'
import { requireOrganization } from '@/domains/core/auth'
import { getLeaveRequests, createLeaveRequest } from '@/domains/people/leave-requests'

export async function GET() {
  try {
    const org = await requireOrganization()
    const leaveRequests = await getLeaveRequests(org.id)
    
    return NextResponse.json(leaveRequests)
  } catch (error: any) {
    console.error('Error fetching leave requests:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leave requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const org = await requireOrganization()
    const body = await request.json()
    
    const { employee_id, type, start_date, end_date, comment } = body
    
    if (!employee_id || !type || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'Missing required fields: employee_id, type, start_date, end_date' },
        { status: 400 }
      )
    }
    
    const leaveRequest = await createLeaveRequest(
      org.id,
      employee_id,
      type,
      start_date,
      end_date,
      comment
    )
    
    if (!leaveRequest) {
      return NextResponse.json(
        { error: 'Failed to create leave request' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(leaveRequest)
  } catch (error: any) {
    console.error('Leave request creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create leave request' },
      { status: 400 }
    )
  }
}