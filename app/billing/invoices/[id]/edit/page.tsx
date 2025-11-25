'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react'

interface InvoiceItem {
  label: string
  qty: number
  unit_price: number
  vat_rate: number
}

interface Invoice {
  id: string
  number: string
  customer: {
    name: string
    email: string
  }
  due_date: string
  items: InvoiceItem[]
  status: string
}

export default function EditInvoicePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const invoiceId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([])

  // Charger la facture
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/billing/invoices/${invoiceId}`)
        if (!response.ok) throw new Error('Facture non trouvée')
        const data = await response.json()
        const inv = data.invoice

        setInvoice(inv)
        setDueDate(inv.due_date)
        setItems(inv.items || [{ label: '', qty: 1, unit_price: 0, vat_rate: 20 }])
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

    if (invoiceId) fetchInvoice()
  }, [invoiceId, router, toast])

  const addItem = () => {
    setItems([...items, { label: '', qty: 1, unit_price: 0, vat_rate: 20 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    const updatedItem = { ...newItems[index] }

    if (field === 'qty' || field === 'unit_price' || field === 'vat_rate') {
      updatedItem[field] = Number(value)
    } else if (field === 'label') {
      updatedItem[field] = String(value)
    }

    newItems[index] = updatedItem
    setItems(newItems)
  }

  const calculateTotal = () => {
    const totalHT = items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0)
    const totalVAT = items.reduce((sum, item) =>
      sum + (item.qty * item.unit_price * (item.vat_rate || 20) / 100), 0
    )
    return {
      totalHT,
      totalVAT,
      totalTTC: totalHT + totalVAT
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.some(item => !item.label)) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Tous les articles doivent avoir une description',
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/billing/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          due_date: dueDate,
          items,
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la mise à jour')
      }

      toast({
        title: 'Succès',
        description: 'Facture mise à jour avec succès',
      })

      router.push(`/billing/invoices/${invoiceId}`)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message,
      })
    } finally {
      setSaving(false)
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

  const totals = calculateTotal()

  // Les factures envoyées ou payées ne peuvent pas être modifiées
  if (['sent', 'paid', 'overdue'].includes(invoice.status)) {
    return (
      <div className="p-6">
        <Link href={`/billing/invoices/${invoiceId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">
              Les factures envoyées ou payées ne peuvent pas être modifiées.
              Pour apporter des modifications, veuillez créer une nouvelle facture ou un avoir.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/billing/invoices/${invoiceId}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Modifier facture {invoice.number}
          </h1>
          <p className="text-gray-600 mt-2">
            Client: {invoice.customer.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Due Date */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'échéance
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateItem(index, 'label', e.target.value)}
                        placeholder="Description du service"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="w-20">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Qté
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.qty}
                        onChange={(e) => updateItem(index, 'qty', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Prix unitaire (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="w-20">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        TVA %
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.vat_rate || 20}
                        onChange={(e) => updateItem(index, 'vat_rate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition w-full justify-center"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un article
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total HT:</span>
                  <span className="font-medium">
                    {totals.totalHT.toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TVA (20%):</span>
                  <span className="font-medium">
                    {totals.totalVAT.toFixed(2)} €
                  </span>
                </div>
                <div className="border-t-2 pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-lg">Total TTC:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {totals.totalTTC.toFixed(2)} €
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Link href={`/billing/invoices/${invoiceId}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Annuler
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
