'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import {
  Plus,
  Search,
  FileText,
  Download,
  Send,
  Eye,
  Trash2,
  Filter,
  DollarSign,
  Calendar,
  User,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface Invoice {
  id: string
  number: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'partially_paid'
  customer: {
    id: string
    name: string
    email: string
  }
  total_ttc: number
  due_date: string
  created_at: string
  sent_at?: string
}

const statusConfig: { [key: string]: { label: string; color: string; bg: string; icon: any } } = {
  draft: { label: 'Brouillon', color: 'text-gray-600', bg: 'bg-gray-100', icon: FileText },
  sent: { label: 'Envoyée', color: 'text-blue-600', bg: 'bg-blue-100', icon: Send },
  paid: { label: 'Payée', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle },
  overdue: { label: 'En retard', color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle },
  partially_paid: { label: 'Partiellement payée', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock },
}

export default function InvoicesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  // Charger les factures
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/billing/invoices')
        if (!response.ok) throw new Error('Erreur lors de la récupération des factures')
        const data = await response.json()
        setInvoices(data.invoices || [])
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: error.message,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [toast])

  // Filtrer les factures
  useEffect(() => {
    let filtered = invoices

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (inv) =>
          inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter((inv) => inv.status === statusFilter)
    }

    setFilteredInvoices(filtered)
  }, [invoices, searchTerm, statusFilter])

  // Supprimer une facture
  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) return

    try {
      setDeleting(id)
      const response = await fetch(`/api/billing/invoices/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Erreur lors de la suppression')

      setInvoices(invoices.filter((inv) => inv.id !== id))
      toast({
        title: 'Succès',
        description: 'Facture supprimée avec succès',
      })
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message,
      })
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Factures</h1>
            <p className="text-gray-600 mt-1">Gérez vos factures clients</p>
          </div>
          <Link href="/billing/invoices/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle facture
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total facturé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                  invoices.reduce((sum, inv) => sum + inv.total_ttc, 0)
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{invoices.length} factures</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Brouillons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {invoices.filter((inv) => inv.status === 'draft').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">À envoyer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">En retard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {invoices.filter((inv) => inv.status === 'overdue').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                  invoices
                    .filter((inv) => inv.status === 'overdue')
                    .reduce((sum, inv) => sum + inv.total_ttc, 0)
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Payées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {invoices.filter((inv) => inv.status === 'paid').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Encaissées</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par numéro, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="sent">Envoyée</option>
            <option value="paid">Payée</option>
            <option value="overdue">En retard</option>
            <option value="partially_paid">Partiellement payée</option>
          </select>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardContent className="p-0">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune facture trouvée</p>
                <Link href="/billing/invoices/new">
                  <Button variant="outline" className="mt-4">
                    Créer la première facture
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Numéro</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Échéance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredInvoices.map((invoice) => {
                      const config = statusConfig[invoice.status] || statusConfig.draft
                      const dueDate = new Date(invoice.due_date)
                      const today = new Date()
                      const isOverdue = invoice.status !== 'paid' && dueDate < today

                      return (
                        <tr key={invoice.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <Link href={`/billing/invoices/${invoice.id}`}>
                              <span className="font-medium text-blue-600 hover:underline cursor-pointer">
                                {invoice.number}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium">{invoice.customer.name}</p>
                              <p className="text-sm text-gray-500">{invoice.customer.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-lg">
                              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                                invoice.total_ttc
                              )}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                {dueDate.toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className={`${config.bg} ${config.color}`}>
                              {config.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/billing/invoices/${invoice.id}`}>
                                <Button variant="ghost" size="sm" title="Voir détails">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/billing/invoices/${invoice.id}/download`}>
                                <Button variant="ghost" size="sm" title="Télécharger PDF">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </Link>
                              {invoice.status === 'draft' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(invoice.id)}
                                  disabled={deleting === invoice.id}
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
