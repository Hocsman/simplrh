import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, Eye, Calendar, User } from 'lucide-react'

// Mock document data
const getDocumentById = (id: string) => {
  const documents = {
    '1': {
      id: '1',
      title: 'Contrat de prestation - TechStart SAS',
      template_name: 'Contrat de prestation',
      status: 'generated',
      file_type: 'pdf',
      file_url: '/api/docs/download/1',
      created_at: new Date().toISOString(),
      payload: {
        prestataire_nom: 'SimplRH SAS',
        prestataire_adresse: '123 Rue de la Tech\n75001 Paris',
        client_nom: 'TechStart SAS',
        client_adresse: '456 Avenue Innovation\n69000 Lyon',
        objet_mission: 'Développement d\'une application web de gestion RH',
        duree: '6 mois',
        tarif: '5000'
      }
    },
    '2': {
      id: '2',
      title: 'CGV E-commerce - MonShop',
      template_name: 'CGV E-commerce',
      status: 'generated',
      file_type: 'pdf',
      file_url: '/api/docs/download/2',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      payload: {
        entreprise_nom: 'MonShop SARL',
        entreprise_adresse: '789 Rue du Commerce\n33000 Bordeaux',
        siret: '12345678901234',
        site_url: 'https://monshop.fr'
      }
    },
    '3': {
      id: '3',
      title: 'Lettre de mise en demeure - Client X',
      template_name: 'Lettre de mise en demeure',
      status: 'generated',
      file_type: 'pdf',
      file_url: '/api/docs/download/3',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      payload: {
        expediteur_nom: 'SimplRH SAS',
        expediteur_adresse: '123 Rue de la Tech\n75001 Paris',
        destinataire_nom: 'Client Défaillant SARL',
        destinataire_adresse: '999 Avenue des Impayés\n13000 Marseille',
        objet_demande: 'Facture n°FAC-2024-001 impayée',
        montant_du: '2500',
        delai_reponse: '15'
      }
    }
  }
  return documents[id as keyof typeof documents] || null
}

interface PreviewPageProps {
  params: {
    id: string
  }
}

export default function DocumentPreviewPage({ params }: PreviewPageProps) {
  const document = getDocumentById(params.id)

  if (!document) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/docs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux documents
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Document introuvable</h2>
            <p className="text-gray-600">Le document demandé n'existe pas ou a été supprimé.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generated':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Généré</Badge>
      case 'draft':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Brouillon</Badge>
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">En cours</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/docs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Aperçu du document</h1>
            <p className="text-gray-600 mt-1">{document.title}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href={document.file_url} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Ouvrir le PDF
            </Link>
          </Button>
          <Button asChild>
            <Link href={document.file_url} download>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Link>
          </Button>
        </div>
      </div>

      {/* Document Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contenu du document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(document.payload).map(([key, value]) => (
                <div key={key} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <dt className="text-sm font-medium text-gray-500 mb-1">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </dt>
                  <dd className="text-gray-900 whitespace-pre-line">
                    {typeof value === 'string' ? value : JSON.stringify(value)}
                  </dd>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Document Details */}
          <Card>
            <CardHeader>
              <CardTitle>Détails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Template</dt>
                <dd className="text-gray-900">{document.template_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Statut</dt>
                <dd>{getStatusBadge(document.status)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Format</dt>
                <dd>
                  <Badge variant="outline">{document.file_type.toUpperCase()}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Créé le</dt>
                <dd className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {new Date(document.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </dd>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href={document.file_url} download>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le PDF
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/docs/generate?template=${document.template_name.toLowerCase().replace(/\s+/g, '_')}`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Créer un document similaire
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}










