import { Header } from '@/components/marketing/Header'
import { Hero } from '@/components/marketing/Hero'
import { Benefits } from '@/components/marketing/Benefits'
import { Modules } from '@/components/marketing/Modules'
import { ProductTour } from '@/components/marketing/ProductTour'
import { Pricing } from '@/components/marketing/Pricing'
import { Testimonials } from '@/components/marketing/Testimonials'
import { FAQ } from '@/components/marketing/FAQ'
import { CTA } from '@/components/marketing/CTA'
import { Footer } from '@/components/marketing/Footer'
import { generateMetadata, generateStructuredData } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = generateMetadata({
  title: 'Accueil'
})

export default function HomePage() {
  const structuredData = generateStructuredData('organization')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      <Header />
      <main>
        <Hero />
        <Benefits />
        <Modules />
        <ProductTour />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      
      <Footer />
    </>
  )
}



