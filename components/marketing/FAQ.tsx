'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'

const faqs = [
  {
    category: 'Général',
    questions: [
      {
        question: 'Qu\'est-ce que SimplRH exactement ?',
        answer: 'SimplRH est une suite logicielle complète qui vous permet de gérer votre facturation, vos ressources humaines et vos documents juridiques depuis une seule plateforme. Conçue spécifiquement pour les entreprises françaises, elle respecte toutes les réglementations locales.'
      },
      {
        question: 'Combien de temps faut-il pour mettre en place SimplRH ?',
        answer: 'La configuration de base prend moins de 5 minutes. Notre équipe vous accompagne gratuitement pour importer vos données existantes et former vos équipes. La plupart de nos clients sont opérationnels en moins de 24h.'
      },
      {
        question: 'SimplRH est-il conforme au RGPD ?',
        answer: 'Absolument. SimplRH est conçu dès le départ pour respecter le RGPD. Vos données sont hébergées en France, chiffrées et nous vous fournissons tous les outils nécessaires pour gérer les consentements et droits de vos utilisateurs.'
      }
    ]
  },
  {
    category: 'Facturation',
    questions: [
      {
        question: 'Puis-je importer mes factures existantes ?',
        answer: 'Oui, nous proposons des outils d\'import pour la plupart des formats standards (Excel, CSV, PDF). Notre équipe peut également vous aider à migrer depuis d\'autres logiciels de facturation populaires.'
      },
      {
        question: 'Comment fonctionnent les relances automatiques ?',
        answer: 'Vous configurez vos règles de relance (délais, messages, escalade) et SimplRH s\'occupe du reste. Les relances sont envoyées automatiquement par email avec un suivi complet de l\'historique.'
      },
      {
        question: 'Quels moyens de paiement sont acceptés ?',
        answer: 'SimplRH s\'intègre avec les principales solutions de paiement françaises : Stripe, PayPal, virements SEPA. Vos clients peuvent payer directement depuis leurs factures.'
      }
    ]
  },
  {
    category: 'RH',
    questions: [
      {
        question: 'Comment gérez-vous la confidentialité des données RH ?',
        answer: 'Toutes les données RH sont chiffrées et l\'accès est strictement contrôlé par des permissions granulaires. Vous décidez qui peut voir quoi, et toutes les actions sont tracées pour un audit complet.'
      },
      {
        question: 'Puis-je gérer les congés et RTT ?',
        answer: 'Oui, SimplRH inclut un système complet de gestion des congés, RTT, récupération d\'heures sup. Vos employés peuvent faire leurs demandes en ligne et vous recevez des notifications pour validation.'
      },
      {
        question: 'Y a-t-il des modèles pour les documents RH ?',
        answer: 'Nous fournissons plus de 50 modèles de documents RH conformes au droit français : contrats, avenants, attestations, lettres de recommandation, etc. Tous personnalisables selon vos besoins.'
      }
    ]
  },
  {
    category: 'Support',
    questions: [
      {
        question: 'Quel type de support proposez-vous ?',
        answer: 'Support par email, chat et téléphone en français. Les plans Professional et Enterprise bénéficient d\'un support prioritaire avec des temps de réponse garantis. Nous proposons aussi des formations personnalisées.'
      },
      {
        question: 'Y a-t-il des frais de mise en service ?',
        answer: 'Non, la mise en service est gratuite pour tous nos plans. Nous vous accompagnons dans l\'import de vos données et la formation de vos équipes sans coût supplémentaire.'
      },
      {
        question: 'Puis-je annuler mon abonnement à tout moment ?',
        answer: 'Oui, aucun engagement de durée. Vous pouvez annuler votre abonnement à tout moment depuis votre espace client. Vos données restent accessibles pendant 30 jours après l\'annulation.'
      }
    ]
  }
]

export function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <section id="faq" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Questions fréquentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tout ce que vous devez savoir sur SimplRH. 
            Vous ne trouvez pas votre réponse ? Contactez notre équipe support.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              {/* Category Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                {category.category}
              </h3>

              {/* Questions */}
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const itemId = `${categoryIndex}-${faqIndex}`
                  const isOpen = openItems.includes(itemId)

                  return (
                    <Card key={faqIndex} className="overflow-hidden">
                      <button
                        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => toggleItem(itemId)}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </h4>
                          <ChevronDown 
                            className={`h-5 w-5 text-gray-500 transition-transform flex-shrink-0 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>
                      
                      {isOpen && (
                        <CardContent className="px-6 pb-6 pt-0">
                          <div className="border-t pt-4">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="p-8">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Vous ne trouvez pas votre réponse ?
              </h3>
              <p className="text-gray-600 mb-6">
                Notre équipe support est là pour vous aider. 
                Nous répondons généralement en moins de 2 heures.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  💬 Chat en direct
                </Button>
                <Button variant="outline">
                  📧 Envoyer un email
                </Button>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Support disponible du lundi au vendredi, 9h-18h
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
