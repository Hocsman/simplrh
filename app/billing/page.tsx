'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  TrendingUp,
  TrendingDown,
  Euro,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface Invoice {
  id: string
  number: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'partially_paid'
  customer: {
    name: string
    email: string
  }
  total_ttc: number
  due_date: string
  created_at: string
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/billing/invoices')
        if (response.ok) {
          const data = await response.json()
          setInvoices(data.invoices || [])
        }
      } catch (error) {
        console.error('Error fetching invoices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  // Calculer les stats
  const stats = {
    totalAmount: invoices.reduce((sum, inv) => sum + inv.total_ttc, 0),
    pendingAmount: invoices
      .filter((inv) => inv.status === 'sent' || inv.status === 'partially_paid')
      .reduce((sum, inv) => sum + inv.total_ttc, 0),
    overdueAmount: invoices
      .filter((inv) => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total_ttc, 0),
    paidAmount: invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total_ttc, 0),
  }

  const filteredInvoices = invoices.filter(inv =>
    inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statusConfig: { [key: string]: { label: string; variant: any; icon: any; color: string } } = {
    draft: { label: 'Brouillon', variant: 'secondary', icon: Edit, color: 'text-gray-600' },
    sent: { label: 'Envoyée', variant: 'secondary', icon: Clock, color: 'text-blue-600' },
    paid: { label: 'Payée', variant: 'default', icon: CheckCircle2, color: 'text-green-600' },
    overdue: { label: 'En retard', variant: 'destructive', icon: AlertCircle, color: 'text-red-600' },
    partially_paid: { label: 'Partiellement', variant: 'secondary', icon: TrendingUp, color: 'text-orange-600' },
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Facturation</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos devis, factures et paiements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/billing/customers">
              <User className="h-4 w-4 mr-2" />
              Clients
            </Link>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm" asChild>
            <Link href="/billing/invoices/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle facture
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Euro className="h-24 w-24 text-blue-600" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <TrendingUp className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Total facturé</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.totalAmount)}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {invoices.length} facture{invoices.length > 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <Clock className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">En attente</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.pendingAmount)}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {invoices.filter((inv) => inv.status === 'sent' || inv.status === 'partially_paid').length} facture{invoices.filter((inv) => inv.status === 'sent' || inv.status === 'partially_paid').length !== 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                <AlertCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">En retard</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-red-600">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.overdueAmount)}
              </h3>
              <p className="text-sm text-red-600 mt-1">
                {invoices.filter((inv) => inv.status === 'overdue').length} facture{invoices.filter((inv) => inv.status === 'overdue').length !== 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Payées</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-green-600">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.paidAmount)}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {invoices.filter((inv) => inv.status === 'paid').length} facture{invoices.filter((inv) => inv.status === 'paid').length !== 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">Factures</CardTitle>
              <CardDescription>
                Liste de toutes vos factures
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-10 w-full md:w-[250px] bg-gray-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-lg border border-dashed">
              <div className="p-3 bg-gray-100 rounded-full mb-3">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-900">
                {searchTerm ? 'Aucune facture trouvée' : 'Aucune facture pour le moment'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez par créer votre première facture'}
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link href="/billing/invoices/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer la première facture
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredInvoices.map((invoice) => {
                const config = statusConfig[invoice.status] || statusConfig.draft
                const StatusIcon = config.icon

                return (
                  <div key={invoice.id} className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-xs">
                          {invoice.customer.name?.substring(0, 2).toUpperCase() || 'CL'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{invoice.number}</p>
                        <p className="text-sm text-muted-foreground">{invoice.customer.name || 'Client inconnu'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge variant={config.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>

                      <div className="text-right min-w-[120px]">
                        <p className="font-bold text-gray-900">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(invoice.total_ttc)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" asChild title="Voir détails">
                          <Link href={`/billing/invoices/${invoice.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {invoice.status === 'draft' && (
                          <Button variant="ghost" size="icon" asChild title="Modifier">
                            <Link href={`/billing/invoices/${invoice.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" asChild title="Télécharger">
                          <Link href={`/billing/invoices/${invoice.id}/download`}>
                            <Download className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}