import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Youtube,
  Heart,
  Shield
} from 'lucide-react'

const footerLinks = {
  product: {
    title: 'Produit',
    links: [
      { name: 'Fonctionnalités', href: '/features' },
      { name: 'Démo', href: '/demo' },
      { name: 'Tarifs', href: '/pricing' },
      { name: 'Sécurité', href: '/security' },
      { name: 'Intégrations', href: '/integrations' }
    ]
  },
  resources: {
    title: 'Ressources',
    links: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API', href: '/api-docs' },
      { name: 'Guides', href: '/guides' },
      { name: 'Blog', href: '/blog' },
      { name: 'Webinaires', href: '/webinars' }
    ]
  },
  support: {
    title: 'Support',
    links: [
      { name: 'Centre d\'aide', href: '/help' },
      { name: 'Nous contacter', href: '/contact' },
      { name: 'Status', href: '/status' },
      { name: 'Communauté', href: '/community' },
      { name: 'Formation', href: '/training' }
    ]
  },
  company: {
    title: 'Entreprise',
    links: [
      { name: 'À propos', href: '/about' },
      { name: 'Carrières', href: '/careers' },
      { name: 'Presse', href: '/press' },
      { name: 'Partenaires', href: '/partners' },
      { name: 'Investisseurs', href: '/investors' }
    ]
  }
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold text-blue-400 mb-4 block">
              SimplRH
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              La suite RH et administrative complète pour les entreprises françaises. 
              Simplifiez votre gestion, boostez votre productivité.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">contact@simplrh.fr</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">Paris, France</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
              >
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">
                Restez informé des nouveautés
              </h3>
              <p className="text-gray-400">
                Recevez nos conseils et mises à jour produit
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>© 2024 SimplRH. Tous droits réservés.</span>
              <div className="flex items-center gap-1">
                <span>Fait avec</span>
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                <span>en France</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link 
                href="/privacy" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Confidentialité
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                CGU
              </Link>
              <Link 
                href="/cookies" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookies
              </Link>
              <div className="flex items-center gap-2 text-green-400">
                <Shield className="h-4 w-4" />
                <span>RGPD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
