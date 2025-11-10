import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'

export default function BillingPage() {
  const invoices = [
    {
      id: '1',
      number: 'FACT-2024-001',
      customer: 'Client Demo SARL',
      amount: 1200,
      status: 'sent',
      dueDate: '2024-12-31',
      createdAt: '2024-12-01'
    },
    {
      id: '2',
      number: 'FACT-2024-002',
      customer: 'Entreprise ABC',
      amount: 850,
      status: 'paid',
      dueDate: '2024-12-15',
      createdAt: '2024-11-25'
    },
    {
      id: '3',
      number: 'FACT-2024-003',
      customer: 'Société XYZ',
      amount: 2100,
      status: 'overdue',
      dueDate: '2024-11-30',
      createdAt: '2024-11-01'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facturation</h1>
          <p className="text-muted-foreground">
            Gérez vos devis, factures et paiements
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/billing/customers">
              Clients
            </Link>
          </Button>
          <Button asChild>
            <Link href="/billing/invoices/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle facture
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total facturé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 320 €</div>
            <p className="text-xs text-muted-foreground">
              +12% ce mois
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 500 €</div>
            <p className="text-xs text-muted-foreground">
              12 factures
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En retard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 100 €</div>
            <p className="text-xs text-muted-foreground">
              1 facture
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              DSO moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24 jours</div>
            <p className="text-xs text-muted-foreground">
              -3 jours ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Factures</CardTitle>
              <CardDescription>
                Liste de toutes vos factures
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." className="pl-8 w-[200px]" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{invoice.number}</p>
                    <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge variant={
                    invoice.status === 'paid' ? 'success' : 
                    invoice.status === 'overdue' ? 'destructive' : 'secondary'
                  }>
                    {invoice.status === 'paid' ? 'Payée' : 
                     invoice.status === 'overdue' ? 'En retard' : 'Envoyée'}
                  </Badge>
                  
                  <div className="text-right">
                    <p className="font-medium">{invoice.amount.toLocaleString('fr-FR')} €</p>
                    <p className="text-sm text-muted-foreground">
                      Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/billing/invoices/${invoice.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/billing/invoices/${invoice.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}