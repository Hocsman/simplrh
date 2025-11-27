import { redirect } from 'next/navigation'
import { requireOrganization } from '@/domains/core/auth'
import EmployeesPageContent from './employees-content'

export const dynamic = 'force-dynamic'

// Server component wrapper
export default async function EmployeesPage() {
  let org: any = null
  let employees: any[] = []

  try {
    org = await requireOrganization()
  } catch (error: any) {
    // If no organization, redirect to onboarding
    console.error('Organization error:', error)
    redirect('/onboarding')
  }

  // For now, start with empty list to avoid Supabase errors
  // The form will still work via the API endpoint
  employees = []

  return <EmployeesPageContent initialEmployees={employees} />
}
