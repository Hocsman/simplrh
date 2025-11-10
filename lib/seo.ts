import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  noIndex?: boolean
}

const defaultTitle = 'SimplRH - La suite admin pour PME'
const defaultDescription = 'Simplifiez votre gestion d\'entreprise avec SimplRH : Facturation, RH, Documents juridiques. Solution tout-en-un pour PME françaises.'
const defaultKeywords = [
  'SimplRH',
  'gestion entreprise',
  'facturation',
  'RH',
  'ressources humaines',
  'documents juridiques',
  'PME',
  'SaaS',
  'France',
  'factur-x',
  'congés',
  'paie'
]

export function generateMetadata({
  title,
  description = defaultDescription,
  keywords = defaultKeywords,
  canonical,
  ogImage,
  noIndex = false
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | SimplRH` : defaultTitle
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://simplrh.com'
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    
    openGraph: {
      title: fullTitle,
      description,
      url: canonical ? `${baseUrl}${canonical}` : baseUrl,
      siteName: 'SimplRH',
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle
        }
      ] : [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'SimplRH - La suite admin pour PME'
        }
      ],
      locale: 'fr_FR',
      type: 'website'
    },
    
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : [`${baseUrl}/og-image.png`],
      creator: '@simplrh'
    },
    
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : baseUrl
    },
    
    authors: [
      {
        name: 'SimplRH',
        url: baseUrl
      }
    ],
    
    category: 'Business Software'
  }
}

export function generateStructuredData(type: 'organization' | 'faq' | 'product', data?: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://simplrh.com'
  
  switch (type) {
    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'SimplRH',
        description: defaultDescription,
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+33-1-23-45-67-89',
          contactType: 'Customer Service',
          availableLanguage: 'French'
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '123 Rue de la Tech',
          addressLocality: 'Paris',
          postalCode: '75001',
          addressCountry: 'FR'
        },
        sameAs: [
          'https://twitter.com/simplrh',
          'https://linkedin.com/company/simplrh'
        ]
      }
      
    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data?.faqs?.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        })) || []
      }
      
    case 'product':
      return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'SimplRH',
        description: defaultDescription,
        url: baseUrl,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '29',
          priceCurrency: 'EUR',
          priceValidUntil: '2025-12-31',
          availability: 'https://schema.org/InStock'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '150'
        }
      }
      
    default:
      return null
  }
}

export const pageTitles = {
  home: 'Accueil',
  features: 'Fonctionnalités',
  pricing: 'Tarifs',
  login: 'Connexion',
  signup: 'Inscription',
  dashboard: 'Tableau de bord',
  billing: 'Facturation',
  people: 'Ressources Humaines',
  docs: 'Documents',
  settings: 'Paramètres',
  privacy: 'Politique de confidentialité',
  terms: 'Conditions d\'utilisation'
}

export const pageDescriptions = {
  home: 'SimplRH simplifie la gestion de votre entreprise avec des outils de facturation, RH et documents juridiques intégrés.',
  features: 'Découvrez toutes les fonctionnalités de SimplRH : facturation Factur-X, gestion RH, génération de documents juridiques.',
  pricing: 'Choisissez le plan SimplRH adapté à votre entreprise. À partir de 29€/mois, sans engagement.',
  login: 'Connectez-vous à votre espace SimplRH pour gérer votre entreprise.',
  signup: 'Créez votre compte SimplRH gratuit et commencez à simplifier votre gestion d\'entreprise.',
  dashboard: 'Vue d\'ensemble de votre activité : factures, congés, documents récents.',
  billing: 'Gérez vos factures, devis et paiements avec la facturation Factur-X intégrée.',
  people: 'Gérez vos équipes, demandes de congés et exports paie Silae/PayFit.',
  docs: 'Générez des documents juridiques professionnels : contrats, CGV, mises en demeure.',
  settings: 'Configurez votre organisation et gérez vos paramètres SimplRH.',
  privacy: 'Politique de confidentialité de SimplRH - Protection de vos données personnelles.',
  terms: 'Conditions générales d\'utilisation de SimplRH - Vos droits et obligations.'
}