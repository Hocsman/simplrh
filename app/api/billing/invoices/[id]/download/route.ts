import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, ApiError, withErrorHandling } from '@/lib/api-utils'
import { generateInvoicePDF } from '@/lib/pdf-generator'

// GET - Télécharger le PDF d'une facture
export async function GET(
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
      console.error('Invoice fetch error:', fetchError)
      return ApiError.notFound('Facture non trouvée')
    }

    console.log('Invoice data structure:', {
      id: invoice.id,
      number: invoice.number,
      hasCustomer: !!invoice.customer,
      customerKeys: invoice.customer ? Object.keys(invoice.customer) : [],
      hasItems: !!invoice.items,
      itemsCount: invoice.items?.length || 0,
      invoiceKeys: Object.keys(invoice)
    })

    // Récupérer les infos de l'organisation
    const { data: org, error: orgError } = await supabase
      .from('orgs')
      .select('*')
      .eq('id', orgId)
      .single()

    if (orgError || !org) {
      return ApiError.internal('Informations organisation manquantes')
    }

    // Générer le PDF
    try {
      console.log('Starting PDF generation for invoice:', id)
      const pdfBuffer = await generateInvoicePDF({
        invoice,
        organization: org,
        items: invoice.items || []
      })

      console.log('PDF buffer generated, size:', pdfBuffer?.length, 'bytes')
      if (!pdfBuffer) {
        throw new Error('PDF buffer is empty or null')
      }

      // Retourner le PDF en téléchargement
      const response = new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${invoice.number}.pdf"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      })
      console.log('PDF response created successfully')
      return response
    } catch (error: any) {
      console.error('PDF generation error:', error)
      console.error('Error details:', error.message, error.stack)
      return ApiError.internal(`Erreur lors de la génération du PDF: ${error.message}`)
    }
  })
}
