import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Download, FileText, Calendar, Settings, Play, Clock, CheckCircle, AlertCircle } from 'lucide-react'

// Mock payroll exports data
const mockExports = [
  {
    id: '1',
    period: '2024-07',
    format: 'silae',
    status: 'completed',
    created_at: '2024-07-31T16:30:00Z',
    file_name: 'export_paie_silae_2024-07.csv',
    file_size: '45 KB',
    employees_count: 5,
    download_count: 3
  },
  {
    id: '2',
    period: '2024-06',
    format: 'payfit',
    status: 'completed',
    created_at: '2024-06-30T15:45:00Z',
    file_name: 'export_paie_payfit_2024-06.csv',
    file_size: '42 KB',
    employees_count: 5,
    download_count: 1
  },
  {
    id: '3',
    period: '2024-05',
    format: 'silae',
    status: 'completed',
    created_at: '2024-05-31T17:20:00Z',
    file_name: 'export_paie_silae_2024-05.csv',
    file_size: '38 KB',
    employees_count: 4,
    download_count: 2
  },
  {
    id: '4',
    period: '2024-08',
    format: 'silae',
    status: 'processing',
    created_at: '2024-08-01T09:15:00Z',
    file_name: 'export_paie_silae_2024-08.csv',
    file_size: null,
    employees_count: 5,
    download_count: 0
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />Terminé
      </Badge>
    case 'processing':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        <Clock className="h-3 w-3 mr-1" />En cours
      </Badge>
    case 'error':
      return <Badge variant="secondary" className="bg-red-100 text-red-800">
        <AlertCircle className="h-3 w-3 mr-1" />Erreur
      </Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getFormatBadge = (format: string) => {
  const colors = {
    silae: 'bg-blue-100 text-blue-800',
    payfit: 'bg-green-100 text-green-800',
    sage: 'bg-purple-100 text-purple-800'
  }
  return <Badge variant="outline" className={colors[format as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
    {format.toUpperCase()}
  </Badge>
}

export default function PayrollPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Export Paie</h1>
          <p className="text-gray-600 mt-2">Exportez les données de paie vers vos logiciels RH</p>
        </div>
        <Button>
          <Play className="h-4 w-4 mr-2" />
          Nouvel export
        </Button>
      </div>

      {/* Quick Export */}
      <Card>
        <CardHeader>
          <CardTitle>Export rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="export-period">Période</Label>
              <select 
                id="export-period"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2024-08">Août 2024</option>
                <option value="2024-07">Juillet 2024</option>
                <option value="2024-06">Juin 2024</option>
              </select>
            </div>
            <div>
              <Label htmlFor="export-format">Format</Label>
              <select 
                id="export-format"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="silae">Silae CSV</option>
                <option value="payfit">PayFit CSV</option>
                <option value="sage">Sage CSV</option>
              </select>
            </div>
            <div>
              <Label htmlFor="export-employees">Employés</Label>
              <select 
                id="export-employees"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les employés</option>
                <option value="active">Employés actifs</option>
                <option value="selection">Sélection personnalisée</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Générer l'export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{mockExports.length}</p>
              <p className="text-sm text-gray-600">Exports totaux</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {mockExports.filter(e => e.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Réussis</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {mockExports.reduce((sum, e) => sum + e.employees_count, 0)}
              </p>
              <p className="text-sm text-gray-600">Employés traités</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {mockExports.reduce((sum, e) => sum + e.download_count, 0)}
              </p>
              <p className="text-sm text-gray-600">Téléchargements</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Formats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Silae</h3>
            <p className="text-gray-600 text-sm mb-4">Format CSV compatible avec Silae</p>
            <Badge className="bg-blue-100 text-blue-800">Le plus utilisé</Badge>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">PayFit</h3>
            <p className="text-gray-600 text-sm mb-4">Format CSV compatible avec PayFit</p>
            <Badge variant="outline">Populaire</Badge>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Sage</h3>
            <p className="text-gray-600 text-sm mb-4">Format CSV compatible avec Sage</p>
            <Badge variant="outline">Disponible</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockExports.map((exportItem) => (
              <div
                key={exportItem.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 flex-1">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-gray-900">
                        Export {exportItem.period}
                      </h3>
                      {getStatusBadge(exportItem.status)}
                      {getFormatBadge(exportItem.format)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{exportItem.file_name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(exportItem.created_at).toLocaleDateString('fr-FR')}
                      </span>
                      <span>{exportItem.employees_count} employés</span>
                      {exportItem.file_size && <span>{exportItem.file_size}</span>}
                      <span>{exportItem.download_count} téléchargement{exportItem.download_count > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <p className="font-medium">{exportItem.employees_count}</p>
                    <p className="text-gray-500">employés</p>
                  </div>
                  <div className="flex gap-2">
                    {exportItem.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    )}
                    {exportItem.status === 'processing' && (
                      <Button size="sm" variant="outline" disabled>
                        <Clock className="h-4 w-4 mr-1" />
                        En cours...
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Détails
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration des exports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Paramètres par défaut</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="default-format">Format par défaut</Label>
                  <select 
                    id="default-format"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="silae">Silae CSV</option>
                    <option value="payfit">PayFit CSV</option>
                    <option value="sage">Sage CSV</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="auto-export">Export automatique</Label>
                  <select 
                    id="auto-export"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="disabled">Désactivé</option>
                    <option value="monthly">Mensuel</option>
                    <option value="weekly">Hebdomadaire</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Champs à inclure</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Informations personnelles</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Salaire de base</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Heures travaillées</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Congés pris</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Primes et bonus</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Sauvegarder la configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}










