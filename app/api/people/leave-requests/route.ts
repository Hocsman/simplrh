import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Récupérer toutes les demandes de congés
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

    const { data: leaveRequests, error } = await supabase
      .from('leave_requests')
      .select(`
        *,
        employee:employees(id, full_name, email)
      `)
      .eq('org_id', member.org_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching leave requests:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des demandes' }, { status: 500 })
    }

    console.log(`✅ Found ${leaveRequests?.length || 0} leave requests`)
    return NextResponse.json({ leaveRequests: leaveRequests || [] })
  } catch (error: any) {
    console.error('Error in leave requests GET:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Créer une nouvelle demande de congé
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
    console.log('📝 Creating leave request:', body)
    
    const { employee_id, type, start_date, end_date, comment } = body
    
    if (!employee_id || !type || !start_date || !end_date) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    // Calculate number of days
    const start = new Date(start_date)
    const end = new Date(end_date)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const leaveRequestData = {
      org_id: member.org_id,
      employee_id,
      type,
      start_date,
      end_date,
      days,
      comment: comment || null,
      status: 'pending'
    }

    const { data: leaveRequest, error } = await supabase
      .from('leave_requests')
      .insert(leaveRequestData)
      .select()
      .single()

    if (error) {
      console.error('❌ Leave request creation error:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de la création de la demande',
        details: error.message 
      }, { status: 500 })
    }

    console.log('✅ Leave request created:', leaveRequest.id)
    return NextResponse.json({ leaveRequest }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Error in leave requests POST:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
