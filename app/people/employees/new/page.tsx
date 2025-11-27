import { redirect } from 'next/navigation'
import { requireOrganization } from '@/domains/core/auth'
import { EmployeeFormWrapper } from './employee-form-wrapper'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Nouvel employé | SimplRH',
  description: 'Ajouter un nouvel employé à votre organisation'
}

async function createEmployee(formData: any) {
  'use server'

  try {
    // Ensure user is authenticated by checking organization
    await requireOrganization()

    // Call the API endpoint to create the employee
    // This uses the authenticated session and respects RLS policies
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/people/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la création de l\'employé')
    }

    const { employee } = await response.json()
    redirect(`/people/employees/${employee.id}`)
  } catch (error: any) {
    console.error('Error creating employee:', error)
    throw new Error(error?.message || 'Erreur lors de la création de l\'employé')
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nouvel employé</h1>
        <p className="text-gray-600 mt-2">Ajouter un nouvel employé à votre organisation</p>
      </div>

      <EmployeeFormWrapper onSubmit={createEmployee} />
    </div>
  )
}
