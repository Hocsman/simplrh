import { requireOrganization } from '@/domains/core/auth'
import { getEmployees } from '@/domains/people/employees'
import EmployeesPageContent from './employees-content'

export const dynamic = 'force-dynamic'

// Server component wrapper
export default async function EmployeesPage() {
  const org = await requireOrganization()
  const employees = await getEmployees(org.id)

  return <EmployeesPageContent initialEmployees={employees} />
}
