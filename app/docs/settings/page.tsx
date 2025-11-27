export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  FileText, 
  Palette, 
  Shield, 
  Users, 
  Bell,
  Save,
  Upload,
  Download
} from 'lucide-react'

export default function DocsSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres Documents</h1>
          <p className="text-gray-600 mt-2">Configurez les options du module Documents</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres généraux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default-format">Format par défaut</Label>
                  <select 
                    id="default-format"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pdf">PDF</option>
                    <option value="docx">DOCX</option>
                    <option value="both">PDF + DOCX</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="auto-naming">Nomenclature automatique</Label>
                  <Input 
                    id="auto-naming"
                    placeholder="DOC-{date}-{template}-{id}"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-save">Sauvegarde automatique</Label>
                    <p className="text-sm text-gray-600">Sauvegarder automatiquement les brouillons</p>
                  </div>
                  <Switch id="auto-save" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="version-control">Gestion des versions</Label>
                    <p className="text-sm text-gray-600">Conserver un historique des modifications</p>
                  </div>
                  <Switch id="version-control" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="watermark">Filigrane automatique</Label>
                    <p className="text-sm text-gray-600">Ajouter un filigrane sur les documents</p>
                  </div>
                  <Switch id="watermark" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Paramètres des modèles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="template-validation">Validation obligatoire</Label>
                    <p className="text-sm text-gray-600">Valider les modèles avant publication</p>
                  </div>
                  <Switch id="template-validation" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="template-sharing">Partage entre utilisateurs</Label>
                    <p className="text-sm text-gray-600">Permettre le partage de modèles personnalisés</p>
                  </div>
                  <Switch id="template-sharing" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="template-backup">Sauvegarde des modèles</Label>
                    <p className="text-sm text-gray-600">Sauvegarder automatiquement les modèles</p>
                  </div>
                  <Switch id="template-backup" defaultChecked />
                </div>
              </div>

              <div>
                <Label htmlFor="template-categories">Catégories personnalisées</Label>
                <Textarea 
                  id="template-categories"
                  placeholder="Commercial, Juridique, RH, Finance..."
                  className="mt-1"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">Séparez les catégories par des virgules</p>
              </div>
            </CardContent>
          </Card>

          {/* Security & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité et permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="document-encryption">Chiffrement des documents</Label>
                    <p className="text-sm text-gray-600">Chiffrer les documents sensibles</p>
                  </div>
                  <Switch id="document-encryption" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="access-logs">Journalisation des accès</Label>
                    <p className="text-sm text-gray-600">Enregistrer tous les accès aux documents</p>
                  </div>
                  <Switch id="access-logs" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="download-limits">Limiter les téléchargements</Label>
                    <p className="text-sm text-gray-600">Contrôler le nombre de téléchargements</p>
                  </div>
                  <Switch id="download-limits" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="retention-period">Période de rétention</Label>
                  <select 
                    id="retention-period"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1year">1 an</option>
                    <option value="3years">3 ans</option>
                    <option value="5years">5 ans</option>
                    <option value="10years">10 ans</option>
                    <option value="unlimited">Illimitée</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="max-file-size">Taille max des fichiers</Label>
                  <Input 
                    id="max-file-size"
                    placeholder="10 MB"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Importer des modèles
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Exporter la configuration
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Créer un modèle
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Modèles actifs</span>
                <Badge>12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Documents générés</span>
                <Badge>156</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Utilisateurs actifs</span>
                <Badge>8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Espace utilisé</span>
                <Badge>2.4 GB</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Nouveau document</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Modèle partagé</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Erreur de génération</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Quota dépassé</span>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}










