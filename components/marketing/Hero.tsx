'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  CheckCircle, 
  CreditCard, 
  Users, 
  FileText,
  Play,
  Star
} from 'lucide-react'

export function Hero() {

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-16 sm:pt-24 sm:pb-20">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12">
            <div className="h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-3xl" />
          </div>
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12">
            <div className="h-96 w-96 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl" />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
              Noté 4.8/5 par 500+ entreprises françaises
            </Badge>

            {/* Main heading */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              La suite admin qui{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                simplifie
              </span>{' '}
              votre PME
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
              <strong>Facturation</strong>, <strong>RH</strong> et <strong>Documents juridiques</strong> 
              {' '}réunis dans une seule plateforme. 
              Conçu pour les entrepreneurs français qui veulent se concentrer sur l'essentiel.
            </p>

            {/* Key benefits */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>PDF + XML Factur-X</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Exports Silae/PayFit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Templates juridiques</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-4 text-lg"
                >
                  Essayer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/auth/login">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto px-8 py-4 text-lg"
                >
                  Se connecter
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 text-sm text-gray-500">
              ✓ Essai gratuit 14 jours • ✓ Sans engagement • ✓ Support français
            </div>
          </div>

          {/* Product preview */}
          <div className="mt-16 sm:mt-20">
            <div className="mx-auto max-w-5xl">
              <div className="relative rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-gray-900/10">
                <div className="rounded-xl bg-gray-900/5 p-8">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {/* Billing module preview */}
                    <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-green-100 p-2">
                          <CreditCard className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Facturation</h3>
                          <p className="text-sm text-gray-500">PDF + Factur-X</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>FAC-2024-001</span>
                          <Badge variant="secondary">Envoyée</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>FAC-2024-002</span>
                          <Badge variant="default">Payée</Badge>
                        </div>
                      </div>
                    </div>

                    {/* People module preview */}
                    <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-blue-100 p-2">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">RH</h3>
                          <p className="text-sm text-gray-500">Congés & Paie</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Marie D.</span>
                          <Badge variant="secondary">CP en attente</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Export paie</span>
                          <Badge variant="default">Prêt</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Docs module preview */}
                    <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-purple-100 p-2">
                          <FileText className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Documents</h3>
                          <p className="text-sm text-gray-500">Juridiques</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Contrat presta</span>
                          <Badge variant="default">Généré</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>CGV e-commerce</span>
                          <Badge variant="secondary">Brouillon</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video demo button */}
          <div className="mt-12 text-center">
            <Link href="/features">
              <Button variant="outline" className="group">
                <Play className="mr-2 h-4 w-4 group-hover:text-blue-600" />
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </>
  )
}