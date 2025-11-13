import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Récupérer tous les clients de l'organisation
export async function GET(req: NextRequest) {
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

    // Get customers for this organization
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .eq('org_id', member.org_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching customers:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des clients' }, { status: 500 })
    }

    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Error in customers API:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouveau client
export async function POST(req: NextRequest) {
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

    // Parse request body
    const body = await req.json()
    console.log('📝 Customer data received:', body)
    
    const { name, email, phone, address, siret, vat_number } = body

    // Validate required fields
    if (!name || name.trim().length === 0) {
      console.error('❌ Name is required')
      return NextResponse.json({ error: 'Le nom du client est requis' }, { status: 400 })
    }

    // Prepare customer data - handle empty strings
    const customerData: any = {
      org_id: member.org_id,
      name: name.trim(),
      email: email && email.trim().length > 0 ? email.trim() : null,
      phone: phone && phone.trim().length > 0 ? phone.trim() : null,
      siret: siret && siret.trim().length > 0 ? siret.trim() : null,
      vat_number: vat_number && vat_number.trim().length > 0 ? vat_number.trim() : null
    }
    
    // Handle address - can be string or JSON
    if (address && address.trim().length > 0) {
      customerData.address = address.trim()
    }

    console.log('💾 Inserting customer:', customerData)

    // Create customer
    const { data: customer, error } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating customer:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de la création du client',
        details: error.message 
      }, { status: 500 })
    }

    console.log('✅ Customer created:', customer.id)
    return NextResponse.json({ customer }, { status: 201 })
  } catch (error) {
    console.error('Error in customers API:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

