import { redirect } from 'next/navigation'
import { requireOrganization } from '@/domains/core/auth'
import { getEmployee } from '@/domains/people/employees'
import { EmployeeForm } from '@/components/employees/EmployeeForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface EditEmployeePageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Modifier employé | SimplRH'
}

async function updateEmployee(employeeId: string, formData: any) {
  'use server'

  const org = await requireOrganization()

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/people/employees/${employeeId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la mise à jour')
    }

    redirect(`/people/employees/${employeeId}`)
  } catch (error: any) {
    throw error
  }
}

export default async function EditEmployeePage({
  params
}: EditEmployeePageProps) {
  const { id } = await params
  const org = await requireOrganization()

  let employee
  try {
    employee = await getEmployee(id, org.id)
  } catch (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Employé non trouvé</h2>
        <Link href="/people/employees">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (data: any) => {
    await updateEmployee(id, data)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/people/employees/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modifier l'employé</h1>
          <p className="text-gray-600 mt-2">{employee.full_name}</p>
        </div>
      </div>

      <EmployeeForm initialData={employee} onSubmit={handleSubmit} />
    </div>
  )
}
