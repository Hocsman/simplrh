import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Récupérer tous les paiements
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

    // Get payments via invoices (payments n'a pas de org_id direct)
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        *,
        invoice:invoices(id, number, total_ttc, org_id)
      `)
      .order('created_at', { ascending: false })
    
    // Filter by org_id on the client side
    const filteredPayments = payments?.filter(p => p.invoice?.org_id === member.org_id) || []

    if (error) {
      console.error('Error fetching payments:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des paiements' }, { status: 500 })
    }

    console.log(`✅ Found ${filteredPayments.length} payments`)
    return NextResponse.json({ payments: filteredPayments })
  } catch (error: any) {
    console.error('Error in payments GET:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Enregistrer un nouveau paiement
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
    console.log('📝 Creating payment:', body)
    
    const { invoice_id, amount, payment_method, payment_date, reference } = body
    
    if (!invoice_id || !amount) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    // payments table n'a pas de org_id, seulement invoice_id
    const paymentData = {
      invoice_id,
      amount,
      method: payment_method || 'bank_transfer',
      paid_at: payment_date ? new Date(payment_date).toISOString() : new Date().toISOString()
    }

    const { data: payment, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()

    if (error) {
      console.error('❌ Payment creation error:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de l\'enregistrement du paiement',
        details: error.message 
      }, { status: 500 })
    }

    // Update invoice status to 'paid' if fully paid
    const { data: invoice } = await supabase
      .from('invoices')
      .select('total_ttc')
      .eq('id', invoice_id)
      .single()

    if (invoice && amount >= invoice.total_ttc) {
      await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', invoice_id)
      
      console.log('✅ Invoice marked as paid')
    }

    console.log('✅ Payment created:', payment.id)
    return NextResponse.json({ payment }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Error in payments POST:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
