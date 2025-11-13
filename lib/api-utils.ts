import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Standardized error responses
export const ApiError = {
  unauthorized: (message = 'Non authentifié') =>
    NextResponse.json({ error: message }, { status: 401 }),

  forbidden: (message = 'Accès interdit') =>
    NextResponse.json({ error: message }, { status: 403 }),

  notFound: (message = 'Ressource non trouvée') =>
    NextResponse.json({ error: message }, { status: 404 }),

  badRequest: (message = 'Requête invalide') =>
    NextResponse.json({ error: message }, { status: 400 }),

  internal: (message = 'Erreur interne du serveur') =>
    NextResponse.json({ error: message }, { status: 500 }),

  conflict: (message = 'Conflit') =>
    NextResponse.json({ error: message }, { status: 409 }),
}

// Success responses
export const ApiSuccess = {
  ok: <T>(data: T, status = 200) =>
    NextResponse.json(data, { status }),

  created: <T>(data: T) =>
    NextResponse.json(data, { status: 201 }),

  noContent: () =>
    new NextResponse(null, { status: 204 }),
}

// Get authenticated user and organization
export async function getAuthContext() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: ApiError.unauthorized(), user: null, orgId: null }
  }

  const { data: member } = await supabase
    .from('members')
    .select('org_id, role')
    .eq('user_id', user.id)
    .single()

  if (!member) {
    return { error: ApiError.notFound('Organisation non trouvée'), user, orgId: null }
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
    console.error('API Error:', error)
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
