import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  console.log('🚀 Organization API called')
  
  try {
    const supabase = await createClient()

    // Get current user
    console.log('🔍 Checking authentication...')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('❌ Auth error:', userError)
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    console.log('✅ User authenticated:', user.email, 'ID:', user.id)

    // Ensure user exists in users table
    console.log('👤 Ensuring user exists in users table...')
    const { error: userUpsertError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0]
      }, { onConflict: 'id' })

    if (userUpsertError) {
      console.error('⚠️ User upsert error:', userUpsertError)
    } else {
      console.log('✅ User exists in users table')
    }

    // Parse body
    const body = await request.json()
    console.log('📝 Raw body received:', JSON.stringify(body, null, 2))
    
    // Simple validation without Zod for debugging
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      console.error('❌ Invalid name:', body.name)
      return NextResponse.json(
        { error: 'Le nom de l\'organisation est requis (minimum 2 caractères)' },
        { status: 400 }
      )
    }

    const orgName = body.name.trim()
    const orgSiret = body.siret && body.siret.trim().length > 0 ? body.siret.trim() : null
    
    console.log('✅ Validation passed - Name:', orgName, 'SIRET:', orgSiret)

    // Create organization
    console.log('🏢 Creating organization in database...')
    const orgData = {
      name: orgName,
      siret: orgSiret,
      owner_id: user.id,
      billing_plan: 'suite',
      modules: {
        billing: true,
        people: true,
        docs: true
      }
    }
    console.log('📊 Org data to insert:', JSON.stringify(orgData, null, 2))
    
    const { data: org, error: orgError } = await supabase
      .from('orgs')
      .insert(orgData)
      .select()
      .single()

    if (orgError) {
      console.error('❌ Org creation error:', orgError)
      throw orgError
    }

    console.log('✅ Organization created:', org.id)

    // Add owner as member
    console.log('👤 Adding user as owner member...')
    const { error: memberError } = await supabase
      .from('members')
      .insert({
        org_id: org.id,
        user_id: user.id,
        role: 'owner'
      })

    if (memberError) {
      console.error('❌ Member creation error:', memberError)
      throw memberError
    }

    console.log('✅ User added as owner')
    console.log('🎉 Organization setup complete!')

    return NextResponse.json(org, { status: 201 })
  } catch (error: any) {
    console.error('❌ Organization creation error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create organization',
        details: error.details || error.hint || 'Erreur inconnue',
        code: error.code
      },
      { status: 500 }
    )
  }
}




