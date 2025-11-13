import { Pricing } from '@/components/marketing/Pricing'
import { FAQ } from '@/components/marketing/FAQ'
import { CTA } from '@/components/marketing/CTA'
import { Footer } from '@/components/marketing/Footer'
import { Header } from '@/components/marketing/Header'
import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
  title: 'Tarifs',
  description: 'Choisissez le plan SimplRH adapté à votre entreprise. À partir de 29€/mois, sans engagement. Essai gratuit 14 jours.',
  canonical: '/pricing'
})

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Choisissez votre plan
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Des tarifs transparents et adaptés à la taille de votre entreprise. 
                Commencez gratuitement, sans engagement.
              </p>
              
              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Essai gratuit 14 jours</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Sans engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Support français inclus</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Pricing />
        
        {/* Additional benefits */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">
                Tous les plans incluent
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="rounded-full bg-blue-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sécurité garantie</h3>
                  <p className="text-gray-600">Hébergement en France, RGPD, chiffrement bout en bout</p>
                </div>
                
                <div className="text-center">
                  <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Support réactif</h3>
                  <p className="text-gray-600">Équipe française, réponse sous 24h, formations incluses</p>
                </div>
                
                <div className="text-center">
                  <div className="rounded-full bg-purple-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Mises à jour gratuites</h3>
                  <p className="text-gray-600">Nouvelles fonctionnalités, conformité légale, améliorations</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}












