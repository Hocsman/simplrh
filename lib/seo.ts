import { Metadata } from 'next'

export const siteConfig = {
  name: "SimplRH",
  description: "La suite admin pour PME : Facturation, RH, Documents. Devis Factur-X, gestion des congés, exports paie et documents juridiques en une seule plateforme.",
  url: "https://simplrh.com",
  ogImage: "/opengraph-image.png",
  keywords: [
    "facturation",
    "factur-x",
    "gestion rh",
    "congés",
    "documents juridiques",
    "PME",
    "TPE",
    "Silae",
    "PayFit",
    "SaaS",
    "comptabilité"
  ]
}

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "SimplRH Team",
      url: siteConfig.url,
    }
  ],
  creator: "SimplRH",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@simplrh",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.svg",
    apple: "/apple-touch-icon.svg",
  },
  manifest: `/site.webmanifest`,
}

export function generateMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    ...defaultMetadata,
    ...overrides
  }
}

export function generateStructuredData(type: 'organization' | 'website' = 'organization') {
  if (type === 'organization') {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteConfig.name,
      "description": siteConfig.description,
      "url": siteConfig.url,
      "logo": `${siteConfig.url}/logo.png`,
      "sameAs": [
        "https://linkedin.com/company/simplrh",
        "https://twitter.com/simplrh"
      ]
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.name,
    "description": siteConfig.description,
    "url": siteConfig.url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }
}

export function generateSchemaMarkup() {
  return {
    organizationSchema: generateStructuredData('organization'),
    websiteSchema: generateStructuredData('website')
  }
}
