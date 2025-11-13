import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { logAuditEvent } from '../core/audit'

export interface DocTemplate {
  id: string
  org_id?: string
  key: string
  locale: string
  version: number
  title: string
  schema: Record<string, any>
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface DocRequest {
  id: string
  org_id: string
  template_key: string
  payload_json: Record<string, any>
  status: 'draft' | 'generated' | 'error'
  created_at: string
  updated_at: string
  files?: DocFile[]
}

export interface DocFile {
  id: string
  org_id: string
  request_id: string
  path: string
  type: 'pdf' | 'docx'
  created_at: string
}

export const generateDocumentSchema = z.object({
  template_key: z.string(),
  payload: z.record(z.any())
})

export type GenerateDocumentData = z.infer<typeof generateDocumentSchema>

// Templates publics par défaut
export const DEFAULT_TEMPLATES: Omit<DocTemplate, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    org_id: null,
    key: 'contrat-prestation',
    locale: 'fr',
    version: 1,
    title: 'Contrat de prestation de services',
    is_public: true,
    schema: {
      type: 'object',
      properties: {
        prestataire: {
          type: 'object',
          properties: {
            nom: { type: 'string', title: 'Nom/Raison sociale' },
            adresse: { type: 'string', title: 'Adresse' },
            siret: { type: 'string', title: 'SIRET' }
          },
          required: ['nom', 'adresse']
        },
        client: {
          type: 'object',
          properties: {
            nom: { type: 'string', title: 'Nom/Raison sociale' },
            adresse: { type: 'string', title: 'Adresse' }
          },
          required: ['nom', 'adresse']
        },
        prestation: {
          type: 'object',
          properties: {
            description: { type: 'string', title: 'Description de la prestation' },
            duree: { type: 'string', title: 'Durée' },
            prix: { type: 'number', title: 'Prix (€ HT)' }
          },
          required: ['description', 'prix']
        }
      },
      required: ['prestataire', 'client', 'prestation']
    }
  },
  {
    org_id: null,
    key: 'cgv-ecommerce',
    locale: 'fr',
    version: 1,
    title: 'Conditions Générales de Vente - E-commerce',
    is_public: true,
    schema: {
      type: 'object',
      properties: {
        entreprise: {
          type: 'object',
          properties: {
            nom: { type: 'string', title: 'Nom de l\'entreprise' },
            adresse: { type: 'string', title: 'Adresse' },
            siret: { type: 'string', title: 'SIRET' },
            email: { type: 'string', title: 'Email de contact' },
            telephone: { type: 'string', title: 'Téléphone' }
          },
          required: ['nom', 'adresse', 'siret', 'email']
        },
        site: {
          type: 'object',
          properties: {
            url: { type: 'string', title: 'URL du site' },
            activite: { type: 'string', title: 'Activité principale' }
          },
          required: ['url', 'activite']
        }
      },
      required: ['entreprise', 'site']
    }
  },
  {
    org_id: null,
    key: 'mise-en-demeure',
    locale: 'fr',
    version: 1,
    title: 'Lettre de mise en demeure',
    is_public: true,
    schema: {
      type: 'object',
      properties: {
        expediteur: {
          type: 'object',
          properties: {
            nom: { type: 'string', title: 'Nom/Raison sociale' },
            adresse: { type: 'string', title: 'Adresse' }
          },
          required: ['nom', 'adresse']
        },
        destinataire: {
          type: 'object',
          properties: {
            nom: { type: 'string', title: 'Nom/Raison sociale' },
            adresse: { type: 'string', title: 'Adresse' }
          },
          required: ['nom', 'adresse']
        },
        objet: {
          type: 'object',
          properties: {
            description: { type: 'string', title: 'Objet de la mise en demeure' },
            montant: { type: 'number', title: 'Montant dû (€)' },
            echeance: { type: 'string', title: 'Date d\'échéance' },
            delai: { type: 'number', title: 'Délai de règlement (jours)', default: 8 }
          },
          required: ['description', 'montant', 'echeance']
        }
      },
      required: ['expediteur', 'destinataire', 'objet']
    }
  }
]

export async function getPublicTemplates() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('doc_templates')
    .select('*')
    .eq('is_public', true)
    .order('title')

  if (error) throw error
  return data as DocTemplate[]
}

export async function getTemplate(key: string, orgId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('doc_templates')
    .select('*')
    .eq('key', key)

  if (orgId) {
    query = query.or(`org_id.eq.${orgId},org_id.is.null`)
  } else {
    query = query.is('org_id', null)
  }

  const { data, error } = await query
    .order('version', { ascending: false })
    .limit(1)
    .single()

  if (error) throw error
  return data as DocTemplate
}

export async function createDocumentRequest(
  orgId: string,
  data: GenerateDocumentData,
  actorId?: string
) {
  const supabase = await createClient()

  const { data: request, error } = await supabase
    .from('doc_requests')
    .insert({
      org_id: orgId,
      template_key: data.template_key,
      payload_json: data.payload,
      status: 'draft'
    })
    .select()
    .single()

  if (error) throw error

  // Log audit
  await logAuditEvent(orgId, 'document.requested', {
    actorId,
    targetTable: 'doc_requests',
    targetId: request.id,
    metadata: { template_key: data.template_key }
  })

  return request as DocRequest
}

export async function getDocumentRequests(orgId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('doc_requests')
    .select(`
      *,
      files:doc_files(*)
    `)
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as DocRequest[]
}

export async function updateDocumentRequestStatus(
  requestId: string,
  orgId: string,
  status: DocRequest['status'],
  filePath?: string,
  fileType?: 'pdf' | 'docx'
) {
  const supabase = await createClient()

  // Update request status
  const { data: request, error: requestError } = await supabase
    .from('doc_requests')
    .update({ status })
    .eq('id', requestId)
    .eq('org_id', orgId)
    .select()
    .single()

  if (requestError) throw requestError

  // If file generated, create file record
  if (status === 'generated' && filePath && fileType) {
    const { error: fileError } = await supabase
      .from('doc_files')
      .insert({
        org_id: orgId,
        request_id: requestId,
        path: filePath,
        type: fileType
      })

    if (fileError) throw fileError
  }

  return request as DocRequest
}



