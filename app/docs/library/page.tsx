import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Search, FileText, Download, Eye, Upload, Folder, Star, Share2 } from 'lucide-react'

// Mock library data
const mockLibrary = [
  {
    id: '1',
    name: 'Modèles juridiques essentiels',
    type: 'folder',
    items_count: 12,
    size: '2.4 MB',
    updated_at: '2024-07-20',
    shared: true,
    favorite: true
  },
  {
    id: '2',
    name: 'Guide de rédaction CGV',
    type: 'document',
    file_type: 'pdf',
    size: '856 KB',
    updated_at: '2024-07-19',
    shared: false,
    favorite: false,
    description: 'Guide complet pour rédiger des conditions générales de vente conformes'
  },
  {
    id: '3',
    name: 'Templates commerciaux',
    type: 'folder',
    items_count: 8,
    size: '1.8 MB',
    updated_at: '2024-07-18',
    shared: true,
    favorite: true
  },
  {
    id: '4',
    name: 'Clauses de confidentialité types',
    type: 'document',
    file_type: 'docx',
    size: '245 KB',
    updated_at: '2024-07-17',
    shared: false,
    favorite: true,
    description: 'Collection de clauses de confidentialité pour différents secteurs'
  },
  {
    id: '5',
    name: 'Modèles de lettres administratives',
    type: 'folder',
    items_count: 15,
    size: '3.1 MB',
    updated_at: '2024-07-16',
    shared: true,
    favorite: false
  },
  {
    id: '6',
    name: 'Checklist validation juridique',
    type: 'document',
    file_type: 'pdf',
    size: '124 KB',
    updated_at: '2024-07-15',
    shared: false,
    favorite: false,
    description: 'Liste de vérification pour valider vos documents juridiques'
  }
]

const getTypeIcon = (type: string, fileType?: string) => {
  if (type === 'folder') {
    return <Folder className="h-8 w-8 text-blue-600" />
  }
  return <FileText className="h-8 w-8 text-gray-600" />
}

const getTypeBadge = (type: string, fileType?: string) => {
  if (type === 'folder') {
    return <Badge variant="outline" className="text-blue-600 border-blue-600">Dossier</Badge>
  }
  return <Badge variant="outline">{fileType?.toUpperCase() || 'DOC'}</Badge>
}

export default function LibraryPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bibliothèque de documents</h1>
          <p className="text-gray-600 mt-2">Ressources, guides et modèles partagés</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button>
            <Folder className="h-4 w-4 mr-2" />
            Nouveau dossier
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans la bibliothèque..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Tous les types</Button>
            <Button variant="outline">Mes favoris</Button>
            <Button variant="outline">Partagés</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-medium">Favoris</h3>
            <p className="text-sm text-gray-600">
              {mockLibrary.filter(item => item.favorite).length} éléments
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Share2 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-medium">Partagés</h3>
            <p className="text-sm text-gray-600">
              {mockLibrary.filter(item => item.shared).length} éléments
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Folder className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-medium">Dossiers</h3>
            <p className="text-sm text-gray-600">
              {mockLibrary.filter(item => item.type === 'folder').length} dossiers
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-medium">Documents</h3>
            <p className="text-sm text-gray-600">
              {mockLibrary.filter(item => item.type === 'document').length} fichiers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Library Content */}
      <Card>
        <CardHeader>
          <CardTitle>Contenu de la bibliothèque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockLibrary.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    {getTypeIcon(item.type, item.file_type)}
                    {item.favorite && (
                      <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.shared && (
                        <Share2 className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Mis à jour le {new Date(item.updated_at).toLocaleDateString('fr-FR')}</span>
                      <span>{item.size}</span>
                      {item.type === 'folder' && (
                        <span>{item.items_count} élément{item.items_count > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getTypeBadge(item.type, item.file_type)}
                  <div className="flex gap-2">
                    {item.type === 'document' && (
                      <>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Aperçu
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      </>
                    )}
                    {item.type === 'folder' && (
                      <Button size="sm" variant="outline">
                        Ouvrir
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {mockLibrary.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bibliothèque vide</h3>
              <p className="text-gray-600 mb-6">Ajoutez des documents et créez des dossiers</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer des fichiers
                </Button>
                <Button>
                  <Folder className="h-4 w-4 mr-2" />
                  Créer un dossier
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}









