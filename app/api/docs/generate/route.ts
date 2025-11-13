import { NextRequest } from 'next/server'
import { getAuthContext, ApiError, ApiSuccess, withErrorHandling } from '@/lib/api-utils'
import {
  generateContratPrestation,
  generateCGVEcommerce,
  generateMiseEnDemeure
} from '@/lib/document-templates'
import { createDocumentRequest, updateDocumentRequestStatus } from '@/domains/docs/templates'
import { uploadDocument } from '@/lib/storage'

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const { error, orgId, user } = await getAuthContext()
    if (error) return error

    const body = await request.json()
    const { template_key, payload } = body

    if (!template_key || !payload) {
      return ApiError.badRequest('template_key et payload sont requis')
    }

    console.log('📄 Generating document:', { template_key, orgId })

    // Create document request in database
    const docRequest = await createDocumentRequest(
      orgId,
      { template_key, payload },
      user.id
    )

    // Generate PDF based on template
    let pdfBuffer: Buffer
    let documentTitle: string

    try {
      switch (template_key) {
        case 'contrat-prestation':
          pdfBuffer = await generateContratPrestation(payload)
          documentTitle = 'Contrat_Prestation'
          break

        case 'cgv-ecommerce':
          pdfBuffer = await generateCGVEcommerce(payload)
          documentTitle = 'CGV_Ecommerce'
          break

        case 'mise-en-demeure':
          pdfBuffer = await generateMiseEnDemeure(payload)
          documentTitle = 'Mise_En_Demeure'
          break

        default:
          return ApiError.badRequest(`Template inconnu : ${template_key}`)
      }

      // Upload PDF to storage
      const timestamp = Date.now()
      const fileName = `${documentTitle}_${timestamp}.pdf`
      const uploadResult = await uploadDocument(
        orgId,
        fileName,
        pdfBuffer,
        'application/pdf'
      )

      // Update document request status
      await updateDocumentRequestStatus(
        docRequest.id,
        orgId,
        'generated',
        uploadResult.path,
        'pdf'
      )

      console.log('✅ Document generated successfully:', uploadResult.path)

      return ApiSuccess.created({
        id: docRequest.id,
        template_key,
        status: 'generated',
        file_url: uploadResult.url,
        file_path: uploadResult.path,
        download_url: `/api/docs/download/${docRequest.id}`,
        created_at: docRequest.created_at,
        message: 'Document généré avec succès'
      })
    } catch (genError: any) {
      // Update status to error
      await updateDocumentRequestStatus(docRequest.id, orgId, 'error')

      console.error('❌ Document generation error:', genError)
      return ApiError.internal('Erreur lors de la génération du PDF')
    }
  })
}
