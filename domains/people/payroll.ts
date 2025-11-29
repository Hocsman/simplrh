import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { format as formatDate, startOfMonth, endOfMonth } from 'date-fns'
import { fr } from 'date-fns/locale'
import { logAuditEvent } from '../core/audit'

export interface PayrollExport {
  id: string
  org_id: string
  period: string
  format: 'SilaeCSV' | 'PayFitCSV'
  file_path?: string
  created_at: string
}

export interface PayrollData {
  employee_id: string
  full_name: string
  email?: string
  hire_date?: string
  absences: Array<{
    date: string
    type: string
    source: string
  }>
}

export async function generatePayrollExport(
  orgId: string,
  period: string,
  format: 'SilaeCSV' | 'PayFitCSV',
  actorId?: string
): Promise<{ export: PayrollExport; csvContent: string }> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // Parse period (YYYY-MM format)
  const [year, month] = period.split('-').map(Number)
  const periodStart = startOfMonth(new Date(year, month - 1))
  const periodEnd = endOfMonth(new Date(year, month - 1))

  // Get employees and their absences for the period
  const { data: employees, error: employeesError } = await supabase
    .from('employees')
    .select(`
      id,
      full_name,
      email,
      hire_date,
      absences!inner(
        date,
        type,
        source
      )
    `)
    .eq('org_id', orgId)
    .gte('absences.date', formatDate(periodStart, 'yyyy-MM-dd'))
    .lte('absences.date', formatDate(periodEnd, 'yyyy-MM-dd'))

  if (employeesError) throw employeesError

  // Generate CSV content based on format
  let csvContent: string

  if (format === 'SilaeCSV') {
    csvContent = generateSilaeCSV(employees as any[])
  } else {
    csvContent = generatePayFitCSV(employees as any[])
  }

  // Save export record
  const { data: exportRecord, error: exportError } = await supabase
    .from('payroll_exports')
    .insert({
      org_id: orgId,
      period,
      format,
      // file_path will be set after upload to storage
    })
    .select()
    .single()

  if (exportError) throw exportError

  // Log audit
  await logAuditEvent(orgId, 'payroll_export.generated', {
    actorId,
    targetTable: 'payroll_exports',
    targetId: exportRecord.id,
    metadata: { period, format }
  })

  return {
    export: exportRecord as PayrollExport,
    csvContent
  }
}

export async function updatePayrollExportFilePath(
  exportId: string,
  filePath: string
): Promise<void> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { error } = await supabase
    .from('payroll_exports')
    .update({ file_path: filePath })
    .eq('id', exportId)

  if (error) throw error
}

function generateSilaeCSV(employees: any[]): string {
  const headers = [
    'Matricule',
    'Nom',
    'Prénom', 
    'Email',
    'Date embauche',
    'Date absence',
    'Type absence',
    'Motif'
  ]

  const rows = [headers.join(';')]

  employees.forEach(employee => {
    const [lastName, firstName] = employee.full_name.split(' ', 2)
    
    if (employee.absences && employee.absences.length > 0) {
      employee.absences.forEach((absence: any) => {
        rows.push([
          employee.id.substring(0, 8), // Matricule simplifié
          lastName || '',
          firstName || '',
          employee.email || '',
          employee.hire_date || '',
          absence.date,
          absence.type,
          absence.source
        ].join(';'))
      })
    } else {
      // Ligne pour l'employé même sans absence
      rows.push([
        employee.id.substring(0, 8),
        lastName || '',
        firstName || '',
        employee.email || '',
        employee.hire_date || '',
        '',
        '',
        ''
      ].join(';'))
    }
  })

  return rows.join('\n')
}

function generatePayFitCSV(employees: any[]): string {
  const headers = [
    'employee_id',
    'full_name',
    'email',
    'hire_date',
    'absence_date',
    'absence_type',
    'absence_duration'
  ]

  const rows = [headers.join(',')]

  employees.forEach(employee => {
    if (employee.absences && employee.absences.length > 0) {
      employee.absences.forEach((absence: any) => {
        rows.push([
          `"${employee.id}"`,
          `"${employee.full_name}"`,
          `"${employee.email || ''}"`,
          `"${employee.hire_date || ''}"`,
          `"${absence.date}"`,
          `"${absence.type}"`,
          '"1"' // Durée en jours, ici simplifié à 1
        ].join(','))
      })
    } else {
      rows.push([
        `"${employee.id}"`,
        `"${employee.full_name}"`,
        `"${employee.email || ''}"`,
        `"${employee.hire_date || ''}"`,
        '""',
        '""',
        '""'
      ].join(','))
    }
  })

  return rows.join('\n')
}

export async function getPayrollExports(orgId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data, error } = await supabase
    .from('payroll_exports')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as PayrollExport[]
}
