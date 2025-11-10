import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Marie Dupont',
    role: 'Directrice RH',
    company: 'TechStart',
    location: 'Paris',
    image: '/avatars/marie.jpg',
    rating: 5,
    text: 'SimplRH a révolutionné notre gestion RH. Nous avons divisé par 3 le temps passé sur les tâches administratives et nos équipes sont beaucoup plus satisfaites.',
    modules: ['RH', 'Documents'],
    stats: 'Économie de 10h/semaine'
  },
  {
    name: 'Pierre Martin',
    role: 'Fondateur',
    company: 'Agence Créative',
    location: 'Lyon',
    image: '/avatars/pierre.jpg',
    rating: 5,
    text: 'La facturation automatisée nous a fait gagner un temps fou. Plus de relances oubliées, plus d\'erreurs. Notre taux de paiement a augmenté de 40%.',
    modules: ['Facturation'],
    stats: '+40% taux de paiement'
  },
  {
    name: 'Sophie Bernard',
    role: 'DAF',
    company: 'ConseilPro',
    location: 'Marseille',
    image: '/avatars/sophie.jpg',
    rating: 5,
    text: 'Une solution complète qui s\'adapte parfaitement à nos besoins. Le support est exceptionnel et l\'interface vraiment intuitive.',
    modules: ['Facturation', 'RH', 'Documents'],
    stats: '98% satisfaction équipe'
  },
  {
    name: 'Thomas Leroy',
    role: 'Dirigeant',
    company: 'Innovation Labs',
    location: 'Toulouse',
    image: '/avatars/thomas.jpg',
    rating: 5,
    text: 'Enfin une solution française qui comprend nos spécificités ! Les documents générés sont parfaitement conformes et nous font économiser des milliers d\'euros en conseils juridiques.',
    modules: ['Documents', 'RH'],
    stats: '€5000 économisés/an'
  },
  {
    name: 'Amélie Dubois',
    role: 'Responsable Admin',
    company: 'ServicePro',
    location: 'Bordeaux',
    image: '/avatars/amelie.jpg',
    rating: 5,
    text: 'La migration depuis notre ancien système s\'est faite en douceur. L\'équipe SimplRH nous a accompagnés à chaque étape.',
    modules: ['Facturation', 'RH'],
    stats: 'Migration en 2 jours'
  },
  {
    name: 'Laurent Petit',
    role: 'CEO',
    company: 'Digital Agency',
    location: 'Nantes',
    image: '/avatars/laurent.jpg',
    rating: 5,
    text: 'ROI exceptionnel ! En 6 mois, SimplRH s\'est déjà rentabilisé grâce aux gains de productivité et à la réduction des erreurs.',
    modules: ['Facturation', 'RH', 'Documents'],
    stats: 'ROI 300% en 6 mois'
  }
]

const stats = [
  { value: '500+', label: 'Entreprises clientes' },
  { value: '4.9/5', label: 'Note satisfaction' },
  { value: '98%', label: 'Taux de rétention' },
  { value: '24h', label: 'Temps de réponse moyen' }
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment plus de 500 entreprises françaises ont transformé 
            leur gestion administrative avec SimplRH.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="h-6 w-6 text-blue-200 absolute -top-2 -left-1" />
                  <p className="text-gray-700 pl-6 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>

                {/* Modules Used */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {testimonial.modules.map((module, moduleIndex) => (
                    <Badge 
                      key={moduleIndex} 
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-700"
                    >
                      {module}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="bg-green-50 rounded-lg p-3 mb-4">
                  <p className="text-green-700 font-medium text-sm">
                    📈 {testimonial.stats}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </div>
                    <div className="text-xs text-gray-500">
                      📍 {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Rejoignez des centaines d'entreprises satisfaites
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez SimplRH gratuitement pendant 14 jours, sans engagement.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>✓ Aucune carte requise</span>
              <span>✓ Support français</span>
              <span>✓ Migration assistée</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
