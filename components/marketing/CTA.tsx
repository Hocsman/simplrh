'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, Zap, Users, Star } from 'lucide-react'

export function CTA() {

  return (
    <>
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,black)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Badge */}
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm mb-6 px-6 py-2">
              ⚡ Offre limitée : 2 mois offerts sur l'abonnement annuel
            </Badge>

            {/* Main Title */}
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Prêt à simplifier votre{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                gestion d'entreprise
              </span>
              {' '}?
            </h2>

            <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed">
              Rejoignez plus de 500 entreprises qui ont déjà transformé 
              leur productivité avec SimplRH.
            </p>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="flex items-center gap-3 justify-center">
                <div className="bg-green-500 rounded-full p-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg">Essai gratuit 14 jours</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="bg-yellow-500 rounded-full p-2">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg">Configuration en 5 minutes</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="bg-pink-500 rounded-full p-2">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg">Support français dédié</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/signup">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto group shadow-xl"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/features">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto backdrop-blur-sm"
                >
                  Voir la démo
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-blue-100">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 sur 200+ avis</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/20" />
              <div>500+ entreprises clientes</div>
              <div className="hidden sm:block w-px h-6 bg-white/20" />
              <div>98% de satisfaction</div>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="hidden lg:block">
          <Card className="absolute top-20 left-10 w-64 shadow-2xl rotate-3 hover:rotate-0 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">Facture envoyée</span>
              </div>
              <p className="text-gray-600 text-sm">
                Facture #2024-001 envoyée automatiquement à TechStart SAS
              </p>
            </CardContent>
          </Card>

          <Card className="absolute bottom-20 right-10 w-64 shadow-2xl -rotate-3 hover:rotate-0 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">Congé validé</span>
              </div>
              <p className="text-gray-600 text-sm">
                Demande de congé de Marie approuvée pour le 15-20 octobre
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

    </>
  )
}
