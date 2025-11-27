'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, ArrowRight, CheckCircle } from 'lucide-react'
import { SignupDialog } from '@/components/marketing/SignupDialog'

export function Hero() {
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
                ✨ Nouveau : Module Documents automatisés
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Simplifiez votre{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  gestion RH
                </span>{' '}
                et administrative
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Une suite complète pour gérer votre facturation, vos équipes et vos documents juridiques. 
                Tout ce dont vous avez besoin pour faire grandir votre entreprise en toute sérénité.
              </p>

              {/* Benefits */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Essai gratuit 14 jours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Configuration en 5 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Support français</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  onClick={() => setIsSignupOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg group"
                >
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>                <Button 
                  variant="outline" 
                  size="lg"
                  className="group"
                  asChild
                >
                  <Link href="/demo">
                    <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Voir la démo
                  </Link>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Rejoint par 500+ entreprises françaises</p>
                <div className="flex items-center justify-center lg:justify-start space-x-8 opacity-60">
                  <div className="bg-gray-200 h-8 w-20 rounded"></div>
                  <div className="bg-gray-200 h-8 w-20 rounded"></div>
                  <div className="bg-gray-200 h-8 w-20 rounded"></div>
                  <div className="bg-gray-200 h-8 w-20 rounded"></div>
                </div>
              </div>
            </div>

            {/* Screenshot/Demo */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl border p-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg h-64 lg:h-80 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="bg-white/20 rounded-full p-4 inline-block mb-4">
                      <Play className="h-8 w-8" />
                    </div>
                    <p className="text-lg font-medium">Aperçu de SimplRH</p>
                    <p className="text-blue-100 mt-2">Dashboard intuitif et moderne</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full p-2 shadow-lg">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white rounded-lg p-3 shadow-lg">
                <span className="text-sm font-medium">+47% productivité</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SignupDialog open={isSignupOpen} onOpenChange={setIsSignupOpen} />
    </>
  )
}
