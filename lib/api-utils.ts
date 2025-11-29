import { NextResponse } from 'next/server'
import { createClient } from './supabase/server'
import { logger } from './logger'

// Standard API error responses
export class ApiError {
  static unauthorized(message = 'Non authentifié') {
    return NextResponse.json({ error: message }, { status: 401 })
  }

  static forbidden(message = 'Accès refusé') {
    return NextResponse.json({ error: message }, { status: 403 })
  }

  static notFound(message = 'Ressource non trouvée') {
    return NextResponse.json({ error: message }, { status: 404 })
  }

  static badRequest(message = 'Requête invalide') {
    return NextResponse.json({ error: message }, { status: 400 })
  }

  static internal(message = 'Erreur interne du serveur') {
    return NextResponse.json({ error: message }, { status: 500 })
  }

  static conflict(message = 'Conflit') {
    return NextResponse.json({ error: message }, { status: 409 })
  }
}

// Success responses
export class ApiSuccess {
  static ok<T>(data: T, status = 200) {
    return NextResponse.json(data, { status })
  }

  static created<T>(data: T) {
    return NextResponse.json(data, { status: 201 })
  }

  static noContent() {
    return new NextResponse(null, { status: 204 })
  }
}

// Get authenticated user and organization
export async function getAuthContext() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: ApiError.unauthorized(), user: null, orgId: null, supabase }
  }

  const { data: member } = await supabase
    .from('members')
    .select('org_id, role')
    .eq('user_id', user.id)
    .single()

  if (!member) {
    return { error: ApiError.notFound('Organisation non trouvée'), user, orgId: null, supabase }
  }

  return {
    error: null,
    user,
    orgId: member.org_id,
    role: member.role,
    supabase
  }
}

// Wrapper for API routes with error handling
export async function withErrorHandling<T = any>(
  handler: () => Promise<NextResponse<T>>
): Promise<NextResponse<any>> {
  try {
    return await handler()
  } catch (error: any) {
    logger.error('API Error', error)
    return ApiError.internal(
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Une erreur est survenue'
    )
  }
}

// Validate required fields
export function validateRequired<T extends Record<string, any>>(
  data: T,
  fields: (keyof T)[]
): { valid: boolean; missing: string[] } {
  const missing = fields.filter(field => !data[field])
  return {
    valid: missing.length === 0,
    missing: missing as string[]
  }
}
