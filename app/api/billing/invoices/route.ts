import { NextRequest } from 'next/server'
import { getAuthContext, ApiError, ApiSuccess, withErrorHandling, validateRequired } from '@/lib/api-utils'

// GET - Récupérer toutes les factures de l'organisation
export async function GET() {
  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    const { data: invoices, error: fetchError } = await supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(id, name, email)
      `)
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching invoices:', fetchError)
      return ApiError.internal('Erreur lors de la récupération des factures')
    }

    console.log(`✅ Found ${invoices?.length || 0} invoices`)
    return ApiSuccess.ok({ invoices: invoices || [] })
  })
}

// POST - Créer une nouvelle facture
export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    const body = await request.json()
    console.log('📝 Creating invoice with data:', body)

    const { customer_id, due_date, items } = body

    // Validate required fields
    if (!customer_id || !items || items.length === 0) {
      return ApiError.badRequest('customer_id et items sont requis')
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
      .eq('org_id', orgId)

    const invoiceNumber = `FAC-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(4, '0')}`

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        org_id: orgId,
        customer_id,
        number: invoiceNumber,
        due_date: due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        total_ht: totalHT,
        vat: totalVAT,
        total_ttc: totalTTC,
        status: 'draft'
      })
      .select()
      .single()

    if (invoiceError) {
      console.error('❌ Invoice creation error:', invoiceError)
      return ApiError.internal('Erreur lors de la création de la facture')
    }

    console.log('✅ Invoice created:', invoice.id)

    // Create invoice items
    const invoiceItems = items.map((item: any) => ({
      invoice_id: invoice.id,
      label: item.label,
      qty: item.qty,
      unit_price: item.unit_price,
      vat_rate: item.vat_rate,
    }))

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems)

    if (itemsError) {
      console.error('❌ Items creation error:', itemsError)
      return ApiError.internal('Erreur lors de la création des items')
    }

    console.log('✅ Invoice items created')

    return ApiSuccess.created({
      invoice,
      number: invoiceNumber,
      message: 'Facture créée avec succès'
    })
  })
}