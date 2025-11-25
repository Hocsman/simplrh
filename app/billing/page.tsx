'use client'

import { useState, useEffect } from 'react'
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

  const recentInvoices = invoices.slice(0, 5)

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
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {invoices.length} facture{invoices.length > 1 ? 's' : ''}
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
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter((inv) => inv.status === 'sent' || inv.status === 'partially_paid').length} facture{invoices.filter((inv) => inv.status === 'sent' || inv.status === 'partially_paid').length !== 1 ? 's' : ''}
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
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.overdueAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter((inv) => inv.status === 'overdue').length} facture{invoices.filter((inv) => inv.status === 'overdue').length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.paidAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter((inv) => inv.status === 'paid').length} facture{invoices.filter((inv) => inv.status === 'paid').length !== 1 ? 's' : ''}
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : recentInvoices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Aucune facture pour le moment</p>
              <Button asChild>
                <Link href="/billing/invoices/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer la première facture
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentInvoices.map((invoice) => {
                const statusConfig: { [key: string]: { label: string; variant: any } } = {
                  draft: { label: 'Brouillon', variant: 'secondary' },
                  sent: { label: 'Envoyée', variant: 'secondary' },
                  paid: { label: 'Payée', variant: 'default' },
                  overdue: { label: 'En retard', variant: 'destructive' },
                  partially_paid: { label: 'Partiellement payée', variant: 'secondary' },
                }
                const config = statusConfig[invoice.status] || statusConfig.draft

                return (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{invoice.number}</p>
                        <p className="text-sm text-muted-foreground">{invoice.customer.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge variant={config.variant}>
                        {config.label}
                      </Badge>

                      <div className="text-right">
                        <p className="font-medium">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                            invoice.total_ttc
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>

                      <div className="flex space-x-1">
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
              {invoices.length > 5 && (
                <div className="text-center mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/billing/invoices">
                      Voir toutes les factures ({invoices.length})
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}