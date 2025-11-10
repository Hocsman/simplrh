import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, FileText, Download, Eye, Calendar } from 'lucide-react'

// Mock data for testing
const mockDocuments = [
  {
    id: '1',
    title: 'Contrat de prestation - TechStart SAS',
    template_name: 'Contrat de prestation',
    status: 'generated',
    file_type: 'pdf',
    file_url: '/api/docs/download/1',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'CGV E-commerce - MonShop',
    template_name: 'CGV E-commerce',
    status: 'generated',
    file_type: 'pdf',
    file_url: '/api/docs/download/2',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    title: 'Lettre de mise en demeure - Client X',
    template_name: 'Lettre de mise en demeure',
    status: 'generated',
    file_type: 'pdf',
    file_url: '/api/docs/download/3',
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
]

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

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-2">Gérez vos documents juridiques et professionnels</p>
        </div>
        <Button asChild>
          <Link href="/docs/generate">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau document
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents générés</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockDocuments.filter(d => d.status === 'generated').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ce mois</p>
                <p className="text-2xl font-bold text-blue-600">{mockDocuments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Templates disponibles</p>
                <p className="text-2xl font-bold text-purple-600">12</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Templates populaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/docs/generate?template=contrat_prestation">
                <div className="text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium">Contrat de prestation</div>
                  <div className="text-sm text-gray-500">Services professionnels</div>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/docs/generate?template=cgv_ecommerce">
                <div className="text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-medium">CGV E-commerce</div>
                  <div className="text-sm text-gray-500">Conditions générales</div>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/docs/generate?template=mise_en_demeure">
                <div className="text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <div className="font-medium">Mise en demeure</div>
                  <div className="text-sm text-gray-500">Recouvrement</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Documents récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDocuments.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">{document.title}</h3>
                      <p className="text-sm text-gray-600">{document.template_name}</p>
                      <p className="text-sm text-gray-500">
                        Créé le {new Date(document.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(document.status)}
                  <Badge variant="outline">{document.file_type.toUpperCase()}</Badge>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/docs/${document.id}/preview`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Aperçu
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={document.file_url} download>
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {mockDocuments.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document</h3>
              <p className="text-gray-600 mb-4">Créez votre premier document à partir d'un template</p>
              <Button asChild>
                <Link href="/docs/generate">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau document
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}