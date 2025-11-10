import { Card, CardContent } from '@/components/ui/card'
import { 
  Clock, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp, 
  Heart,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

const benefits = [
  {
    icon: Clock,
    title: 'Gagnez du temps',
    description: 'Automatisez vos tâches répétitives et concentrez-vous sur l\'essentiel',
    stat: '5h/semaine économisées',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    icon: Shield,
    title: 'Conformité garantie',
    description: 'Respectez automatiquement toutes les réglementations françaises',
    stat: '100% conforme RGPD',
    color: 'text-green-600 bg-green-100'
  },
  {
    icon: Zap,
    title: 'Productivité boostée',
    description: 'Augmentez l\'efficacité de vos équipes avec des outils intuitifs',
    stat: '+47% productivité',
    color: 'text-purple-600 bg-purple-100'
  },
  {
    icon: Users,
    title: 'Collaboration fluide',
    description: 'Facilitez le travail d\'équipe avec des espaces de travail partagés',
    stat: '95% satisfaction équipe',
    color: 'text-orange-600 bg-orange-100'
  },
  {
    icon: TrendingUp,
    title: 'Croissance maîtrisée',
    description: 'Pilotez votre croissance avec des tableaux de bord en temps réel',
    stat: '+32% chiffre d\'affaires',
    color: 'text-emerald-600 bg-emerald-100'
  },
  {
    icon: Heart,
    title: 'Support exceptionnel',
    description: 'Bénéficiez d\'un support français réactif et personnalisé',
    stat: '<2h temps de réponse',
    color: 'text-pink-600 bg-pink-100'
  }
]

export function Benefits() {
  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Pourquoi choisir SimplRH ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment nos clients transforment leur gestion administrative 
            et développent leur entreprise plus sereinement.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
              >
                <CardContent className="p-8">
                  <div className={`inline-flex p-3 rounded-xl ${benefit.color} mb-6`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-gray-700">
                        {benefit.stat}
                      </span>
                    </div>
                    
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm border">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-gray-700 font-medium">
              Résultats garantis ou remboursé sous 30 jours
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
