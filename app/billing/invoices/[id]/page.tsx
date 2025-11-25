'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileDown,
  Send,
  Edit,
  Trash2,
  ArrowLeft,
  DollarSign,
  Calendar,
  User,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface Invoice {
  id: string
  number: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'partially_paid'
  customer: {
    id: string
    name: string
    email: string
    siret?: string
    address?: any
  }
  items: any[]
  total_ht: number
  vat: number
  total_ttc: number
  due_date: string
  created_at: string
  sent_at?: string
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id as string

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Charger la facture
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/billing/invoices/${id}`)
        if (!response.ok) throw new Error('Facture non trouvée')
        const data = await response.json()
        setInvoice(data.invoice)
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: error.message,
        })
        router.push('/billing/invoices')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchInvoice()
  }, [id])

  // Télécharger PDF
  const handleDownload = async () => {
    try {
      setDownloading(true)
      const response = await fetch(`/api/billing/invoices/${id}/download`)
      if (!response.ok) throw new Error('Erreur lors du téléchargement')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${invoice?.number}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: 'Succès',
        description: 'PDF téléchargé avec succès',
      })
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message,
      })
    } finally {
      setDownloading(false)
    }
  }

  // Envoyer par email
  const handleSend = async () => {
    try {
      setSending(true)
      const response = await fetch(`/api/billing/invoices/${id}/send`, { method: 'POST' })
      if (!response.ok) throw new Error('Erreur lors de l\'envoi')

      const data = await response.json()
      setInvoice({ ...invoice!, status: 'sent' as const })

      toast({
        title: 'Succès',
        description: `Facture envoyée à ${invoice?.customer.email}`,
      })
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message,
      })
    } finally {
      setSending(false)
    }
  }

  // Supprimer la facture
  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/billing/invoices/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Erreur lors de la suppression')

      toast({
        title: 'Succès',
        description: 'Facture supprimée avec succès',
      })
      router.push('/billing/invoices')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message,
      })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <p className="text-red-600">Facture non trouvée</p>
      </div>
    )
  }

  const statusConfig: { [key: string]: { label: string; color: string; bg: string } } = {
    draft: { label: 'Brouillon', color: 'text-gray-600', bg: 'bg-gray-100' },
    sent: { label: 'Envoyée', color: 'text-blue-600', bg: 'bg-blue-100' },
    paid: { label: 'Payée', color: 'text-green-600', bg: 'bg-green-100' },
    overdue: { label: 'En retard', color: 'text-red-600', bg: 'bg-red-100' },
    partially_paid: { label: 'Partiellement payée', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  }

  const status = statusConfig[invoice.status] || statusConfig.draft

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/billing/invoices">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{invoice.number}</h1>
              <p className="text-gray-500">Créée le {new Date(invoice.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {/* Statut Badge */}
          <div className={`px-4 py-2 rounded-full font-semibold ${status.color} ${status.bg}`}>
            {status.label}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button onClick={handleDownload} disabled={downloading} size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            {downloading ? 'Téléchargement...' : 'Télécharger PDF'}
          </Button>

          {invoice.status === 'draft' && (
            <>
              <Button onClick={handleSend} disabled={sending} size="sm" variant="default">
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Envoi...' : 'Envoyer par email'}
              </Button>

              {invoice.status === 'draft' && (
                <Link href={`/billing/invoices/${id}/edit`}>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </Link>
              )}

              <Button onClick={handleDelete} disabled={deleting} size="sm" variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </>
          )}
        </div>

        {/* Infos principales */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Montant TTC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{invoice.total_ttc.toFixed(2)} €</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Date d'échéance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(invoice.due_date) < new Date() ? (
                  <span className="text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> En retard
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.ceil((new Date(invoice.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} j
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold">{invoice.customer.name}</div>
              <p className="text-sm text-gray-500">{invoice.customer.email}</p>
            </CardContent>
          </Card>
        </div>

        {/* Détails facture */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Détails de la facture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Infos client */}
              <div>
                <h3 className="font-semibold mb-3">Client</h3>
                <p className="text-sm">{invoice.customer.name}</p>
                {invoice.customer.siret && <p className="text-sm text-gray-500">SIRET: {invoice.customer.siret}</p>}
                {invoice.customer.address && typeof invoice.customer.address === 'object' && (
                  <div className="text-sm text-gray-500 mt-2">
                    {invoice.customer.address.street && <p>{invoice.customer.address.street}</p>}
                    {(invoice.customer.address.postal_code || invoice.customer.address.city) && (
                      <p>
                        {invoice.customer.address.postal_code} {invoice.customer.address.city}
                      </p>
                    )}
                    {invoice.customer.address.country && <p>{invoice.customer.address.country}</p>}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">{invoice.customer.email}</p>
              </div>

              {/* Infos dates */}
              <div>
                <h3 className="font-semibold mb-3">Dates</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Émise le:</span>
                    <span>{new Date(invoice.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Échéance:</span>
                    <span>{new Date(invoice.due_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {invoice.sent_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Envoyée le:</span>
                      <span>{new Date(invoice.sent_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau articles */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Quantité</th>
                    <th className="text-right py-2">Prix unitaire</th>
                    <th className="text-right py-2">TVA</th>
                    <th className="text-right py-2">Total HT</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => {
                    const total = item.qty * item.unit_price
                    return (
                      <tr key={index} className="border-b">
                        <td className="py-3">{item.label}</td>
                        <td className="text-right">{item.qty}</td>
                        <td className="text-right">{item.unit_price.toFixed(2)} €</td>
                        <td className="text-right">{item.vat_rate || 20}%</td>
                        <td className="text-right font-medium">{total.toFixed(2)} €</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Totaux */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total HT:</span>
                <span className="font-medium">{invoice.total_ht.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TVA (20%):</span>
                <span className="font-medium">{invoice.vat.toFixed(2)} €</span>
              </div>
              <div className="border-t-2 pt-2 mt-2 flex justify-between">
                <span className="font-bold text-lg">Total TTC:</span>
                <span className="font-bold text-lg text-blue-600">{invoice.total_ttc.toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
