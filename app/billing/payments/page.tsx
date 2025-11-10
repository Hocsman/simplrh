import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  CreditCard, 
  Euro, 
  Calendar, 
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  Building,
  FileText
} from 'lucide-react'

// Mock payments data
const mockPayments = [
  {
    id: '1',
    invoice_number: 'FAC-2024-001',
    client_name: 'TechStart SAS',
    amount: 15000,
    payment_date: '2024-07-25T10:30:00Z',
    due_date: '2024-07-20T00:00:00Z',
    status: 'paid',
    payment_method: 'bank_transfer',
    reference: 'VIR240725001',
    created_at: '2024-06-20T09:15:00Z',
    late_days: 5
  },
  {
    id: '2',
    invoice_number: 'FAC-2024-002',
    client_name: 'Digital Agency Pro',
    amount: 8500,
    payment_date: '2024-07-18T14:20:00Z',
    due_date: '2024-07-15T00:00:00Z',
    status: 'paid',
    payment_method: 'credit_card',
    reference: 'CB240718002',
    created_at: '2024-06-15T11:30:00Z',
    late_days: 3
  },
  {
    id: '3',
    invoice_number: 'FAC-2024-003',
    client_name: 'E-Commerce Solutions',
    amount: 12000,
    payment_date: null,
    due_date: '2024-08-01T00:00:00Z',
    status: 'pending',
    payment_method: null,
    reference: null,
    created_at: '2024-07-01T16:45:00Z',
    late_days: 0
  },
  {
    id: '4',
    invoice_number: 'FAC-2024-004',
    client_name: 'StartupX',
    amount: 5500,
    payment_date: null,
    due_date: '2024-07-10T00:00:00Z',
    status: 'overdue',
    payment_method: null,
    reference: null,
    created_at: '2024-06-10T08:20:00Z',
    late_days: 18
  },
  {
    id: '5',
    invoice_number: 'FAC-2024-005',
    client_name: 'TechStart SAS',
    amount: 22000,
    payment_date: '2024-07-22T09:45:00Z',
    due_date: '2024-07-25T00:00:00Z',
    status: 'paid',
    payment_method: 'bank_transfer',
    reference: 'VIR240722003',
    created_at: '2024-06-25T14:10:00Z',
    late_days: -3 // Payé en avance
  },
  {
    id: '6',
    invoice_number: 'FAC-2024-006',
    client_name: 'Digital Agency Pro',
    amount: 7800,
    payment_date: null,
    due_date: '2024-08-05T00:00:00Z',
    status: 'partial',
    payment_method: 'bank_transfer',
    reference: 'VIR240720004',
    created_at: '2024-07-05T12:30:00Z',
    late_days: 0,
    paid_amount: 3900
  }
]

const getStatusBadge = (status: string, lateDays?: number) => {
  switch (status) {
    case 'paid':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />Payé
      </Badge>
    case 'pending':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        <Clock className="h-3 w-3 mr-1" />En attente
      </Badge>
    case 'overdue':
      return <Badge variant="secondary" className="bg-red-100 text-red-800">
        <AlertTriangle className="h-3 w-3 mr-1" />En retard ({lateDays}j)
      </Badge>
    case 'partial':
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">
        <Clock className="h-3 w-3 mr-1" />Partiel
      </Badge>
    case 'cancelled':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        <XCircle className="h-3 w-3 mr-1" />Annulé
      </Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getPaymentMethodLabel = (method: string | null) => {
  if (!method) return '-'
  const methods = {
    bank_transfer: 'Virement',
    credit_card: 'Carte bancaire',
    check: 'Chèque',
    cash: 'Espèces',
    paypal: 'PayPal',
    stripe: 'Stripe'
  }
  return methods[method as keyof typeof methods] || method
}

export default function PaymentsPage() {
  const paidPayments = mockPayments.filter(p => p.status === 'paid').length
  const totalPaid = mockPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = mockPayments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0)
  const overduePayments = mockPayments.filter(p => p.status === 'overdue').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paiements</h1>
          <p className="text-gray-600 mt-2">Suivez tous vos paiements clients</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button asChild>
            <Link href="/billing/payments/new">
              <Plus className="h-4 w-4 mr-2" />
              Enregistrer un paiement
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un paiement..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Tous les statuts</Button>
            <Button variant="outline">Tous les clients</Button>
            <Button variant="outline">Ce mois</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total paiements</p>
                <p className="text-2xl font-bold text-blue-600">{mockPayments.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {(totalPaid / 1000).toFixed(0)}k€
              </p>
              <p className="text-sm text-gray-600">Encaissé ({paidPayments})</p>
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
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{overduePayments}</p>
              <p className="text-sm text-gray-600">En retard</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto p-4 justify-start">
          <div className="text-left">
            <div className="font-medium">Paiements du jour</div>
            <div className="text-sm text-gray-500">3 paiements - 25,5k€</div>
          </div>
        </Button>
        
        <Button variant="outline" className="h-auto p-4 justify-start">
          <div className="text-left">
            <div className="font-medium">En retard</div>
            <div className="text-sm text-gray-500">{overduePayments} factures à relancer</div>
          </div>
        </Button>
        
        <Button variant="outline" className="h-auto p-4 justify-start">
          <div className="text-left">
            <div className="font-medium">À échoir cette semaine</div>
            <div className="text-sm text-gray-500">2 paiements attendus</div>
          </div>
        </Button>
        
        <Button variant="outline" className="h-auto p-4 justify-start">
          <div className="text-left">
            <div className="font-medium">Rapprochement bancaire</div>
            <div className="text-sm text-gray-500">Vérifier les comptes</div>
          </div>
        </Button>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-gray-900">{payment.invoice_number}</h3>
                      {getStatusBadge(payment.status, payment.late_days)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {payment.client_name}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Euro className="h-3 w-3" />
                        <span className="font-medium">
                          {payment.amount.toLocaleString('fr-FR')}€
                          {payment.status === 'partial' && payment.paid_amount && (
                            <span className="text-orange-600 ml-1">
                              ({payment.paid_amount.toLocaleString('fr-FR')}€ payé)
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Échéance: {new Date(payment.due_date).toLocaleDateString('fr-FR')}
                      </div>
                      {payment.payment_date && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Payé le {new Date(payment.payment_date).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                    {payment.reference && (
                      <p className="text-xs text-gray-400 mt-1">
                        Référence: {payment.reference} • {getPaymentMethodLabel(payment.payment_method)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Amount Display */}
                  <div className="text-right text-sm">
                    <p className={`font-bold text-lg ${
                      payment.status === 'paid' ? 'text-green-600' :
                      payment.status === 'overdue' ? 'text-red-600' :
                      payment.status === 'partial' ? 'text-orange-600' :
                      'text-gray-900'
                    }`}>
                      {payment.amount.toLocaleString('fr-FR')}€
                    </p>
                    <p className="text-gray-500 text-xs">
                      {getPaymentMethodLabel(payment.payment_method)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    {payment.status === 'pending' && (
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Marquer payé
                      </Button>
                    )}
                    {payment.status === 'overdue' && (
                      <Button size="sm" variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Relancer
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Facture
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600">
              Affichage de 1 à {mockPayments.length} sur {mockPayments.length} paiements
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Précédent</Button>
              <Button variant="outline" size="sm">Suivant</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
