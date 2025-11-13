import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH - Approuver ou rejeter une demande de congé
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: member } = await supabase
      .from('members')
      .select('org_id, role')
      .eq('user_id', user.id)
      .single()

    if (!member) {
      return NextResponse.json({ error: 'Organisation non trouvée' }, { status: 404 })
    }

    // Only managers and above can approve/reject
    if (!['owner', 'admin', 'manager'].includes(member.role)) {
      return NextResponse.json({ error: 'Permission refusée' }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body
    
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }

    console.log(`📝 Updating leave request ${params.id} to ${status}`)

    const { data: leaveRequest, error } = await supabase
      .from('leave_requests')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('org_id', member.org_id)
      .select()
      .single()

    if (error) {
      console.error('❌ Leave request update error:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de la mise à jour',
        details: error.message 
      }, { status: 500 })
    }

    console.log(`✅ Leave request ${params.id} ${status}`)
    return NextResponse.json({ leaveRequest })
  } catch (error: any) {
    console.error('❌ Error in leave request PATCH:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
