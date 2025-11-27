import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Récupérer tous les employés de l'organisation
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: member } = await supabase
      .from('members')
      .select('org_id')
      .eq('user_id', user.id)
      .single()

    if (!member) {
      return NextResponse.json({ error: 'Organisation non trouvée' }, { status: 404 })
    }

    const { data: employees, error } = await supabase
      .from('employees')
      .select('*')
      .eq('org_id', member.org_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching employees:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des employés' }, { status: 500 })
    }

    console.log(`✅ Found ${employees?.length || 0} employees`)
    return NextResponse.json({ employees: employees || [] })
  } catch (error: any) {
    console.error('Error in employees GET:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Créer un nouvel employé
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: member } = await supabase
      .from('members')
      .select('org_id')
      .eq('user_id', user.id)
      .single()

    if (!member) {
      return NextResponse.json({ error: 'Organisation non trouvée' }, { status: 404 })
    }

    const body = await request.json()
    console.log('📝 Creating employee:', body)

    const { full_name, email, position, hire_date, salary, contract_type, status } = body

    if (!full_name) {
      return NextResponse.json({ error: 'Le nom complet est requis' }, { status: 400 })
    }

    const employeeData: any = {
      org_id: member.org_id,
      full_name: full_name.trim(),
      email: email && email.trim().length > 0 ? email.trim() : null,
      position: position && position.trim().length > 0 ? position.trim() : null,
      hire_date: hire_date && hire_date.trim().length > 0 ? hire_date : null,
      salary: salary && salary !== '' ? parseFloat(salary) : null,
      contract_type: contract_type || 'CDI',
      status: status || 'active'
    }

    const { data: employee, error } = await supabase
      .from('employees')
      .insert(employeeData)
      .select()
      .single()

    if (error) {
      console.error('❌ Employee creation error:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de la création de l\'employé',
        details: error.message 
      }, { status: 500 })
    }

    console.log('✅ Employee created:', employee.id)
    return NextResponse.json({ employee }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Error in employees POST:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
