import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { CTA } from '@/components/marketing/CTA'
import { generateMetadata } from '@/lib/seo'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CreditCard, 
  Users, 
  FileText, 
  Shield, 
  Zap, 
  Globe,
  CheckCircle,
  Download,
  Mail,
  BarChart3,
  Calendar,
  FileX,
  Smartphone,
  Cloud,
  Lock,
  Headphones,
  RefreshCw,
  ArrowRight
} from 'lucide-react'

export const metadata = generateMetadata({
  title: 'Fonctionnalités',
  description: 'Découvrez toutes les fonctionnalités de SimplRH : facturation Factur-X, gestion RH, génération de documents juridiques et bien plus.'
})

const billingFeatures = [
  {
    icon: CreditCard,
    title: 'Facturation complète',
    description: 'Créez devis et factures en quelques clics avec numérotation automatique'
  },
  {
    icon: FileX,
    title: 'PDF + Factur-X',
    description: 'Génération automatique PDF et XML Factur-X conforme à la norme européenne'
  },
  {
    icon: Mail,
    title: 'Envoi automatique',
    description: 'Emails transactionnels avec PDF en pièce jointe et suivi des ouvertures'
  },
  {
    icon: BarChart3,
    title: 'Suivi des paiements',
    description: 'Dashboard temps réel des factures payées, en attente et en retard'
  },
  {
    icon: RefreshCw,
    title: 'Relances automatiques',
    description: 'Système de relances programmées pour les factures impayées'
  },
  {
    icon: Zap,
    title: 'Intégration Stripe',
    description: 'Paiements en ligne sécurisés avec portail client intégré'
  }
]

const peopleFeatures = [
  {
    icon: Users,
    title: 'Gestion des employés',
    description: 'Base de données complète avec informations personnelles et professionnelles'
  },
  {
    icon: Calendar,
    title: 'Congés & absences',
    description: 'Workflow de validation avec notifications automatiques aux managers'
  },
  {
    icon: Download,
    title: 'Exports paie',
    description: 'Formats Silae et PayFit CSV pour intégration directe avec votre logiciel de paie'
  },
  {
    icon: BarChart3,
    title: 'Tableaux de bord RH',
    description: 'Statistiques et métriques RH : taux d\'absentéisme, soldes congés, etc.'
  },
  {
    icon: Calendar,
    title: 'Planning équipes',
    description: 'Vue calendrier des congés et absences pour optimiser la planification'
  },
  {
    icon: Shield,
    title: 'Conformité RGPD',
    description: 'Gestion sécurisée des données personnelles avec consentements'
  }
]

const docsFeatures = [
  {
    icon: FileText,
    title: 'Templates juridiques',
    description: 'Bibliothèque de modèles : contrats, CGV, mises en demeure, RGPD'
  },
  {
    icon: Zap,
    title: 'Génération automatique',
    description: 'Formulaires intelligents qui génèrent vos documents en PDF/DOCX'
  },
  {
    icon: Shield,
    title: 'Conformité légale',
    description: 'Documents validés par des juristes et mis à jour selon la législation'
  },
  {
    icon: Download,
    title: 'Multi-formats',
    description: 'Export PDF pour signature électronique et DOCX pour modification'
  },
  {
    icon: Cloud,
    title: 'Stockage sécurisé',
    description: 'Vos documents sont stockés de façon sécurisée et accessibles partout'
  },
  {
    icon: RefreshCw,
    title: 'Versions & historique',
    description: 'Suivi des versions et historique complet de vos générations'
  }
]

const platformFeatures = [
  {
    icon: Smartphone,
    title: 'Interface moderne',
    description: 'Design responsive optimisé pour desktop, tablette et mobile'
  },
  {
    icon: Lock,
    title: 'Sécurité bancaire',
    description: 'Chiffrement bout en bout et hébergement sécurisé en France'
  },
  {
    icon: Globe,
    title: 'Multi-utilisateurs',
    description: 'Gestion des droits et permissions par rôle (admin, manager, employé...)'
  },
  {
    icon: Cloud,
    title: 'Sauvegarde auto',
    description: 'Vos données sont sauvegardées automatiquement et en temps réel'
  },
  {
    icon: Headphones,
    title: 'Support français',
    description: 'Équipe support basée en France, réponse sous 24h garantie'
  },
  {
    icon: RefreshCw,
    title: 'Mises à jour auto',
    description: 'Nouvelles fonctionnalités et corrections déployées automatiquement'
  }
]

export default function FeaturesPage() {
  return (
    <>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-6 px-4 py-2">
                ✨ Toutes les fonctionnalités
              </Badge>
              
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Une suite complète pour simplifier votre gestion d'entreprise
              </h1>
              
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Découvrez comment SimplRH révolutionne la gestion administrative des PME françaises 
                avec des outils intégrés et conformes à la législation.
              </p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Conforme RGPD</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Hébergé en France</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Support français</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Mises à jour gratuites</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Module Facturation */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="rounded-full bg-green-100 p-3">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Module Facturation</h2>
              </div>
              <p className="text-lg text-gray-600">
                Gérez toute votre facturation avec génération PDF et XML Factur-X automatique, 
                conforme aux normes européennes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {billingFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-100 p-2">
                        <feature.icon className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Module RH */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="rounded-full bg-blue-100 p-3">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Module Ressources Humaines</h2>
              </div>
              <p className="text-lg text-gray-600">
                Simplifiez la gestion de vos équipes avec un workflow de congés intégré 
                et des exports compatibles avec vos logiciels de paie.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {peopleFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-100 p-2">
                        <feature.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Module Documents */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="rounded-full bg-purple-100 p-3">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Module Documents Juridiques</h2>
              </div>
              <p className="text-lg text-gray-600">
                Générez automatiquement vos documents juridiques professionnels 
                avec des templates validés par des juristes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {docsFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-purple-100 p-2">
                        <feature.icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fonctionnalités Plateforme */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Une plateforme pensée pour vous
              </h2>
              <p className="text-lg text-gray-600">
                Au-delà des fonctionnalités métier, SimplRH vous offre une expérience 
                utilisateur moderne et sécurisée.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platformFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-gray-100 p-2">
                        <feature.icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Intégrations */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Intégrations natives
              </h2>
              <p className="text-lg text-gray-600">
                SimplRH s'intègre parfaitement dans votre écosystème existant
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="text-center">
                <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Stripe</h3>
                  <p className="text-sm text-gray-500">Paiements en ligne</p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
                    <Download className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Silae</h3>
                  <p className="text-sm text-gray-500">Export paie CSV</p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 mx-auto mb-3 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Download className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">PayFit</h3>
                  <p className="text-sm text-gray-500">Export paie CSV</p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 mx-auto mb-3 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileX className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Factur-X</h3>
                  <p className="text-sm text-gray-500">Norme européenne</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Example */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Un workflow simplifié
              </h2>
              <p className="text-lg text-gray-600">
                De la création à l'envoi, tout est automatisé
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Créez</h3>
                <p className="text-sm text-gray-600">Facture, demande de congé ou document en quelques clics</p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Générez</h3>
                <p className="text-sm text-gray-600">PDF, XML Factur-X ou export CSV automatiquement</p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Envoyez</h3>
                <p className="text-sm text-gray-600">Email automatique avec pièces jointes et suivi</p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Suivez</h3>
                <p className="text-sm text-gray-600">Dashboard temps réel et notifications automatiques</p>
              </div>
            </div>
          </div>
        </section>

        <CTA />
      </main>
      
      <Footer />
    </>
  )
}












