import { redirect } from 'next/navigation'
import { requireOrganization } from '@/domains/core/auth'
import { getEmployees } from '@/domains/people/employees'
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
    redirect('/onboarding')
  }

  try {
    employees = await getEmployees(org.id)
  } catch (error: any) {
    // If fetching employees fails, just show empty list
    console.error('Failed to fetch employees:', error)
    employees = []
  }

  return <EmployeesPageContent initialEmployees={employees} />
}
