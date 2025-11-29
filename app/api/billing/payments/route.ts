import { NextRequest } from 'next/server'
import { withErrorHandling, getAuthContext, ApiSuccess, ApiError } from '@/lib/api-utils'
import { logger } from '@/lib/logger'
import { createPaymentSchema } from '@/domains/billing/schemas'

// GET - Récupérer tous les paiements
export async function GET() {
  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    // Optimized query: filter on server-side with inner join
    const { data: payments, error: fetchError } = await supabase
      .from('payments')
      .select(`
        *,
        invoice:invoices!inner(id, number, total_ttc, org_id)
      `)
      .eq('invoice.org_id', orgId)
      .order('created_at', { ascending: false })

    if (fetchError) {
      logger.error('Error fetching payments', fetchError)
      return ApiError.internal('Erreur lors de la récupération des paiements')
    }

    logger.info(`Found ${payments?.length || 0} payments for org ${orgId}`)
    return ApiSuccess.ok({ payments: payments || [] })
  })
}

// POST - Enregistrer un nouveau paiement
export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    const body = await request.json()

    // Validate input with Zod
    const validationResult = createPaymentSchema.safeParse(body)
    if (!validationResult.success) {
      logger.warn('Invalid payment data', { errors: validationResult.error.errors })
      return ApiError.badRequest(
        validationResult.error.errors[0]?.message || 'Données invalides'
      )
    }

    const validatedData = validationResult.data

    // Verify invoice belongs to organization
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('id, total_ttc, org_id')
      .eq('id', validatedData.invoice_id)
      .eq('org_id', orgId)
      .single()

    if (invoiceError || !invoice) {
      logger.warn('Invoice not found or unauthorized', { invoice_id: validatedData.invoice_id })
      return ApiError.notFound('Facture non trouvée')
    }

    // Prepare payment data
    const paymentData = {
      invoice_id: validatedData.invoice_id,
      amount: validatedData.amount,
      method: validatedData.method,
      reference: validatedData.reference || null,
      paid_at: new Date().toISOString()
    }

    logger.debug('Creating payment', { data: paymentData })

    // Create payment
    const { data: payment, error: createError } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()

    if (createError) {
      logger.error('Error creating payment', createError)
      return ApiError.internal('Erreur lors de l\'enregistrement du paiement')
    }

    // Update invoice status to 'paid' if fully paid
    if (validatedData.amount >= invoice.total_ttc) {
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', validatedData.invoice_id)

      if (updateError) {
        logger.warn('Failed to update invoice status', updateError)
      } else {
        logger.info(`Invoice ${validatedData.invoice_id} marked as paid`)
      }
    }

    logger.success(`Payment created: ${payment.id}`)
    return ApiSuccess.created({ payment })
  })
}
