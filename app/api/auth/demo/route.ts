// Demo authentication API for testing without Supabase
import { NextRequest, NextResponse } from 'next/server'
import { mockUser, mockOrganization } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, action } = body

    // Simple demo authentication
    if (action === 'signup' || action === 'login') {
      // Accept any email/password for demo
      return NextResponse.json({
        user: mockUser,
        organization: mockOrganization,
        session: {
          access_token: 'demo-token',
          refresh_token: 'demo-refresh-token',
          expires_at: Date.now() + 3600000, // 1 hour
          user: mockUser
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Demo auth failed' },
      { status: 500 }
    )
  }
}






