'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw, Maximize } from 'lucide-react'

const tourSteps = [
  {
    title: 'Dashboard intuitif',
    description: 'Vue d\'ensemble de votre activité avec des métriques en temps réel',
    image: '/screenshots/dashboard.jpg',
    duration: '30s'
  },
  {
    title: 'Facturation simplifiée',
    description: 'Créez des factures professionnelles en quelques clics',
    image: '/screenshots/billing.jpg',
    duration: '45s'
  },
  {
    title: 'Gestion RH complète',
    description: 'Centralisez toutes les informations de vos employés',
    image: '/screenshots/people.jpg',
    duration: '40s'
  },
  {
    title: 'Documents automatisés',
    description: 'Générez vos contrats et documents juridiques automatiquement',
    image: '/screenshots/documents.jpg',
    duration: '35s'
  }
]

export function ProductTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % tourSteps.length)
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + tourSteps.length) % tourSteps.length)
  }

  return (
    <section id="product-tour" className="py-20 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            🎥 Démo interactive
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Découvrez SimplRH en action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explorez nos fonctionnalités à travers une visite guidée de la plateforme.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Video/Demo Area */}
            <div className="order-2 lg:order-1">
              <Card className="overflow-hidden shadow-2xl">
                <div className="relative bg-gray-900 aspect-video">
                  {/* Placeholder for actual screenshot */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="bg-white/20 rounded-full p-6 inline-block mb-4">
                        <Play className="h-12 w-12" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">
                        {tourSteps[currentStep].title}
                      </h3>
                      <p className="text-blue-100">
                        Capture d'écran de la fonctionnalité
                      </p>
                    </div>
                  </div>

                  {/* Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCurrentStep(0)}
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div 
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Steps Navigation */}
            <div className="order-1 lg:order-2">
              <div className="space-y-4">
                {tourSteps.map((step, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-300 ${
                      index === currentStep 
                        ? 'ring-2 ring-blue-500 shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          index === currentStep
                            ? 'bg-blue-500 text-white'
                            : index < currentStep
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-semibold transition-colors ${
                              index === currentStep ? 'text-blue-600' : 'text-gray-900'
                            }`}>
                              {step.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex-1"
                >
                  Précédent
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1"
                >
                  {currentStep === tourSteps.length - 1 ? 'Recommencer' : 'Suivant'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
