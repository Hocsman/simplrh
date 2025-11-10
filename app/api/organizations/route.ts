import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createOrganizationSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
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
            // No-op for API routes
          },
          remove(name: string, options: any) {
            // No-op for API routes
          },
        },
      }
    )

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user exists in users table
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0]
      })

    if (userError) {
      console.error('User upsert error:', userError)
    }

    const body = await request.json()
    const data = createOrganizationSchema.parse(body)

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('orgs')
      .insert({
        name: data.name,
        siret: data.siret,
        owner_id: user.id,
        billing_plan: 'starter',
        modules: {
          billing: true,
          people: true,
          docs: true
        }
      })
      .select()
      .single()

    if (orgError) throw orgError

    // Add owner as member
    const { error: memberError } = await supabase
      .from('members')
      .insert({
        org_id: org.id,
        user_id: user.id,
        role: 'owner'
      })

    if (memberError) throw memberError

    return NextResponse.json(org)
  } catch (error: any) {
    console.error('Organization creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create organization' },
      { status: 400 }
    )
  }
}




