import { NextRequest } from 'next/server'
import { withErrorHandling, getAuthContext, ApiSuccess, ApiError } from '@/lib/api-utils'
import { logger } from '@/lib/logger'
import { createLeaveRequestSchema } from '@/domains/people/schemas'

// GET - Récupérer toutes les demandes de congés
export async function GET() {
  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    const { data: leaveRequests, error: fetchError } = await supabase
      .from('leave_requests')
      .select(`
        *,
        employee:employees(id, full_name, email)
      `)
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    if (fetchError) {
      logger.error('Error fetching leave requests', fetchError)
      return ApiError.internal('Erreur lors de la récupération des demandes')
    }

    logger.info(`Found ${leaveRequests?.length || 0} leave requests for org ${orgId}`)
    return ApiSuccess.ok({ leaveRequests: leaveRequests || [] })
  })
}

// POST - Créer une nouvelle demande de congé
export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    const body = await request.json()

    // Validate input with Zod
    const validationResult = createLeaveRequestSchema.safeParse(body)
    if (!validationResult.success) {
      logger.warn('Invalid leave request data', { errors: validationResult.error.errors })
      return ApiError.badRequest(
        validationResult.error.errors[0]?.message || 'Données invalides'
      )
    }

    const validatedData = validationResult.data

    // Verify employee belongs to organization
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('id')
      .eq('id', validatedData.employee_id)
      .eq('org_id', orgId)
      .single()

    if (employeeError || !employee) {
      logger.warn('Employee not found or unauthorized', { employee_id: validatedData.employee_id })
      return ApiError.notFound('Employé non trouvé')
    }

    // Calculate number of days
    const start = new Date(validatedData.start_date)
    const end = new Date(validatedData.end_date)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const leaveRequestData = {
      org_id: orgId,
      employee_id: validatedData.employee_id,
      type: validatedData.type,
      start_date: validatedData.start_date,
      end_date: validatedData.end_date,
      days,
      comment: validatedData.comment || null,
      status: 'pending'
    }

    logger.debug('Creating leave request', { data: leaveRequestData })

    const { data: leaveRequest, error: createError } = await supabase
      .from('leave_requests')
      .insert(leaveRequestData)
      .select()
      .single()

    if (createError) {
      logger.error('Error creating leave request', createError)
      return ApiError.internal('Erreur lors de la création de la demande')
    }

    logger.success(`Leave request created: ${leaveRequest.id} (${days} days)`)
    return ApiSuccess.created({ leaveRequest })
  })
}
