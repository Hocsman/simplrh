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
  CreditCard, 
  FileText, 
  Mail,
  Save,
  Upload,
  Download,
  Euro,
  Palette,
  Shield,
  Zap
} from 'lucide-react'

export default function BillingSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres Facturation</h1>
          <p className="text-gray-600 mt-2">Configurez les options du module de facturation</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Informations de l'entreprise
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vat-number">Numéro de TVA</Label>
                  <Input 
                    id="vat-number"
                    placeholder="FR12345678901"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ape-code">Code APE</Label>
                  <Input 
                    id="ape-code"
                    placeholder="6201Z"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company-address">Adresse de facturation</Label>
                <Textarea 
                  id="company-address"
                  placeholder="123 Rue de la Tech&#10;75001 Paris"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone"
                    placeholder="01 23 45 67 89"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email de facturation</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="facturation@simplrh.com"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Configuration des factures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoice-prefix">Préfixe des factures</Label>
                  <Input 
                    id="invoice-prefix"
                    placeholder="FAC-"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="invoice-counter">Compteur de factures</Label>
                  <Input 
                    id="invoice-counter"
                    type="number"
                    placeholder="1"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment-terms">Délai de paiement par défaut</Label>
                  <select 
                    id="payment-terms"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="30">30 jours</option>
                    <option value="45">45 jours</option>
                    <option value="60">60 jours</option>
                    <option value="0">Comptant</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="vat-rate">Taux de TVA par défaut</Label>
                  <select 
                    id="vat-rate"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="20">20%</option>
                    <option value="10">10%</option>
                    <option value="5.5">5,5%</option>
                    <option value="0">0% (exonéré)</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="invoice-footer">Pied de page des factures</Label>
                <Textarea 
                  id="invoice-footer"
                  placeholder="Conditions de paiement : 30 jours net&#10;Pénalités de retard : 3 fois le taux légal"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-numbering">Numérotation automatique</Label>
                    <p className="text-sm text-gray-600">Numéroter automatiquement les factures</p>
                  </div>
                  <Switch id="auto-numbering" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="facturx-enabled">Format Factur-X</Label>
                    <p className="text-sm text-gray-600">Générer les factures au format Factur-X (PDF + XML)</p>
                  </div>
                  <Switch id="facturx-enabled" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-send">Envoi automatique</Label>
                    <p className="text-sm text-gray-600">Envoyer automatiquement les factures par email</p>
                  </div>
                  <Switch id="auto-send" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Moyens de paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bank-name">Nom de la banque</Label>
                  <Input 
                    id="bank-name"
                    placeholder="Crédit Mutuel"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="iban">IBAN</Label>
                  <Input 
                    id="iban"
                    placeholder="FR76 1234 5678 9012 3456 7890 123"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bic">BIC/SWIFT</Label>
                  <Input 
                    id="bic"
                    placeholder="CMCIFR2A"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="account-holder">Titulaire du compte</Label>
                  <Input 
                    id="account-holder"
                    placeholder="SimplRH SAS"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="stripe-enabled">Paiement en ligne (Stripe)</Label>
                    <p className="text-sm text-gray-600">Permettre le paiement par carte bancaire</p>
                  </div>
                  <Switch id="stripe-enabled" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sepa-enabled">Prélèvement SEPA</Label>
                    <p className="text-sm text-gray-600">Accepter les mandats de prélèvement</p>
                  </div>
                  <Switch id="sepa-enabled" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="check-enabled">Paiement par chèque</Label>
                    <p className="text-sm text-gray-600">Afficher les informations pour les chèques</p>
                  </div>
                  <Switch id="check-enabled" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configuration email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from-email">Email expéditeur</Label>
                  <Input 
                    id="from-email"
                    type="email"
                    placeholder="facturation@simplrh.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="reply-email">Email de réponse</Label>
                  <Input 
                    id="reply-email"
                    type="email"
                    placeholder="contact@simplrh.com"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email-subject">Objet par défaut</Label>
                <Input 
                  id="email-subject"
                  placeholder="Facture {invoice_number} - {company_name}"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email-template">Modèle d'email</Label>
                <Textarea 
                  id="email-template"
                  placeholder="Bonjour,&#10;&#10;Veuillez trouver ci-joint la facture {invoice_number} d'un montant de {amount}€.&#10;&#10;Cordialement,&#10;L'équipe SimplRH"
                  className="mt-1"
                  rows={6}
                />
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
                Importer logo
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Exporter paramètres
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Modèles de factures
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
                <span className="text-sm text-gray-600">Factures ce mois</span>
                <Badge>12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">CA ce mois</span>
                <Badge className="bg-green-100 text-green-800">45,2k€</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">En attente</span>
                <Badge className="bg-orange-100 text-orange-800">8,5k€</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taux de recouvrement</span>
                <Badge className="bg-blue-100 text-blue-800">94%</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Intégrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Stripe</p>
                  <p className="text-sm text-gray-500">Paiements en ligne</p>
                </div>
                <Button variant="outline" size="sm">Connecter</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sage</p>
                  <p className="text-sm text-gray-500">Comptabilité</p>
                </div>
                <Button variant="outline" size="sm" disabled>Bientôt</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Chorus Pro</p>
                  <p className="text-sm text-gray-500">Factures publiques</p>
                </div>
                <Button variant="outline" size="sm" disabled>Bientôt</Button>
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="brand-color">Couleur principale</Label>
                <div className="flex gap-2 mt-2">
                  <div className="w-8 h-8 bg-blue-500 rounded cursor-pointer border-2 border-blue-600"></div>
                  <div className="w-8 h-8 bg-green-500 rounded cursor-pointer"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded cursor-pointer"></div>
                  <div className="w-8 h-8 bg-red-500 rounded cursor-pointer"></div>
                </div>
              </div>
              <div>
                <Label htmlFor="invoice-template">Modèle de facture</Label>
                <select 
                  id="invoice-template"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="modern">Moderne</option>
                  <option value="classic">Classique</option>
                  <option value="minimal">Minimaliste</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Signature électronique</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Archivage légal</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Horodatage</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Audit trail</span>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}










