'use client'

import { useState } from 'react'
import { EmployeeForm } from '@/components/employees/EmployeeForm'
import { AlertTriangle } from 'lucide-react'

interface EmployeeFormWrapperProps {
  onSubmit: (data: any) => Promise<void>
}

export function EmployeeFormWrapper({ onSubmit }: EmployeeFormWrapperProps) {
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: any) => {
    try {
      setError(null)
      await onSubmit(data)
    } catch (err: any) {
      const message = err?.message || 'Une erreur est survenue lors de la création de l\'employé'
      setError(message)
      console.error('Employee creation error:', err)
      throw new Error(message)
    }
  }

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Erreur lors de la création</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
      <EmployeeForm onSubmit={handleSubmit} />
    </>
  )
}
