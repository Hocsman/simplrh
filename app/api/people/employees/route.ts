import { NextRequest } from 'next/server'
import { withErrorHandling, getAuthContext, ApiSuccess, ApiError } from '@/lib/api-utils'
import { logger } from '@/lib/logger'
import { createEmployeeSchema } from '@/domains/people/schemas'

// GET - Récupérer tous les employés de l'organisation
export async function GET() {
  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    const { data: employees, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    if (fetchError) {
      logger.error('Error fetching employees', fetchError)
      return ApiError.internal('Erreur lors de la récupération des employés')
    }

    logger.info(`Found ${employees?.length || 0} employees for org ${orgId}`)
    return ApiSuccess.ok({ employees: employees || [] })
  })
}

// POST - Créer un nouvel employé
export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    const body = await request.json()

    // Validate input with Zod
    const validationResult = createEmployeeSchema.safeParse(body)
    if (!validationResult.success) {
      logger.warn('Invalid employee data', { errors: validationResult.error.errors })
      return ApiError.badRequest(
        validationResult.error.errors[0]?.message || 'Données invalides'
      )
    }

    const validatedData = validationResult.data

    // Prepare employee data
    const employeeData = {
      org_id: orgId,
      full_name: validatedData.full_name.trim(),
      email: validatedData.email && validatedData.email.trim().length > 0
        ? validatedData.email.trim()
        : null,
      phone: validatedData.phone || null,
      position: validatedData.position || null,
      department: validatedData.department || null,
      hire_date: validatedData.hire_date || null,
      salary: validatedData.salary || null,
      status: validatedData.status
    }

    logger.debug('Creating employee', { data: employeeData })

    // Create employee
    const { data: employee, error: createError } = await supabase
      .from('employees')
      .insert(employeeData)
      .select()
      .single()

    if (createError) {
      logger.error('Error creating employee', createError)
      return ApiError.internal('Erreur lors de la création de l\'employé')
    }

    logger.success(`Employee created: ${employee.id}`)
    return ApiSuccess.created({ employee })
  })
}
