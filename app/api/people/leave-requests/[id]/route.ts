import { NextRequest } from 'next/server'
import { withErrorHandling, getAuthContext, ApiSuccess, ApiError } from '@/lib/api-utils'
import { logger } from '@/lib/logger'
import { updateLeaveRequestStatusSchema } from '@/domains/people/schemas'

// PATCH - Approuver ou rejeter une demande de congé
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandling(async () => {
    const { error, supabase, orgId, role } = await getAuthContext()
    if (error) return error

    // Only managers and above can approve/reject
    if (!role || !['owner', 'admin', 'manager'].includes(role)) {
      logger.warn('Permission denied for leave request approval', { role })
      return ApiError.forbidden('Permission refusée. Seuls les managers peuvent approuver/rejeter les demandes.')
    }

    const body = await request.json()

    // Validate input with Zod
    const validationResult = updateLeaveRequestStatusSchema.safeParse(body)
    if (!validationResult.success) {
      logger.warn('Invalid leave request status data', { errors: validationResult.error.errors })
      return ApiError.badRequest(
        validationResult.error.errors[0]?.message || 'Données invalides'
      )
    }

    const validatedData = validationResult.data

    logger.debug(`Updating leave request ${params.id} to ${validatedData.status}`)

    const updateData: any = {
      status: validatedData.status,
      updated_at: new Date().toISOString()
    }

    if (validatedData.comment) {
      updateData.comment = validatedData.comment
    }

    const { data: leaveRequest, error: updateError } = await supabase
      .from('leave_requests')
      .update(updateData)
      .eq('id', params.id)
      .eq('org_id', orgId)
      .select()
      .single()

    if (updateError || !leaveRequest) {
      logger.error('Error updating leave request', updateError)
      return ApiError.internal('Erreur lors de la mise à jour de la demande')
    }

    logger.success(`Leave request ${params.id} ${validatedData.status}`)
    return ApiSuccess.ok({ leaveRequest })
  })
}
