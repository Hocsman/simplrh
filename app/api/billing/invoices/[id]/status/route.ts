import { NextRequest, NextResponse } from 'next/server'
import { requireOrganization } from '@/domains/core/auth'
import { updateInvoiceStatus } from '@/domains/billing/invoices'
import { z } from 'zod'

const updateStatusSchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue'])
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const org = await requireOrganization()
    const body = await request.json()
    
    const { status } = updateStatusSchema.parse(body)
    
    const invoice = await updateInvoiceStatus(params.id, status, org.id)
    
    return NextResponse.json(invoice)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update invoice status' },
      { status: 400 }
    )
  }
}












