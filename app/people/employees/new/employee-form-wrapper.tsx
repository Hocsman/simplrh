'use client'

import { EmployeeForm } from '@/components/employees/EmployeeForm'

interface EmployeeFormWrapperProps {
  onSubmit: (data: any) => Promise<void>
}

export function EmployeeFormWrapper({ onSubmit }: EmployeeFormWrapperProps) {
  return <EmployeeForm onSubmit={onSubmit} />
}
