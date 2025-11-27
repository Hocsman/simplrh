import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Users, 
  FileText, 
  Receipt,
  Calendar,
  UserCheck,
  FileCheck,
  Building,
  ChevronRight
} from 'lucide-react'

const modules = [
  {
    name: 'Facturation',
    icon: CreditCard,
    description: 'Créez, envoyez et suivez vos factures en quelques clics. Automatisez vos relances et gérez vos paiements.',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    features: [
      { icon: Receipt, text: 'Factures automatisées' },
      { icon: Calendar, text: 'Relances intelligentes' },
      { icon: CreditCard, text: 'Paiements en ligne' },
      { icon: FileCheck, text: 'Devis professionnels' }
    ],
    stats: [
      { label: 'Temps économisé', value: '3h/semaine' },
      { label: 'Taux de paiement', value: '+35%' }
    ]
  },
  {
    name: 'Gestion RH',
    icon: Users,
    description: 'Centralisez toutes les informations de vos employés, gérez les congés et optimisez votre organisation.',
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    features: [
      { icon: Users, text: 'Fiches employés' },
      { icon: Calendar, text: 'Gestion des congés' },
      { icon: UserCheck, text: 'Suivi des performances' },
      { icon: Building, text: 'Organigramme dynamique' }
    ],
    stats: [
      { label: 'Satisfaction RH', value: '98%' },
      { label: 'Erreurs réduites', value: '-67%' }
    ]
  },
  {
    name: 'Documents',
    icon: FileText,
    description: 'Générez automatiquement vos contrats, lettres et documents juridiques conformes à la législation.',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    features: [
      { icon: FileText, text: 'Templates juridiques' },
      { icon: FileCheck, text: 'Génération automatique' },
      { icon: Users, text: 'Signatures électroniques' },
      { icon: Building, text: 'Conformité garantie' }
    ],
    stats: [
      { label: 'Documents générés', value: '1000+' },
      { label: 'Conformité juridique', value: '100%' }
    ],
    badge: '✨ Nouveau'
  }
]

export function Modules() {
  return (
    <section id="modules" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Trois modules puissants, une seule plateforme
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez les modules dont vous avez besoin et faites évoluer votre solution 
            au rythme de votre croissance.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {modules.map((module, index) => {
            const Icon = module.icon
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden relative"
              >
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${module.gradient} p-6 text-white relative`}>
                  {module.badge && (
                    <Badge className="absolute top-4 right-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      {module.badge}
                    </Badge>
                  )}
                  
                  <Icon className="h-12 w-12 mb-4 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">{module.name}</h3>
                  <p className="text-white/90 leading-relaxed">{module.description}</p>
                </div>

                <CardContent className="p-6">
                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {module.features.map((feature, featureIndex) => {
                      const FeatureIcon = feature.icon
                      return (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg bg-${module.color}-100`}>
                            <FeatureIcon className={`h-4 w-4 text-${module.color}-600`} />
                          </div>
                          <span className="text-gray-700">{feature.text}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Stats */}
                  <div className="border-t pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      {module.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="text-center">
                          <div className={`text-2xl font-bold text-${module.color}-600`}>
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-6 border-t">
                    <button className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-${module.color}-50 text-${module.color}-700 hover:bg-${module.color}-100 transition-colors group`}>
                      En savoir plus
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Commencez avec un module, évoluez à votre rythme
          </h3>
          <p className="text-gray-600">
            Aucun engagement long terme. Ajoutez ou retirez des modules selon vos besoins.
          </p>
        </div>
      </div>
    </section>
  )
}
