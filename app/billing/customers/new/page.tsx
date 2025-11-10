import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  FileText,
  Globe,
  Calendar
} from 'lucide-react'

export default function NewCustomerPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/billing/customers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux clients
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouveau client</h1>
            <p className="text-gray-600 mt-2">Ajoutez un nouveau client à votre portefeuille</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            Brouillon
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Créer le client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informations de l'entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Nom de l'entreprise *</Label>
                  <Input 
                    id="company-name"
                    placeholder="TechStart SAS"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company-type">Type d'entreprise</Label>
                  <select 
                    id="company-type"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="sarl">SARL</option>
                    <option value="sas">SAS</option>
                    <option value="sa">SA</option>
                    <option value="eurl">EURL</option>
                    <option value="sasu">SASU</option>
                    <option value="ei">Entreprise Individuelle</option>
                    <option value="micro">Micro-entreprise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siret">SIRET</Label>
                  <Input 
                    id="siret"
                    placeholder="12345678901234"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="vat-number">Numéro de TVA</Label>
                  <Input 
                    id="vat-number"
                    placeholder="FR12345678901"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ape-code">Code APE/NAF</Label>
                  <Input 
                    id="ape-code"
                    placeholder="6201Z"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Site web</Label>
                  <Input 
                    id="website"
                    type="url"
                    placeholder="https://www.techstart.fr"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company-address">Adresse de l'entreprise</Label>
                <Textarea 
                  id="company-address"
                  placeholder="123 Avenue des Champs-Élysées&#10;75008 Paris"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="postal-code">Code postal</Label>
                  <Input 
                    id="postal-code"
                    placeholder="75008"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input 
                    id="city"
                    placeholder="Paris"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Pays</Label>
                  <select 
                    id="country"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FR">France</option>
                    <option value="BE">Belgique</option>
                    <option value="CH">Suisse</option>
                    <option value="LU">Luxembourg</option>
                    <option value="DE">Allemagne</option>
                    <option value="ES">Espagne</option>
                    <option value="IT">Italie</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact principal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-first-name">Prénom *</Label>
                  <Input 
                    id="contact-first-name"
                    placeholder="Marie"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact-last-name">Nom *</Label>
                  <Input 
                    id="contact-last-name"
                    placeholder="Dubois"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-position">Fonction</Label>
                  <Input 
                    id="contact-position"
                    placeholder="Directrice Générale"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-department">Service</Label>
                  <Input 
                    id="contact-department"
                    placeholder="Direction"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-email">Email *</Label>
                  <Input 
                    id="contact-email"
                    type="email"
                    placeholder="marie.dubois@techstart.fr"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Téléphone</Label>
                  <Input 
                    id="contact-phone"
                    type="tel"
                    placeholder="01 23 45 67 89"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-mobile">Mobile</Label>
                  <Input 
                    id="contact-mobile"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-language">Langue préférée</Label>
                  <select 
                    id="contact-language"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="es">Español</option>
                    <option value="it">Italiano</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Paramètres de facturation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment-terms">Délai de paiement</Label>
                  <select 
                    id="payment-terms"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="30">30 jours</option>
                    <option value="45">45 jours</option>
                    <option value="60">60 jours</option>
                    <option value="0">Comptant</option>
                    <option value="15">15 jours</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="vat-rate">Taux de TVA</Label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Devise</Label>
                  <select 
                    id="currency"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar ($)</option>
                    <option value="GBP">Livre (£)</option>
                    <option value="CHF">Franc suisse (CHF)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="credit-limit">Limite de crédit</Label>
                  <Input 
                    id="credit-limit"
                    type="number"
                    placeholder="50000"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="billing-address">Adresse de facturation</Label>
                <Textarea 
                  id="billing-address"
                  placeholder="Si différente de l'adresse de l'entreprise..."
                  className="mt-1"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Laisser vide pour utiliser l'adresse de l'entreprise
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-reminder">Relances automatiques</Label>
                    <p className="text-sm text-gray-600">Activer les relances de paiement automatiques</p>
                  </div>
                  <Switch id="auto-reminder" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-invoices">Envoi par email</Label>
                    <p className="text-sm text-gray-600">Envoyer automatiquement les factures par email</p>
                  </div>
                  <Switch id="email-invoices" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes et informations complémentaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="notes">Notes internes</Label>
                <Textarea 
                  id="notes"
                  placeholder="Informations importantes sur ce client..."
                  className="mt-1"
                  rows={4}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ces notes ne seront visibles que par votre équipe
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Date de création: {new Date().toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="h-4 w-4" />
                <span>Statut: Nouveau client</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CreditCard className="h-4 w-4" />
                <span>Factures: 0</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Créer une facture
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Envoyer un email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Programmer un appel
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Conseils</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <p>• Les champs marqués d'un * sont obligatoires</p>
              <p>• Le SIRET permet la validation automatique des informations</p>
              <p>• Configurez les relances automatiques pour optimiser vos encaissements</p>
              <p>• Les notes internes vous aident à suivre l'historique client</p>
            </CardContent>
          </Card>

          {/* Customer Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Catégorie client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="category" value="prospect" className="rounded" />
                  <span className="text-sm">Prospect</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="category" value="new" className="rounded" defaultChecked />
                  <span className="text-sm">Nouveau client</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="category" value="regular" className="rounded" />
                  <span className="text-sm">Client régulier</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="category" value="vip" className="rounded" />
                  <span className="text-sm">Client VIP</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" asChild>
          <Link href="/billing/customers">
            Annuler
          </Link>
        </Button>
        <div className="flex gap-3">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder en brouillon
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Créer le client
          </Button>
        </div>
      </div>
    </div>
  )
}









