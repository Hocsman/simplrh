import { redirect } from 'next/navigation'
import { requireOrganization } from '@/domains/core/auth'
import { createEmployee as createEmployeeDb } from '@/domains/people/employees'
import { EmployeeFormWrapper } from './employee-form-wrapper'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Nouvel employé | SimplRH',
  description: 'Ajouter un nouvel employé à votre organisation'
}

async function createEmployee(formData: any) {
  'use server'

  try {
    const org = await requireOrganization()

    // Call the domain function to create the employee
    // Uses service role key so it can insert without RLS restrictions
    const employee = await createEmployeeDb(org.id, formData)
    redirect(`/people/employees/${employee.id}`)
  } catch (error: any) {
    console.error('Error creating employee:', error)
    throw new Error(error?.message || 'Erreur lors de la création de l\'employé')
  }
}

export default async function NewEmployeePage() {
  // Check organization on render - will throw if not authenticated
  await requireOrganization()

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
