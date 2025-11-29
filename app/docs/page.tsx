export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Plus,
  FileText,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Layers,
  File,
  ArrowRight
} from 'lucide-react'

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
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Généré</Badge>
    case 'draft':
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Brouillon</Badge>
    case 'processing':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos documents juridiques et professionnels
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm" asChild>
          <Link href="/docs/generate">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau document
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle2 className="h-24 w-24 text-green-600" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Documents générés</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-green-600">
                {mockDocuments.filter(d => d.status === 'generated').length}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Prêts à télécharger</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Ce mois</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{mockDocuments.length}</h3>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3 ce mois-ci
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <Layers className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Templates disponibles</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-purple-600">12</h3>
              <p className="text-sm text-muted-foreground mt-1">Modèles juridiques</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates rapides */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">Templates populaires</CardTitle>
            <CardDescription>Sélectionnez un modèle pour générer votre document</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/docs/generate?template=contrat_prestation"
              className="group relative overflow-hidden rounded-xl border-2 border-gray-100 p-6 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">Contrat de prestation</div>
                <div className="text-sm text-muted-foreground mb-3">Services professionnels</div>
                <div className="text-blue-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Créer <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>

            <Link
              href="/docs/generate?template=cgv_ecommerce"
              className="group relative overflow-hidden rounded-xl border-2 border-gray-100 p-6 hover:border-green-300 hover:bg-green-50/50 transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">CGV E-commerce</div>
                <div className="text-sm text-muted-foreground mb-3">Conditions générales</div>
                <div className="text-green-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Créer <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>

            <Link
              href="/docs/generate?template=mise_en_demeure"
              className="group relative overflow-hidden rounded-xl border-2 border-gray-100 p-6 hover:border-red-300 hover:bg-red-50/50 transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">Mise en demeure</div>
                <div className="text-sm text-muted-foreground mb-3">Recouvrement</div>
                <div className="text-red-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Créer <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">Documents récents</CardTitle>
              <CardDescription>Vos documents générés et en cours</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/docs/history">Tout voir</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-lg border border-dashed">
              <div className="p-3 bg-gray-100 rounded-full mb-3">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-900">Aucun document</p>
              <p className="text-sm text-muted-foreground mb-4">Créez votre premier document à partir d'un template</p>
              <Button asChild>
                <Link href="/docs/generate">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau document
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {mockDocuments.map((document) => (
                <div
                  key={document.id}
                  className="group flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 hover:border-gray-200 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <File className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{document.title}</h3>
                      <p className="text-sm text-muted-foreground">{document.template_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Créé le {new Date(document.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(document.status)}
                    <Badge variant="outline" className="text-xs">{document.file_type.toUpperCase()}</Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" asChild title="Aperçu">
                        <Link href={`/docs/${document.id}/preview`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="icon" variant="ghost" asChild title="Télécharger">
                        <Link href={document.file_url} download>
                          <Download className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}