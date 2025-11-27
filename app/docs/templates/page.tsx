export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Plus, FileText, Search, Eye, Edit, Trash2, Copy } from 'lucide-react'

// Mock templates data
const mockTemplates = [
  {
    id: '1',
    key: 'contrat_prestation',
    name: 'Contrat de prestation',
    description: 'Contrat type pour prestations de services entre entreprises',
    category: 'commercial',
    usage_count: 15,
    last_used: '2024-07-20',
    status: 'active',
    fields_count: 7
  },
  {
    id: '2',
    key: 'cgv_ecommerce',
    name: 'CGV E-commerce',
    description: 'Conditions générales de vente pour sites de commerce électronique',
    category: 'legal',
    usage_count: 8,
    last_used: '2024-07-18',
    status: 'active',
    fields_count: 4
  },
  {
    id: '3',
    key: 'mise_en_demeure',
    name: 'Lettre de mise en demeure',
    description: 'Lettre de mise en demeure pour impayés et recouvrement',
    category: 'legal',
    usage_count: 12,
    last_used: '2024-07-19',
    status: 'active',
    fields_count: 7
  },
  {
    id: '4',
    key: 'contrat_travail_cdi',
    name: 'Contrat de travail CDI',
    description: 'Contrat de travail à durée indéterminée conforme au code du travail',
    category: 'rh',
    usage_count: 5,
    last_used: '2024-07-15',
    status: 'draft',
    fields_count: 12
  },
  {
    id: '5',
    key: 'facture_template',
    name: 'Template de facture',
    description: 'Modèle de facture personnalisable avec logo entreprise',
    category: 'commercial',
    usage_count: 25,
    last_used: '2024-07-21',
    status: 'active',
    fields_count: 10
  }
]

const getCategoryBadge = (category: string) => {
  const colors = {
    commercial: 'bg-blue-100 text-blue-800',
    legal: 'bg-red-100 text-red-800',
    rh: 'bg-green-100 text-green-800',
    finance: 'bg-purple-100 text-purple-800'
  }
  return <Badge variant="secondary" className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
    {category.charAt(0).toUpperCase() + category.slice(1)}
  </Badge>
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Actif</Badge>
    case 'draft':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Brouillon</Badge>
    case 'archived':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Archivé</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modèles de documents</h1>
          <p className="text-gray-600 mt-2">Gérez vos templates et créez-en de nouveaux</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau modèle
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un modèle..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Tous les types</Button>
            <Button variant="outline">Toutes les catégories</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{mockTemplates.length}</p>
              <p className="text-sm text-gray-600">Total modèles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {mockTemplates.filter(t => t.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {mockTemplates.filter(t => t.status === 'draft').length}
              </p>
              <p className="text-sm text-gray-600">Brouillons</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {mockTemplates.reduce((sum, t) => sum + t.usage_count, 0)}
              </p>
              <p className="text-sm text-gray-600">Utilisations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
                <div className="flex gap-2">
                  {getCategoryBadge(template.category)}
                  {getStatusBadge(template.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Utilisations</p>
                    <p className="font-medium">{template.usage_count}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Champs</p>
                    <p className="font-medium">{template.fields_count}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-gray-500">Dernière utilisation</p>
                  <p className="font-medium">
                    {new Date(template.last_used).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/docs/generate?template=${template.key}`}>
                      <FileText className="h-4 w-4 mr-1" />
                      Utiliser
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockTemplates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun modèle</h3>
            <p className="text-gray-600 mb-6">Créez votre premier modèle de document</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer un modèle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}










