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
      return ApiError.notFound('Facture non trouvée')
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

    // Générer le PDF
    try {
      const pdfBuffer = await generateInvoicePDF({
        invoice,
        organization: org,
        items: invoice.items || []
      })

      // Retourner le PDF en téléchargement
      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${invoice.number}.pdf"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      })
    } catch (error: any) {
      console.error('PDF generation error:', error)
      return ApiError.internal('Erreur lors de la génération du PDF')
    }
  })
}
