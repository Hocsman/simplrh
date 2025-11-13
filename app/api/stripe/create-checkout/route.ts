import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  planId: z.string(),
  interval: z.enum(['monthly', 'yearly']),
  successUrl: z.string().optional(),
  cancelUrl: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, interval, successUrl, cancelUrl } = checkoutSchema.parse(body)
    
    const session = await createCheckoutSession(
      planId,
      interval,
      undefined, // customerId - would be fetched from current user
      successUrl,
      cancelUrl
    )
    
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 400 }
    )
  }
}












