export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Users, 
  Mail, 
  Phone, 
  Edit, 
  Eye, 
  MapPin,
  Filter,
  Building,
  Euro,
  Calendar,
  FileText,
  CreditCard
} from 'lucide-react'

// Mock clients data
const mockClients = [
  {
    id: '1',
    name: 'TechStart SAS',
    contact_name: 'Marie Dubois',
    email: 'marie.dubois@techstart.fr',
    phone: '01 23 45 67 89',
    address: '123 Avenue des Champs-Élysées\n75008 Paris',
    siret: '12345678901234',
    vat_number: 'FR12345678901',
    status: 'active',
    created_at: '2023-06-15T10:30:00Z',
    total_invoiced: 125000,
    pending_amount: 15000,
    last_invoice_date: '2024-07-20T00:00:00Z',
    payment_terms: 30,
    invoices_count: 12
  },
  {
    id: '2',
    name: 'Digital Agency Pro',
    contact_name: 'Pierre Martin',
    email: 'p.martin@digitalagency.com',
    phone: '01 98 76 54 32',
    address: '45 Rue de Rivoli\n75001 Paris',
    siret: '98765432109876',
    vat_number: 'FR98765432109',
    status: 'active',
    created_at: '2023-09-10T14:20:00Z',
    total_invoiced: 89000,
    pending_amount: 0,
    last_invoice_date: '2024-07-15T00:00:00Z',
    payment_terms: 45,
    invoices_count: 8
  },
  {
    id: '3',
    name: 'E-Commerce Solutions',
    contact_name: 'Sophie Legrand',
    email: 'sophie@ecommerce-sol.fr',
    phone: '01 11 22 33 44',
    address: '78 Boulevard Saint-Germain\n75006 Paris',
    siret: '11223344556677',
    vat_number: 'FR11223344556',
    status: 'active',
    created_at: '2024-01-20T09:15:00Z',
    total_invoiced: 45000,
    pending_amount: 8500,
    last_invoice_date: '2024-07-25T00:00:00Z',
    payment_terms: 30,
    invoices_count: 5
  },
  {
    id: '4',
    name: 'StartupX',
    contact_name: 'Jean Dupont',
    email: 'jean@startupx.io',
    phone: '01 55 66 77 88',
    address: '12 Rue de la Paix\n75002 Paris',
    siret: '55667788990011',
    vat_number: 'FR55667788990',
    status: 'inactive',
    created_at: '2023-12-05T16:45:00Z',
    total_invoiced: 25000,
    pending_amount: 0,
    last_invoice_date: '2024-03-10T00:00:00Z',
    payment_terms: 30,
    invoices_count: 3
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Actif</Badge>
    case 'inactive':
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Inactif</Badge>
    case 'prospect':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Prospect</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function ClientsPage() {
  const activeClients = mockClients.filter(c => c.status === 'active').length
  const totalRevenue = mockClients.reduce((sum, c) => sum + c.total_invoiced, 0)
  const pendingAmount = mockClients.reduce((sum, c) => sum + c.pending_amount, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-2">Gérez vos clients et leurs informations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button asChild>
            <Link href="/billing/customers/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau client
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un client..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Tous les statuts</Button>
            <Button variant="outline">Toutes les régions</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total clients</p>
                <p className="text-2xl font-bold text-blue-600">{mockClients.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{activeClients}</p>
              <p className="text-sm text-gray-600">Actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {(totalRevenue / 1000).toFixed(0)}k€
              </p>
              <p className="text-sm text-gray-600">CA total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {(pendingAmount / 1000).toFixed(0)}k€
              </p>
              <p className="text-sm text-gray-600">En attente</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-gray-900">{client.name}</h3>
                      {getStatusBadge(client.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Contact: {client.contact_name}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Client depuis {new Date(client.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* Financial Info */}
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <Euro className="h-3 w-3 text-green-600" />
                      <span className="font-medium text-green-600">
                        {(client.total_invoiced / 1000).toFixed(0)}k€
                      </span>
                    </div>
                    <p className="text-gray-500">{client.invoices_count} factures</p>
                    {client.pending_amount > 0 && (
                      <p className="text-orange-600 text-xs">
                        {(client.pending_amount / 1000).toFixed(1)}k€ en attente
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Factures
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600">
              Affichage de 1 à {mockClients.length} sur {mockClients.length} clients
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Précédent</Button>
              <Button variant="outline" size="sm">Suivant</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/billing/customers/new">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Nouveau client</h3>
              <p className="text-gray-600 text-sm">Ajouter un nouveau client à votre portefeuille</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/billing/invoices/new">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Nouvelle facture</h3>
              <p className="text-gray-600 text-sm">Créer une facture pour un client existant</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/billing/payments">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Suivi paiements</h3>
              <p className="text-gray-600 text-sm">Consulter l'état des paiements clients</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
