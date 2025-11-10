import { NextRequest, NextResponse } from 'next/server'
import { requireOrganization } from '@/domains/core/auth'
import { getEmployees, createEmployee, createEmployeeSchema } from '@/domains/people/employees'

export async function GET() {
  try {
    const org = await requireOrganization()
    const employees = await getEmployees(org.id)
    
    return NextResponse.json(employees)
  } catch (error: any) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch employees' },
      { status: 400 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const org = await requireOrganization()
    const body = await request.json()
    
    const data = createEmployeeSchema.parse(body)
    const employee = await createEmployee(org.id, data)
    
    return NextResponse.json(employee)
  } catch (error: any) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create employee' },
      { status: 400 }
    )
  }
}





