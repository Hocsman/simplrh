import { NextRequest } from 'next/server'
import { getAuthContext, ApiError, ApiSuccess, withErrorHandling } from '@/lib/api-utils'

// GET - Récupérer une facture spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(id, name, email, siret, address),
        items:invoice_items(*)
      `)
      .eq('id', id)
      .eq('org_id', orgId)
      .single()

    if (fetchError) {
      console.error('Error fetching invoice:', fetchError)
      return ApiError.notFound('Facture non trouvée')
    }

    return ApiSuccess.ok({ invoice })
  })
}

// PUT - Mettre à jour une facture
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    const body = await request.json()
    const { due_date, items, ...updateData } = body

    // Vérifier que la facture appartient à l'organisation
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select('id, status')
      .eq('id', id)
      .eq('org_id', orgId)
      .single()

    if (fetchError || !invoice) {
      return ApiError.notFound('Facture non trouvée')
    }

    // Les factures payées ou envoyées ne peuvent pas être modifiées
    if (['sent', 'paid', 'overdue'].includes(invoice.status)) {
      return ApiError.badRequest('Les factures envoyées ou payées ne peuvent pas être modifiées')
    }

    // Calculer les nouveaux totaux si les items sont modifiés
    let updatePayload = updateData
    if (items && items.length > 0) {
      const totalHT = items.reduce((sum: number, item: any) =>
        sum + (item.qty * item.unit_price), 0)
      const totalVAT = items.reduce((sum: number, item: any) =>
        sum + (item.qty * item.unit_price * (item.vat_rate || 20) / 100), 0)
      const totalTTC = totalHT + totalVAT

      updatePayload = {
        ...updatePayload,
        total_ht: totalHT,
        vat: totalVAT,
        total_ttc: totalTTC,
        due_date: due_date || updateData.due_date
      }

      // Supprimer les anciens items
      await supabase
        .from('invoice_items')
        .delete()
        .eq('invoice_id', id)

      // Créer les nouveaux items
      const invoiceItems = items.map((item: any) => ({
        invoice_id: id,
        label: item.label,
        qty: item.qty,
        unit_price: item.unit_price,
        vat_rate: item.vat_rate || 20,
      }))

      await supabase
        .from('invoice_items')
        .insert(invoiceItems)
    } else if (due_date) {
      updatePayload.due_date = due_date
    }

    const { data: updatedInvoice, error: updateError } = await supabase
      .from('invoices')
      .update(updatePayload)
      .eq('id', id)
      .eq('org_id', orgId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating invoice:', updateError)
      return ApiError.internal('Erreur lors de la mise à jour de la facture')
    }

    return ApiSuccess.ok({
      invoice: updatedInvoice,
      message: 'Facture mise à jour avec succès'
    })
  })
}

// DELETE - Supprimer une facture
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    // Vérifier que la facture appartient à l'organisation
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select('id, status')
      .eq('id', id)
      .eq('org_id', orgId)
      .single()

    if (fetchError || !invoice) {
      return ApiError.notFound('Facture non trouvée')
    }

    // Les factures payées ne peuvent pas être supprimées
    if (invoice.status === 'paid') {
      return ApiError.badRequest('Les factures payées ne peuvent pas être supprimées')
    }

    // Supprimer les items associés
    await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', id)

    // Supprimer la facture
    const { error: deleteError } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('org_id', orgId)

    if (deleteError) {
      console.error('Error deleting invoice:', deleteError)
      return ApiError.internal('Erreur lors de la suppression de la facture')
    }

    return ApiSuccess.ok({ message: 'Facture supprimée avec succès' })
  })
}
