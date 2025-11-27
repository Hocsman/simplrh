export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, AlertTriangle, CreditCard, Shield, Users, Gavel } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation - SimplRH',
  description: 'Consultez les conditions générales d\'utilisation de SimplRH.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SimplRH
          </Link>
          <Link href="/">
            <Button variant="outline">Retour à l'accueil</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <FileText className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl font-bold mb-4">Conditions Générales d'Utilisation</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Les règles d'utilisation de SimplRH pour une expérience sereine et sécurisée.
          </p>
          <p className="mt-4 opacity-75">Dernière mise à jour : 24 septembre 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Important Notice */}
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-orange-800">
                <AlertTriangle className="h-6 w-6" />
                Important
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700">
                En utilisant SimplRH, vous acceptez ces conditions générales d'utilisation. 
                Veuillez les lire attentivement avant d'utiliser nos services.
              </p>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Gavel className="h-6 w-6 text-blue-600" />
                Informations légales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-700">
                <p><strong>Société :</strong> SimplRH SAS</p>
                <p><strong>Capital social :</strong> 10 000 euros</p>
                <p><strong>RCS :</strong> Paris 123 456 789</p>
                <p><strong>SIRET :</strong> 12345678901234</p>
                <p><strong>TVA :</strong> FR12345678901</p>
                <p><strong>Adresse :</strong> 123 Rue de la Tech, 75001 Paris, France</p>
                <p><strong>Email :</strong> contact@simplrh.com</p>
                <p><strong>Directeur de publication :</strong> Jean Dupont</p>
                <p><strong>Hébergeur :</strong> Supabase Inc. (États-Unis) - Données hébergées en France</p>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-green-600" />
                Description des services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                SimplRH propose une suite logicielle SaaS comprenant :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Module Facturation :</strong> Création, envoi et suivi de factures</li>
                <li><strong>Module RH :</strong> Gestion des employés, congés et organisation</li>
                <li><strong>Module Documents :</strong> Génération de documents juridiques</li>
                <li><strong>Tableaux de bord :</strong> Suivi en temps réel de votre activité</li>
                <li><strong>API :</strong> Intégration avec vos outils existants</li>
                <li><strong>Support client :</strong> Assistance technique et métier</li>
              </ul>
            </CardContent>
          </Card>

          {/* Account Creation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Création de compte</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Vous devez fournir des informations exactes et à jour</li>
                <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
                <li>Un seul compte par utilisateur est autorisé</li>
                <li>L'utilisation est réservée aux professionnels et entreprises</li>
                <li>Vous devez être majeur ou représenter une personne morale</li>
                <li>SimplRH se réserve le droit de suspendre tout compte en cas d'usage frauduleux</li>
              </ul>
            </CardContent>
          </Card>

          {/* Usage Rules */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Règles d'utilisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Utilisations autorisées</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Usage professionnel des fonctionnalités proposées</li>
                    <li>Stockage de données d'entreprise légitimes</li>
                    <li>Génération de documents conformes à la législation française</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Utilisations interdites</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Contournement des mesures de sécurité</li>
                    <li>Usage pour des activités illégales ou frauduleuses</li>
                    <li>Transmission de contenus malveillants (virus, malware)</li>
                    <li>Violation des droits de propriété intellectuelle</li>
                    <li>Collecte non autorisée de données d'autres utilisateurs</li>
                    <li>Surcharge intentionnelle des systèmes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Billing */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-purple-600" />
                Tarifs et facturation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Les tarifs sont indiqués en euros TTC</li>
                <li>Facturation mensuelle ou annuelle selon l'abonnement choisi</li>
                <li>Paiement par carte bancaire via Stripe (sécurisé)</li>
                <li>Aucun remboursement sauf garantie de 30 jours pour les nouveaux clients</li>
                <li>Modification des tarifs avec préavis de 30 jours</li>
                <li>Suspension automatique en cas de défaut de paiement après 15 jours</li>
                <li>TVA française applicable (20%)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-600" />
                Données et confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Vos données vous appartiennent</li>
                <li>Hébergement sécurisé en France (conformité RGPD)</li>
                <li>Sauvegardes quotidiennes automatiques</li>
                <li>Chiffrement des données en transit et au repos</li>
                <li>Export de vos données possible à tout moment</li>
                <li>Suppression définitive 30 jours après résiliation</li>
                <li>Respect de la politique de confidentialité</li>
              </ul>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Disponibilité du service</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Objectif de disponibilité : 99,9% (hors maintenance programmée)</li>
                <li>Maintenances programmées notifiées 48h à l'avance</li>
                <li>Support technique du lundi au vendredi, 9h-18h</li>
                <li>Aucune garantie de disponibilité absolue</li>
                <li>SimplRH ne peut être tenu responsable des interruptions liées à des causes externes</li>
              </ul>
            </CardContent>
          </Card>

          {/* Liability */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Responsabilité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Responsabilité de SimplRH</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Fourniture du service selon les fonctionnalités décrites</li>
                    <li>Mise à jour et maintenance de la plateforme</li>
                    <li>Protection des données selon les standards de sécurité</li>
                    <li>Support technique dans les délais annoncés</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Responsabilité du client</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Exactitude des données saisies</li>
                    <li>Respect de la législation applicable</li>
                    <li>Sauvegarde complémentaire si nécessaire</li>
                    <li>Utilisation conforme aux présentes conditions</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Limitation de responsabilité :</strong> La responsabilité de SimplRH est limitée 
                    au montant des sommes versées au cours des 12 derniers mois.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Résiliation</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Résiliation possible à tout moment depuis votre compte</li>
                <li>Aucune pénalité de résiliation</li>
                <li>Service accessible jusqu'à la fin de la période payée</li>
                <li>Export de données possible pendant 30 jours après résiliation</li>
                <li>SimplRH peut résilier en cas de non-respect des conditions (préavis de 15 jours)</li>
                <li>Suppression définitive des données après 30 jours</li>
              </ul>
            </CardContent>
          </Card>

          {/* Applicable Law */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Droit applicable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Les présentes conditions sont régies par le droit français. 
                En cas de litige, les tribunaux de Paris seront seuls compétents.
              </p>
              <p className="text-gray-700">
                <strong>Médiation :</strong> En cas de litige, vous pouvez recourir à la médiation 
                de la consommation via la plateforme européenne de règlement en ligne des litiges.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Pour toute question juridique : <strong>legal@simplrh.com</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
