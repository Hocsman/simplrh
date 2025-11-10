'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Check, Star, Zap, Crown } from 'lucide-react'
import { SignupDialog } from '@/components/marketing/SignupDialog'

const plans = [
  {
    name: 'Starter',
    description: 'Parfait pour les freelances et petites entreprises',
    icon: Star,
    monthlyPrice: 29,
    yearlyPrice: 290,
    color: 'blue',
    features: [
      'Un module au choix',
      'Jusqu\'à 5 utilisateurs',
      'Stockage 10 GB',
      'Support email',
      'Rapports de base',
      'API limitée'
    ],
    limitations: [
      'Templates limités',
      'Exports mensuels limités'
    ]
  },
  {
    name: 'Professional',
    description: 'Idéal pour les entreprises en croissance',
    icon: Zap,
    monthlyPrice: 79,
    yearlyPrice: 790,
    color: 'green',
    popular: true,
    features: [
      'Tous les modules inclus',
      'Jusqu\'à 25 utilisateurs',
      'Stockage 100 GB',
      'Support prioritaire',
      'Rapports avancés',
      'API complète',
      'Intégrations tierces',
      'Templates premium',
      'Exports illimités',
      'Formations incluses'
    ]
  },
  {
    name: 'Enterprise',
    description: 'Pour les grandes organisations',
    icon: Crown,
    monthlyPrice: 199,
    yearlyPrice: 1990,
    color: 'purple',
    features: [
      'Tout de Professional',
      'Utilisateurs illimités',
      'Stockage illimité',
      'Support dédié 24/7',
      'Rapports personnalisés',
      'Intégrations sur mesure',
      'Formation sur site',
      'Conformité avancée',
      'SLA garantie',
      'Gestionnaire de compte'
    ]
  }
]

const additionalFeatures = [
  'Sauvegardes automatiques quotidiennes',
  'Chiffrement de niveau bancaire',
  'Conformité RGPD complète',
  'Hébergement en France',
  'Mises à jour automatiques',
  'Support technique français'
]

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  return (
    <>
      <section id="pricing" className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Des tarifs transparents et équitables
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choisissez le plan qui correspond à vos besoins. 
              Aucun frais caché, annulation possible à tout moment.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${!isYearly ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                Mensuel
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-green-600"
              />
              <span className={`text-sm ${isYearly ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                Annuel
              </span>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                -20%
              </Badge>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
              const originalPrice = isYearly ? plan.monthlyPrice * 12 : null

              return (
                <Card
                  key={index}
                  className={`relative hover:shadow-xl transition-all duration-300 ${
                    plan.popular 
                      ? 'ring-2 ring-green-500 shadow-lg scale-105 lg:scale-110' 
                      : 'hover:-translate-y-1'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500 text-white px-6 py-1">
                        ⭐ Le plus populaire
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center p-8">
                    <div className={`inline-flex p-3 rounded-xl bg-${plan.color}-100 mb-4`}>
                      <Icon className={`h-8 w-8 text-${plan.color}-600`} />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      {plan.description}
                    </CardDescription>

                    <div className="mt-6">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                          {price}€
                        </span>
                        <span className="text-gray-500">
                          /{isYearly ? 'an' : 'mois'}
                        </span>
                      </div>
                      
                      {isYearly && originalPrice && (
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="line-through">{originalPrice}€/an</span>
                          <span className="text-green-600 font-medium ml-2">
                            Économisez {originalPrice - price}€
                          </span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-8 pt-0">
                    <Button
                      className={`w-full mb-8 ${
                        plan.popular
                          ? 'bg-green-600 hover:bg-green-700'
                          : `bg-${plan.color}-600 hover:bg-${plan.color}-700`
                      }`}
                      onClick={() => setIsSignupOpen(true)}
                    >
                      {plan.name === 'Enterprise' ? 'Nous contacter' : 'Commencer l\'essai'}
                    </Button>

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations && (
                        <>
                          <div className="border-t pt-4 mt-4">
                            <p className="text-xs text-gray-500 mb-2">Limitations :</p>
                            {plan.limitations.map((limitation, limitIndex) => (
                              <div key={limitIndex} className="flex items-start gap-3">
                                <div className="h-5 w-5 flex-shrink-0 mt-0.5 flex items-center justify-center">
                                  <div className="h-1.5 w-1.5 bg-gray-400 rounded-full" />
                                </div>
                                <span className="text-gray-500 text-xs">{limitation}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Additional Features */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Inclus dans tous les plans
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 justify-center">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 rounded-full px-6 py-3">
              <div className="bg-green-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span className="text-green-700 font-medium">
                Garantie satisfait ou remboursé 30 jours
              </span>
            </div>
          </div>
        </div>
      </section>

      <SignupDialog open={isSignupOpen} onOpenChange={setIsSignupOpen} />
    </>
  )
}
