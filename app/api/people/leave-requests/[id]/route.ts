import { NextRequest, NextResponse } from 'next/server'
import { requireOrganization } from '@/domains/core/auth'
import { updateLeaveRequest, updateLeaveRequestSchema } from '@/domains/people/leave-requests'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const org = await requireOrganization()
    const body = await request.json()
    
    const data = updateLeaveRequestSchema.parse(body)
    
    const leaveRequest = await updateLeaveRequest(params.id, org.id, data)
    
    return NextResponse.json(leaveRequest)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update leave request' },
      { status: 400 }
    )
  }
}











