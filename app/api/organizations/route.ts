import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  logger.debug('Organization API called')

  try {
    const supabase = await createClient()

    // Get current user
    logger.debug('Checking authentication')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      logger.warn('Auth error in organization creation', { error: userError })
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    logger.info(`User authenticated: ${user.email}`, { userId: user.id })

    // Ensure user exists in users table
    logger.debug('Ensuring user exists in users table')
    const { error: userUpsertError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0]
      }, { onConflict: 'id' })

    if (userUpsertError) {
      logger.warn('User upsert error', { error: userUpsertError })
    } else {
      logger.debug('User exists in users table')
    }

    // Parse body
    const body = await request.json()
    logger.debug('Organization creation request', { name: body.name })

    // Simple validation
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      logger.warn('Invalid organization name', { name: body.name })
      return NextResponse.json(
        { error: 'Le nom de l\'organization est requis (minimum 2 caractères)' },
        { status: 400 }
      )
    }

    const orgName = body.name.trim()
    const orgSiret = body.siret && body.siret.trim().length > 0 ? body.siret.trim() : null

    logger.debug('Validation passed', { name: orgName, siret: orgSiret })

    // Create organization
    logger.info('Creating organization in database')
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

    const { data: org, error: orgError } = await supabase
      .from('orgs')
      .insert(orgData)
      .select()
      .single()

    if (orgError) {
      logger.error('Organization creation error', orgError)
      throw orgError
    }

    logger.success(`Organization created: ${org.id} - ${orgName}`)

    // Add owner as member
    logger.debug('Adding user as owner member')
    const { error: memberError } = await supabase
      .from('members')
      .insert({
        org_id: org.id,
        user_id: user.id,
        role: 'owner'
      })

    if (memberError) {
      logger.error('Member creation error', memberError)
      throw memberError
    }

    logger.success(`Organization setup complete for ${orgName}`)

    return NextResponse.json(org, { status: 201 })
  } catch (error: any) {
    logger.error('Organization creation failed', error, {
      message: error.message,
      code: error.code
    })
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
