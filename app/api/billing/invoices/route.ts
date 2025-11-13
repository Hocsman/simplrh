import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Récupérer toutes les factures de l'organisation
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Get user's organization
    const { data: member } = await supabase
      .from('members')
      .select('org_id')
      .eq('user_id', user.id)
      .single()

    if (!member) {
      return NextResponse.json({ error: 'Organisation non trouvée' }, { status: 404 })
    }

    // Get invoices for this organization with customer info
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(id, name, email)
      `)
      .eq('org_id', member.org_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching invoices:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des factures' }, { status: 500 })
    }

    console.log(`✅ Found ${invoices?.length || 0} invoices`)
    return NextResponse.json({ invoices: invoices || [] })
  } catch (error: any) {
    console.error('Error in invoices GET:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Créer une nouvelle facture
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Get user's organization
    const { data: member } = await supabase
      .from('members')
      .select('org_id')
      .eq('user_id', user.id)
      .single()

    if (!member) {
      return NextResponse.json({ error: 'Organisation non trouvée' }, { status: 404 })
    }

    const body = await request.json()
    console.log('📝 Creating invoice with data:', body)
    
    const { customer_id, due_date, items } = body
    
    // Validate
    if (!customer_id || !items || items.length === 0) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    // Calculate totals
    const totalHT = items.reduce((sum: number, item: any) => 
      sum + (item.qty * item.unit_price), 0)
    const totalVAT = items.reduce((sum: number, item: any) => 
      sum + (item.qty * item.unit_price * item.vat_rate / 100), 0)
    const totalTTC = totalHT + totalVAT

    // Generate invoice number
    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', member.org_id)
    
    const invoiceNumber = `FAC-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(4, '0')}`

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        org_id: member.org_id,
        customer_id,
        number: invoiceNumber,
        due_date: due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        total_ht: totalHT,
        total_vat: totalVAT,
        total_ttc: totalTTC,
        status: 'draft'
      })
      .select()
      .single()

    if (invoiceError) {
      console.error('❌ Invoice creation error:', invoiceError)
      return NextResponse.json({ error: 'Erreur lors de la création de la facture' }, { status: 500 })
    }

    console.log('✅ Invoice created:', invoice.id)

    // Create invoice items
    const invoiceItems = items.map((item: any) => ({
      invoice_id: invoice.id,
      label: item.label,
      qty: item.qty,
      unit_price: item.unit_price,
      vat_rate: item.vat_rate,
      total_ht: item.qty * item.unit_price,
      total_vat: item.qty * item.unit_price * item.vat_rate / 100
    }))

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems)

    if (itemsError) {
      console.error('❌ Items creation error:', itemsError)
    } else {
      console.log('✅ Invoice items created')
    }

    return NextResponse.json({ 
      invoice,
      number: invoiceNumber,
      message: 'Facture créée avec succès'
    }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Invoice creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la facture' },
      { status: 500 }
    )
  }
}