import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Generating document with data:', body)
    
    // Mock document generation
    const document = {
      id: Date.now().toString(),
      template_key: body.template_key || 'contrat_prestation',
      title: body.title || 'Document généré',
      status: 'generated',
      file_type: 'pdf',
      file_path: `/documents/mock-${Date.now()}.pdf`,
      file_url: `http://localhost:3001/api/docs/download/${Date.now()}`,
      created_at: new Date().toISOString(),
      payload: body.payload || {},
      message: 'Document généré avec succès (mode test)'
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return NextResponse.json(document)
  } catch (error: any) {
    console.error('Document generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la génération du document' },
      { status: 400 }
    )
  }
}

// Mock templates data
export async function GET() {
  try {
    const templates = [
      {
        id: '1',
        key: 'contrat_prestation',
        name: 'Contrat de prestation',
        description: 'Contrat type pour prestations de services',
        category: 'commercial',
        fields: [
          { key: 'prestataire_nom', label: 'Nom du prestataire', type: 'text', required: true },
          { key: 'prestataire_adresse', label: 'Adresse du prestataire', type: 'textarea', required: true },
          { key: 'client_nom', label: 'Nom du client', type: 'text', required: true },
          { key: 'client_adresse', label: 'Adresse du client', type: 'textarea', required: true },
          { key: 'objet_mission', label: 'Objet de la mission', type: 'textarea', required: true },
          { key: 'duree', label: 'Durée', type: 'text', required: true },
          { key: 'tarif', label: 'Tarif', type: 'number', required: true }
        ]
      },
      {
        id: '2',
        key: 'cgv_ecommerce',
        name: 'CGV E-commerce',
        description: 'Conditions générales de vente pour site e-commerce',
        category: 'legal',
        fields: [
          { key: 'entreprise_nom', label: 'Nom de l\'entreprise', type: 'text', required: true },
          { key: 'entreprise_adresse', label: 'Adresse de l\'entreprise', type: 'textarea', required: true },
          { key: 'siret', label: 'SIRET', type: 'text', required: true },
          { key: 'site_url', label: 'URL du site', type: 'text', required: true }
        ]
      },
      {
        id: '3',
        key: 'mise_en_demeure',
        name: 'Lettre de mise en demeure',
        description: 'Lettre de mise en demeure pour impayés',
        category: 'legal',
        fields: [
          { key: 'expediteur_nom', label: 'Nom de l\'expéditeur', type: 'text', required: true },
          { key: 'expediteur_adresse', label: 'Adresse de l\'expéditeur', type: 'textarea', required: true },
          { key: 'destinataire_nom', label: 'Nom du destinataire', type: 'text', required: true },
          { key: 'destinataire_adresse', label: 'Adresse du destinataire', type: 'textarea', required: true },
          { key: 'objet_demande', label: 'Objet de la demande', type: 'textarea', required: true },
          { key: 'montant_du', label: 'Montant dû', type: 'number', required: true },
          { key: 'delai_reponse', label: 'Délai de réponse (jours)', type: 'number', required: true }
        ]
      }
    ]
    
    return NextResponse.json(templates)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}