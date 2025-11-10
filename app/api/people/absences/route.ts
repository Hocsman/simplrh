import { NextRequest, NextResponse } from 'next/server'
import { requireOrganization } from '@/domains/core/auth'
import { getAbsences, createAbsence, createAbsenceSchema } from '@/domains/people/absences'

export async function GET(request: NextRequest) {
  try {
    const org = await requireOrganization()
    const { searchParams } = new URL(request.url)
    
    const startDate = searchParams.get('start_date') || undefined
    const endDate = searchParams.get('end_date') || undefined
    
    const absences = await getAbsences(org.id, startDate, endDate)
    
    return NextResponse.json(absences)
  } catch (error: any) {
    console.error('Error fetching absences:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch absences' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const org = await requireOrganization()
    const body = await request.json()
    
    const data = createAbsenceSchema.parse(body)
    const absence = await createAbsence(org.id, data)
    
    return NextResponse.json(absence)
  } catch (error: any) {
    console.error('Error creating absence:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create absence' },
      { status: 400 }
    )
  }
}





