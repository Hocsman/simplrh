export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Search, FileText, Download, Eye, Calendar, User, Filter } from 'lucide-react'

// Mock history data
const mockHistory = [
  {
    id: '1',
    title: 'Contrat de prestation - TechStart SAS',
    template_name: 'Contrat de prestation',
    created_by: 'Marie Dupont',
    created_at: '2024-07-21T14:30:00Z',
    status: 'generated',
    file_type: 'pdf',
    file_size: '245 KB',
    download_count: 3
  },
  {
    id: '2',
    title: 'CGV E-commerce - MonShop',
    template_name: 'CGV E-commerce',
    created_by: 'Jean Martin',
    created_at: '2024-07-20T10:15:00Z',
    status: 'generated',
    file_type: 'pdf',
    file_size: '180 KB',
    download_count: 1
  },
  {
    id: '3',
    title: 'Lettre de mise en demeure - Client X',
    template_name: 'Lettre de mise en demeure',
    created_by: 'Sophie Leblanc',
    created_at: '2024-07-19T16:45:00Z',
    status: 'generated',
    file_type: 'pdf',
    file_size: '156 KB',
    download_count: 2
  },
  {
    id: '4',
    title: 'Contrat CDI - Nouveau collaborateur',
    template_name: 'Contrat de travail CDI',
    created_by: 'Marie Dupont',
    created_at: '2024-07-18T09:20:00Z',
    status: 'generated',
    file_type: 'pdf',
    file_size: '320 KB',
    download_count: 5
  },
  {
    id: '5',
    title: 'Facture - Prestation juillet',
    template_name: 'Template de facture',
    created_by: 'Jean Martin',
    created_at: '2024-07-17T11:30:00Z',
    status: 'generated',
    file_type: 'pdf',
    file_size: '198 KB',
    download_count: 8
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'generated':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Généré</Badge>
    case 'draft':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Brouillon</Badge>
    case 'processing':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">En cours</Badge>
    case 'error':
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Erreur</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('fr-FR'),
    time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
}

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historique des documents</h1>
          <p className="text-gray-600 mt-2">Consultez tous les documents générés</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline">Exporter</Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans l'historique..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Cette semaine</Button>
            <Button variant="outline">Tous les types</Button>
            <Button variant="outline">Tous les utilisateurs</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{mockHistory.length}</p>
              <p className="text-sm text-gray-600">Documents générés</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {mockHistory.reduce((sum, doc) => sum + doc.download_count, 0)}
              </p>
              <p className="text-sm text-gray-600">Téléchargements</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {new Set(mockHistory.map(doc => doc.created_by)).size}
              </p>
              <p className="text-sm text-gray-600">Utilisateurs actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(mockHistory.reduce((sum, doc) => 
                  sum + parseFloat(doc.file_size.replace(' KB', '')), 0
                ))} KB
              </p>
              <p className="text-sm text-gray-600">Taille totale</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle>Documents récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockHistory.map((document) => {
              const { date, time } = formatDate(document.created_at)
              return (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{document.title}</h3>
                      <p className="text-sm text-gray-600">{document.template_name}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {document.created_by}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {date} à {time}
                        </div>
                        <span>{document.file_size}</span>
                        <span>{document.download_count} téléchargement{document.download_count > 1 ? 's' : ''}</span>
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
                          Voir
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/api/docs/download/${document.id}`} download>
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600">
              Affichage de 1 à {mockHistory.length} sur {mockHistory.length} documents
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Précédent</Button>
              <Button variant="outline" size="sm">Suivant</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}










