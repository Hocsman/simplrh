import { NextRequest } from 'next/server'
import { getAuthContext, ApiError, ApiSuccess, withErrorHandling } from '@/lib/api-utils'
import { sendInvoiceEmail } from '@/lib/email-service'
import { generateInvoicePDF } from '@/lib/pdf-generator'

// POST - Envoyer une facture par email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  return withErrorHandling(async () => {
    const { error, supabase, orgId } = await getAuthContext()
    if (error) return error

    // Récupérer la facture complète
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

    if (fetchError || !invoice) {
      return ApiError.notFound('Facture non trouvée')
    }

    if (!invoice.customer?.email) {
      return ApiError.badRequest('Le client n\'a pas d\'adresse email')
    }

    // Récupérer les infos de l'organisation
    const { data: org, error: orgError } = await supabase
      .from('orgs')
      .select('*')
      .eq('id', orgId)
      .single()

    if (orgError || !org) {
      return ApiError.internal('Informations organisation manquantes')
    }

    try {
      // Générer le PDF
      const pdfBuffer = await generateInvoicePDF({
        invoice,
        organization: org,
        items: invoice.items || []
      })

      // Envoyer l'email
      await sendInvoiceEmail({
        to: invoice.customer.email,
        invoiceNumber: invoice.number,
        customerName: invoice.customer.name,
        totalTTC: invoice.total_ttc,
        dueDate: invoice.due_date,
        pdfBuffer,
        organizationName: org.name,
        organizationEmail: org.email || 'contact@simplrh.com'
      })

      // Marquer la facture comme envoyée
      const { error: updateError } = await supabase
        .from('invoices')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('org_id', orgId)

      if (updateError) {
        console.error('Error updating invoice status:', updateError)
        return ApiError.internal('Erreur lors de la mise à jour du statut')
      }

      return ApiSuccess.ok({
        message: 'Facture envoyée avec succès',
        invoice: { id, status: 'sent' }
      })
    } catch (error: any) {
      console.error('Error sending invoice:', error)
      return ApiError.internal(`Erreur lors de l'envoi: ${error.message}`)
    }
  })
}
