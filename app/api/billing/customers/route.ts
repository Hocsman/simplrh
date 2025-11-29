import { NextRequest } from 'next/server'
import { withErrorHandling, getAuthContext, ApiSuccess, ApiError } from '@/lib/api-utils'
import { logger } from '@/lib/logger'
import { createCustomerSchema } from '@/domains/billing/schemas'

// GET - Récupérer tous les clients de l'organisation
export async function GET() {
  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    const { data: customers, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    if (fetchError) {
      logger.error('Error fetching customers', fetchError)
      return ApiError.internal('Erreur lors de la récupération des clients')
    }

    logger.info(`Found ${customers?.length || 0} customers for org ${orgId}`)
    return ApiSuccess.ok({ customers: customers || [] })
  })
}

// POST - Créer un nouveau client
export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    const body = await request.json()

    // Validate input with Zod
    const validationResult = createCustomerSchema.safeParse(body)
    if (!validationResult.success) {
      logger.warn('Invalid customer data', { errors: validationResult.error.errors })
      return ApiError.badRequest(
        validationResult.error.errors[0]?.message || 'Données invalides'
      )
    }

    const validatedData = validationResult.data

    // Prepare customer data - handle empty strings
    const customerData: any = {
      org_id: orgId,
      name: validatedData.name.trim(),
      email: validatedData.email && validatedData.email.trim().length > 0
        ? validatedData.email.trim()
        : null,
      phone: validatedData.phone || null,
      address: validatedData.address || null,
      siret: validatedData.siret && validatedData.siret.trim().length > 0
        ? validatedData.siret.trim()
        : null,
      vat_number: validatedData.vat_number || null
    }

    logger.debug('Creating customer', { data: customerData })

    // Create customer
    const { data: customer, error: createError } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single()

    if (createError) {
      logger.error('Error creating customer', createError)
      return ApiError.internal('Erreur lors de la création du client')
    }

    logger.success(`Customer created: ${customer.id}`)
    return ApiSuccess.created({ customer })
  })
}
