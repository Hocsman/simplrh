import { redirect } from 'next/navigation'
import { requireOrganization } from '@/domains/core/auth'
import { createEmployee as createEmployeeDb } from '@/domains/people/employees'
import { EmployeeFormWrapper } from './employee-form-wrapper'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Nouvel employé | SimplRH',
  description: 'Ajouter un nouvel employé à votre organisation'
}

async function createEmployee(formData: any) {
  'use server'

  const org = await requireOrganization()
  const supabase = await createClient()

  // Get current user to verify authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('Non authentifié')
  }

  try {
    // Call the domain function directly with org context
    const employee = await createEmployeeDb(org.id, formData, user.id)
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
