import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateEmployeeSchema } from '@/domains/people/employees'

// GET - Récupérer un employé spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .eq('org_id', member.org_id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Employé non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ employee })
  } catch (error: any) {
    console.error('Error in employee GET:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour un employé
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Validate using updateEmployeeSchema
    const validation = updateEmployeeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.error.errors },
        { status: 400 }
      )
    }

    const updateData: any = {}

    // Only include fields that were provided
    if (validation.data.full_name !== undefined) updateData.full_name = validation.data.full_name
    if (validation.data.email !== undefined) updateData.email = validation.data.email || null
    if (validation.data.position !== undefined) updateData.position = validation.data.position || null
    if (validation.data.hire_date !== undefined) updateData.hire_date = validation.data.hire_date || null
    if (validation.data.salary !== undefined) updateData.salary = validation.data.salary || null
    if (validation.data.contract_type !== undefined) updateData.contract_type = validation.data.contract_type
    if (validation.data.status !== undefined) updateData.status = validation.data.status

    const { data: employee, error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', id)
      .eq('org_id', member.org_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating employee:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ employee })
  } catch (error: any) {
    console.error('Error in employee PUT:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Supprimer un employé
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // First verify the employee belongs to this org
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('id')
      .eq('id', id)
      .eq('org_id', member.org_id)
      .single()

    if (fetchError || !employee) {
      return NextResponse.json({ error: 'Employé non trouvé' }, { status: 404 })
    }

    const { error: deleteError } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)
      .eq('org_id', member.org_id)

    if (deleteError) {
      console.error('Error deleting employee:', deleteError)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression', details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Employé supprimé avec succès' })
  } catch (error: any) {
    console.error('Error in employee DELETE:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
