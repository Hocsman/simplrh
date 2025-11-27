import { redirect } from 'next/navigation'
import { requireOrganization } from '@/domains/core/auth'
import { EmployeeForm } from '@/components/employees/EmployeeForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Nouvel employé | SimplRH',
  description: 'Ajouter un nouvel employé à votre organisation'
}

async function createEmployee(formData: any) {
  'use server'

  const org = await requireOrganization()

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/people/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la création')
    }

    const { employee } = await response.json()
    redirect(`/people/employees/${employee.id}`)
  } catch (error: any) {
    throw error
  }
}

export default async function NewEmployeePage() {
  let org: any = null

  try {
    org = await requireOrganization()
  } catch (error: any) {
    // If no organization, redirect to onboarding
    redirect('/onboarding')
  }

  const handleSubmit = async (data: any) => {
    await createEmployee(data)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nouvel employé</h1>
        <p className="text-gray-600 mt-2">Ajouter un nouvel employé à votre organisation</p>
      </div>

      <EmployeeForm onSubmit={handleSubmit} />
    </div>
  )
}
