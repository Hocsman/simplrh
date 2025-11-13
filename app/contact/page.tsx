'use client'

import { useState } from 'react'
import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { generateMetadata } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Headphones,
  FileQuestion,
  Users,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

// Note: This would normally be generated server-side
// export const metadata = generateMetadata({
//   title: 'Contact',
//   description: 'Contactez l\'équipe SimplRH pour toute question sur notre suite de gestion administrative. Support français, réponse sous 24h.',
//   canonical: '/contact'
// })

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    description: 'Réponse sous 24h garantie',
    value: 'support@simplrh.com',
    action: 'mailto:support@simplrh.com',
    color: 'blue'
  },
  {
    icon: Phone,
    title: 'Téléphone',
    description: 'Du lundi au vendredi, 9h-18h',
    value: '+33 1 23 45 67 89',
    action: 'tel:+33123456789',
    color: 'green'
  },
  {
    icon: MessageCircle,
    title: 'Chat en direct',
    description: 'Disponible pendant les heures ouvrables',
    value: 'Démarrer une conversation',
    action: '#',
    color: 'purple'
  }
]

const supportTypes = [
  {
    icon: Headphones,
    title: 'Support technique',
    description: 'Problèmes de connexion, bugs, fonctionnalités',
    badge: 'Prioritaire'
  },
  {
    icon: FileQuestion,
    title: 'Questions générales',
    description: 'Informations sur les fonctionnalités, tarifs',
    badge: '24h'
  },
  {
    icon: Users,
    title: 'Ventes & Démos',
    description: 'Découvrir SimplRH, demander une démonstration',
    badge: 'Immédiat'
  }
]

const faqs = [
  {
    question: 'Comment démarrer avec SimplRH ?',
    answer: 'Créez votre compte gratuit, configurez votre organisation en 5 minutes, et commencez à utiliser tous les modules pendant 14 jours.'
  },
  {
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Oui, nous utilisons un chiffrement de niveau bancaire et hébergeons vos données en France, en conformité RGPD.'
  },
  {
    question: 'Puis-je importer mes données existantes ?',
    answer: 'Absolument ! Notre équipe vous accompagne gratuitement dans la migration de vos données depuis votre solution actuelle.'
  },
  {
    question: 'Y a-t-il des frais cachés ?',
    answer: 'Non, nos tarifs sont transparents. Pas de frais de setup, pas de coûts cachés. Vous ne payez que votre abonnement mensuel.'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    type: 'general'
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Message envoyé !',
        description: 'Nous vous répondrons dans les 24h. Merci pour votre message.'
      })
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        type: 'general'
      })
      setLoading(false)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-6 px-4 py-2">
                📞 Support français
              </Badge>
              
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Contactez-nous
              </h1>
              
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Notre équipe française est là pour répondre à toutes vos questions sur SimplRH. 
                Réponse garantie sous 24h.
              </p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Réponse sous 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Support en français</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Équipe basée en France</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Plusieurs façons de nous joindre
              </h2>
              <p className="text-lg text-gray-600">
                Choisissez le moyen de contact qui vous convient le mieux
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className={`rounded-full bg-${method.color}-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                      <method.icon className={`h-8 w-8 text-${method.color}-600`} />
                    </div>
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                    <p className="text-gray-600">{method.description}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <a 
                      href={method.action}
                      className={`text-${method.color}-600 font-semibold hover:text-${method.color}-700 flex items-center justify-center gap-2`}
                    >
                      {method.value}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Envoyez-nous un message
                </h2>
                <p className="text-gray-600 mb-8">
                  Décrivez votre besoin et nous vous répondrons rapidement avec une solution adaptée.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jean@entreprise.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Entreprise
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Mon Entreprise SARL"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Type de demande
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="general">Question générale</option>
                      <option value="support">Support technique</option>
                      <option value="sales">Ventes & Démonstration</option>
                      <option value="billing">Facturation</option>
                      <option value="partnership">Partenariat</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Objet de votre message"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre besoin ou votre question..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Envoyer le message
                      </div>
                    )}
                  </Button>
                </form>
              </div>

              {/* Company Info & Support Types */}
              <div className="space-y-8">
                
                {/* Company Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Informations société
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">SimplRH SAS</h4>
                      <p className="text-gray-600">123 Rue de la Tech</p>
                      <p className="text-gray-600">75001 Paris, France</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Horaires support
                      </h4>
                      <p className="text-gray-600">Lundi - Vendredi : 9h00 - 18h00</p>
                      <p className="text-gray-600">Weekend : Urgences uniquement</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Support Types */}
                <Card>
                  <CardHeader>
                    <CardTitle>Types de support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {supportTypes.map((type, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                          <div className="rounded-full bg-blue-100 p-2">
                            <type.icon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">{type.title}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {type.badge}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Questions fréquentes
              </h2>
              <p className="text-lg text-gray-600">
                Les réponses aux questions les plus courantes sur SimplRH
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                Vous ne trouvez pas la réponse à votre question ?
              </p>
              <Button variant="outline" asChild>
                <a href="mailto:support@simplrh.com">
                  <Mail className="h-4 w-4 mr-2" />
                  Contactez notre support
                </a>
              </Button>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </>
  )
}












