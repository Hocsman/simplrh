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
  Users, 
  Calendar, 
  Shield, 
  Bell,
  Save,
  Upload,
  Download,
  Clock,
  Mail
} from 'lucide-react'

export default function PeopleSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres RH</h1>
          <p className="text-gray-600 mt-2">Configurez les options du module RH</p>
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
                  <Label htmlFor="company-name">Nom de l'entreprise</Label>
                  <Input 
                    id="company-name"
                    placeholder="SimplRH SAS"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="siret">SIRET</Label>
                  <Input 
                    id="siret"
                    placeholder="12345678901234"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company-address">Adresse de l'entreprise</Label>
                <Textarea 
                  id="company-address"
                  placeholder="123 Rue de la Tech&#10;75001 Paris"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-employee-id">ID employé automatique</Label>
                    <p className="text-sm text-gray-600">Générer automatiquement les identifiants employés</p>
                  </div>
                  <Switch id="auto-employee-id" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="probation-tracking">Suivi période d'essai</Label>
                    <p className="text-sm text-gray-600">Alertes pour les fins de période d'essai</p>
                  </div>
                  <Switch id="probation-tracking" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Gestion des congés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="annual-leave-days">Congés payés annuels</Label>
                  <Input 
                    id="annual-leave-days"
                    type="number"
                    placeholder="25"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Jours par année civile</p>
                </div>
                <div>
                  <Label htmlFor="rtt-days">RTT annuels</Label>
                  <Input 
                    id="rtt-days"
                    type="number"
                    placeholder="10"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Jours de réduction du temps de travail</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leave-year-start">Début année de congés</Label>
                  <select 
                    id="leave-year-start"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="january">1er Janvier</option>
                    <option value="june">1er Juin</option>
                    <option value="september">1er Septembre</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="advance-request-days">Délai de demande</Label>
                  <Input 
                    id="advance-request-days"
                    type="number"
                    placeholder="7"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Jours minimum avant la demande</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-approval">Approbation automatique</Label>
                    <p className="text-sm text-gray-600">Approuver automatiquement les RTT</p>
                  </div>
                  <Switch id="auto-approval" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekend-included">Inclure les week-ends</Label>
                    <p className="text-sm text-gray-600">Compter les week-ends dans les congés</p>
                  </div>
                  <Switch id="weekend-included" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="carry-over">Report de congés</Label>
                    <p className="text-sm text-gray-600">Permettre le report sur l'année suivante</p>
                  </div>
                  <Switch id="carry-over" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payroll Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Paramètres de paie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pay-frequency">Fréquence de paie</Label>
                  <select 
                    id="pay-frequency"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">Mensuelle</option>
                    <option value="biweekly">Bi-mensuelle</option>
                    <option value="weekly">Hebdomadaire</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="working-hours">Heures de travail/semaine</Label>
                  <Input 
                    id="working-hours"
                    type="number"
                    placeholder="35"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="overtime-rate">Taux heures supplémentaires</Label>
                  <Input 
                    id="overtime-rate"
                    type="number"
                    step="0.01"
                    placeholder="1.25"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Multiplicateur du taux horaire</p>
                </div>
                <div>
                  <Label htmlFor="currency">Devise</Label>
                  <select 
                    id="currency"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar ($)</option>
                    <option value="GBP">Livre (£)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-export">Export automatique</Label>
                    <p className="text-sm text-gray-600">Générer automatiquement les exports de paie</p>
                  </div>
                  <Switch id="auto-export" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payslip-email">Bulletins par email</Label>
                    <p className="text-sm text-gray-600">Envoyer les bulletins de paie par email</p>
                  </div>
                  <Switch id="payslip-email" defaultChecked />
                </div>
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
                    <Label htmlFor="data-encryption">Chiffrement des données</Label>
                    <p className="text-sm text-gray-600">Chiffrer les données sensibles des employés</p>
                  </div>
                  <Switch id="data-encryption" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="audit-logs">Journalisation</Label>
                    <p className="text-sm text-gray-600">Enregistrer toutes les actions sur les données RH</p>
                  </div>
                  <Switch id="audit-logs" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="self-service">Portail employé</Label>
                    <p className="text-sm text-gray-600">Permettre aux employés de consulter leurs données</p>
                  </div>
                  <Switch id="self-service" defaultChecked />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data-retention">Durée de conservation</Label>
                  <select 
                    id="data-retention"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="5years">5 ans</option>
                    <option value="10years">10 ans</option>
                    <option value="unlimited">Illimitée</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="backup-frequency">Fréquence sauvegarde</Label>
                  <select 
                    id="backup-frequency"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Quotidienne</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuelle</option>
                  </select>
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
                Importer employés
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Exporter données
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Ajouter employé
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
                <span className="text-sm text-gray-600">Employés actifs</span>
                <Badge>5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Demandes en attente</span>
                <Badge className="bg-yellow-100 text-yellow-800">2</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Exports ce mois</span>
                <Badge>3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taux d'absentéisme</span>
                <Badge className="bg-red-100 text-red-800">4.2%</Badge>
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
                <span className="text-sm">Nouvelle demande</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Fin période d'essai</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Anniversaire employé</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Solde congés faible</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rapport mensuel</span>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Configuration email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="from-email">Email expéditeur</Label>
                <Input 
                  id="from-email"
                  type="email"
                  placeholder="rh@simplrh.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reply-email">Email de réponse</Label>
                <Input 
                  id="reply-email"
                  type="email"
                  placeholder="noreply@simplrh.com"
                  className="mt-1"
                />
              </div>
              <Button variant="outline" className="w-full">
                Tester la configuration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}










