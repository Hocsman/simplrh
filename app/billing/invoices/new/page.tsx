'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Trash2, Save } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email?: string
}

interface InvoiceItem {
  label: string
  qty: number
  unit_price: number
  vat_rate: number
}

export default function NewInvoicePage() {
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([
    { label: '', qty: 1, unit_price: 0, vat_rate: 20 }
  ])
  
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Set default due date (30 days from now)
    const date = new Date()
    date.setDate(date.getDate() + 30)
    setDueDate(date.toISOString().split('T')[0])
    
    // Fetch real customers from API
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/billing/customers')
        if (response.ok) {
          const data = await response.json()
          setCustomers(data.customers || [])
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger les clients'
        })
      }
    }
    
    fetchCustomers()
  }, [])

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
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const calculateTotal = () => {
    const totalHT = items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0)
    const totalVAT = items.reduce((sum, item) => 
      sum + (item.qty * item.unit_price * item.vat_rate / 100), 0
    )
    return {
      totalHT,
      totalVAT,
      totalTTC: totalHT + totalVAT
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez sélectionner un client'
      })
      return
    }

    setLoading(true)
    try {
      const selectedCustomerData = customers.find(c => c.id === selectedCustomer)
      
      const response = await fetch('/api/billing/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: selectedCustomer,
          due_date: dueDate,
          items,
          customer: selectedCustomerData // For PDF generation
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create invoice')
      }

      const invoice = await response.json()
      
      toast({
        title: 'Facture créée !',
        description: `Facture ${invoice.number} créée avec succès`
      })

      router.push('/billing')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de créer la facture'
      })
    } finally {
      setLoading(false)
    }
  }

  const totals = calculateTotal()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Nouvelle facture
        </h1>
        <p className="text-gray-600 mt-2">
          Créez une nouvelle facture avec génération PDF et XML Factur-X
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Client Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Informations client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client *
              </label>
              {customers.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800 mb-2">
                    Aucun client trouvé. Vous devez d'abord créer un client.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/billing/customers/new')}
                  >
                    Créer un client
                  </Button>
                </div>
              ) : (
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} {customer.email && `(${customer.email})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date d'échéance
              </label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Articles</CardTitle>
            <Button type="button" onClick={addItem} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Input
                      value={item.label}
                      onChange={(e) => updateItem(index, 'label', e.target.value)}
                      placeholder="Description de l'article"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité
                    </label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.qty}
                      onChange={(e) => updateItem(index, 'qty', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix HT (€)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      TVA (%)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.vat_rate}
                      onChange={(e) => updateItem(index, 'vat_rate', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      variant="outline"
                      size="sm"
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-8 border-t pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Total HT:</span>
                    <span className="font-medium">{totals.totalHT.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA:</span>
                    <span className="font-medium">{totals.totalVAT.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total TTC:</span>
                    <span>{totals.totalTTC.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Créer la facture
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}