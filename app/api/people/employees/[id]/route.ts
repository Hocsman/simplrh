import { NextRequest } from 'next/server'
import { withErrorHandling, getAuthContext, ApiSuccess, ApiError } from '@/lib/api-utils'
import { logger } from '@/lib/logger'
import { updateEmployeeSchema } from '@/domains/people/schemas'

// GET - Récupérer un employé spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .eq('org_id', orgId)
      .single()

    if (fetchError || !employee) {
      logger.warn(`Employee not found: ${id}`, { orgId })
      return ApiError.notFound('Employé non trouvé')
    }

    return ApiSuccess.ok({ employee })
  })
}

// PUT - Mettre à jour un employé
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    const body = await request.json()

    // Validate input with Zod
    const validationResult = updateEmployeeSchema.safeParse(body)
    if (!validationResult.success) {
      logger.warn('Invalid employee update data', { errors: validationResult.error.errors })
      return ApiError.badRequest(
        validationResult.error.errors[0]?.message || 'Données invalides'
      )
    }

    const validatedData = validationResult.data

    // Build update object (only include provided fields)
    const updateData: any = {}

    if (validatedData.full_name !== undefined) updateData.full_name = validatedData.full_name
    if (validatedData.email !== undefined) updateData.email = validatedData.email || null
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone || null
    if (validatedData.position !== undefined) updateData.position = validatedData.position || null
    if (validatedData.department !== undefined) updateData.department = validatedData.department || null
    if (validatedData.hire_date !== undefined) updateData.hire_date = validatedData.hire_date || null
    if (validatedData.salary !== undefined) updateData.salary = validatedData.salary || null
    if (validatedData.status !== undefined) updateData.status = validatedData.status

    logger.debug(`Updating employee ${id}`, { data: updateData })

    const { data: employee, error: updateError } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', id)
      .eq('org_id', orgId)
      .select()
      .single()

    if (updateError) {
      logger.error('Error updating employee', updateError)
      return ApiError.internal('Erreur lors de la mise à jour')
    }

    logger.success(`Employee updated: ${id}`)
    return ApiSuccess.ok({ employee })
  })
}

// DELETE - Supprimer un employé
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    // Verify employee exists and belongs to organization
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('id')
      .eq('id', id)
      .eq('org_id', orgId)
      .single()

    if (fetchError || !employee) {
      logger.warn(`Employee not found for deletion: ${id}`, { orgId })
      return ApiError.notFound('Employé non trouvé')
    }

    const { error: deleteError } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)
      .eq('org_id', orgId)

    if (deleteError) {
      logger.error('Error deleting employee', deleteError)
      return ApiError.internal('Erreur lors de la suppression')
    }

    logger.success(`Employee deleted: ${id}`)
    return ApiSuccess.ok({ message: 'Employé supprimé avec succès' })
  })
}
