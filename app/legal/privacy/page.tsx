export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Eye, Database, Users, FileText, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité - SimplRH',
  description: 'Découvrez comment SimplRH protège vos données personnelles et respecte votre vie privée.',
}

export default function PrivacyPage() {
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
          <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl font-bold mb-4">Politique de Confidentialité</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Votre vie privée est notre priorité. Découvrez comment nous protégeons vos données.
          </p>
          <p className="mt-4 opacity-75">Dernière mise à jour : 24 septembre 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* RGPD Compliance */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-800">
                <CheckCircle className="h-6 w-6" />
                Conformité RGPD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                SimplRH est entièrement conforme au Règlement Général sur la Protection des Données (RGPD). 
                Vos données sont hébergées en France et traitées selon les standards européens les plus stricts.
              </p>
            </CardContent>
          </Card>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              SimplRH SAS, société par actions simplifiée au capital de 10 000 euros, 
              immatriculée au RCS de Paris sous le numéro 123 456 789, dont le siège social 
              est situé au 123 Rue de la Tech, 75001 Paris, France, s'engage à protéger 
              la vie privée de ses utilisateurs.
            </p>
          </div>

          {/* Data Collection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="h-6 w-6 text-blue-600" />
                Données collectées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Données personnelles</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Nom, prénom, adresse e-mail</li>
                  <li>Informations de l'entreprise</li>
                  <li>Données de facturation</li>
                  <li>Informations RH (employés, congés, etc.)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Données techniques</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Adresse IP, type de navigateur</li>
                  <li>Données d'utilisation et de navigation</li>
                  <li>Cookies et technologies similaires</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-green-600" />
                Utilisation des données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fournir et améliorer nos services</li>
                <li>Traiter vos demandes et assurer le support client</li>
                <li>Envoyer des communications importantes sur le service</li>
                <li>Respecter nos obligations légales et comptables</li>
                <li>Prévenir la fraude et assurer la sécurité</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-purple-600" />
                Partage des données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données uniquement dans les cas suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Avec des prestataires de services (hébergement, paiement) sous contrat strict</li>
                <li>Pour respecter une obligation légale ou une décision de justice</li>
                <li>Avec votre consentement explicite</li>
                <li>En cas de fusion ou acquisition (avec notification préalable)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-orange-600" />
                Vos droits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification</li>
                  <li>Droit à l'effacement ("droit à l'oubli")</li>
                  <li>Droit à la limitation du traitement</li>
                </ul>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d'opposition</li>
                  <li>Droit de retirer votre consentement</li>
                  <li>Droit de déposer une plainte (CNIL)</li>
                </ul>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Pour exercer vos droits, contactez-nous à : 
                  <strong> privacy@simplrh.fr</strong> ou par courrier à notre adresse.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Sécurité des données</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Chiffrement SSL/TLS pour toutes les communications</li>
                <li>Chiffrement des données au repos (AES-256)</li>
                <li>Authentification à deux facteurs disponible</li>
                <li>Sauvegardes chiffrées et redondantes</li>
                <li>Surveillance 24/7 de nos systèmes</li>
                <li>Audits de sécurité réguliers</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Cookies et traceurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Nous utilisons des cookies pour améliorer votre expérience :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site</li>
                <li><strong>Cookies de performance :</strong> Statistiques d'utilisation anonymes</li>
                <li><strong>Cookies de préférences :</strong> Sauvegarde de vos paramètres</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Vous pouvez gérer vos préférences via notre bandeau de cookies ou les paramètres de votre navigateur.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant cette politique de confidentialité :
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email :</strong> privacy@simplrh.fr</p>
                <p><strong>Adresse :</strong> SimplRH SAS, 123 Rue de la Tech, 75001 Paris, France</p>
                <p><strong>DPO :</strong> dpo@simplrh.fr</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
