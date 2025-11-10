'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { 
  ArrowLeft, 
  Save, 
  CreditCard, 
  Euro, 
  Calendar, 
  Building,
  FileText,
  CheckCircle,
  Search,
  AlertTriangle,
  Clock,
  Upload,
  Loader2
} from 'lucide-react'

interface Invoice {
  id: string
  client_name: string
  amount: number
  due_date: string
  status: string
  days_overdue: number
  paid_amount?: number
  remaining_amount?: number
}

interface PaymentFormData {
  invoice_id: string
  amount: string
  payment_date: string
  payment_method: string
  reference: string
  bank_account: string
  currency: string
  transaction_fee: string
  exchange_rate: string
  notes: string
  auto_reconcile: boolean
  send_confirmation: boolean
}

export default function NewPaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [invoicesLoading, setInvoicesLoading] = useState(true)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [clientFilter, setClientFilter] = useState('')

  // État du formulaire
  const [formData, setFormData] = useState<PaymentFormData>({
    invoice_id: '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: '',
    reference: '',
    bank_account: '',
    currency: 'EUR',
    transaction_fee: '0',
    exchange_rate: '1',
    notes: '',
    auto_reconcile: true,
    send_confirmation: false
  })

  // Charger les factures impayées au montage
  useEffect(() => {
    loadUnpaidInvoices()
  }, [])

  // Mettre à jour le montant suggéré quand une facture est sélectionnée
  useEffect(() => {
    if (selectedInvoice) {
      const remainingAmount = selectedInvoice.remaining_amount || (selectedInvoice.amount - (selectedInvoice.paid_amount || 0))
      setFormData(prev => ({
        ...prev,
        invoice_id: selectedInvoice.id,
        amount: remainingAmount.toString()
      }))
    }
  }, [selectedInvoice])

  const loadUnpaidInvoices = async () => {
    try {
      setInvoicesLoading(true)
      const response = await fetch('/api/billing/invoices/unpaid')
      const data = await response.json()
      
      if (data.success) {
        setInvoices(data.invoices)
      } else {
        toast.error('Erreur lors du chargement des factures')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion')
    } finally {
      setInvoicesLoading(false)
    }
  }

  const handleInputChange = (field: keyof PaymentFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleInvoiceSelect = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
  }

  const validateForm = (): string[] => {
    const errors: string[] = []
    
    if (!formData.invoice_id) errors.push('Veuillez sélectionner une facture')
    if (!formData.amount || parseFloat(formData.amount) <= 0) errors.push('Veuillez saisir un montant valide')
    if (!formData.payment_date) errors.push('Veuillez saisir une date de paiement')
    if (!formData.payment_method) errors.push('Veuillez sélectionner une méthode de paiement')
    
    // Vérifier que le montant ne dépasse pas le montant restant dû
    if (selectedInvoice && formData.amount) {
      const remainingAmount = selectedInvoice.remaining_amount || (selectedInvoice.amount - (selectedInvoice.paid_amount || 0))
      if (parseFloat(formData.amount) > remainingAmount) {
        errors.push(`Le montant ne peut pas dépasser ${remainingAmount.toLocaleString('fr-FR')}€`)
      }
    }
    
    return errors
  }

  const handleSubmit = async (isDraft: boolean = false) => {
    // Validation
    const errors = validateForm()
    if (errors.length > 0 && !isDraft) {
      errors.forEach(error => toast.error(error))
      return
    }

    try {
      setLoading(true)
      
      const submitData = {
        ...formData,
        is_draft: isDraft,
        amount: parseFloat(formData.amount),
        transaction_fee: parseFloat(formData.transaction_fee),
        exchange_rate: parseFloat(formData.exchange_rate)
      }

      const response = await fetch('/api/billing/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success(data.message)
        
        // Rediriger vers la liste des paiements après un court délai
        setTimeout(() => {
          router.push('/billing/payments')
        }, 1500)
      } else {
        toast.error(data.error || 'Erreur lors de l\'enregistrement')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = () => handleSubmit(true)
  const handleSavePayment = () => handleSubmit(false)

  // Filtrer les factures selon la recherche
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = !searchTerm || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesClient = !clientFilter || 
      invoice.client_name.toLowerCase().includes(clientFilter.toLowerCase())
    
    return matchesSearch && matchesClient
  })

  // Calculer le montant net
  const calculateNetAmount = () => {
    const amount = parseFloat(formData.amount) || 0
    const fee = parseFloat(formData.transaction_fee) || 0
    return amount - fee
  }
  return (
    <div className="space-y-8">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/billing/payments">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux paiements
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enregistrer un paiement</h1>
            <p className="text-gray-600 mt-2">Enregistrez un paiement reçu pour une facture</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Brouillon
          </Button>
          <Button 
            onClick={handleSavePayment}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Enregistrer le paiement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Sélection de la facture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoice-search">Rechercher une facture</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="invoice-search"
                      placeholder="Numéro de facture ou nom client..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="client-filter">Filtrer par client</Label>
                  <Input
                    id="client-filter"
                    placeholder="Nom du client..."
                    className="mt-1"
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                  />
                </div>
              </div>

              {/* Invoice List */}
              <div className="space-y-3">
                <Label>Factures en attente de paiement</Label>
                {invoicesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Chargement des factures...</span>
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune facture trouvée</p>
                    {(searchTerm || clientFilter) && (
                      <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                    )}
                  </div>
                ) : (
                  filteredInvoices.map((invoice) => {
                    const remainingAmount = invoice.remaining_amount || (invoice.amount - (invoice.paid_amount || 0))
                    const isSelected = selectedInvoice?.id === invoice.id
                    
                    return (
                      <div
                        key={invoice.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleInvoiceSelect(invoice)}
                      >
                        <div className="flex items-center gap-4">
                          <input 
                            type="radio" 
                            name="selected-invoice" 
                            value={invoice.id} 
                            className="w-4 h-4" 
                            checked={isSelected}
                            onChange={() => handleInvoiceSelect(invoice)}
                          />
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium">{invoice.id}</h4>
                              {invoice.status === 'overdue' && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  En retard ({invoice.days_overdue}j)
                                </Badge>
                              )}
                              {invoice.status === 'partial' && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Partiel
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{invoice.client_name}</p>
                            <p className="text-xs text-gray-500">
                              Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {remainingAmount.toLocaleString('fr-FR')}€
                          </p>
                          {invoice.paid_amount && invoice.paid_amount > 0 && (
                            <p className="text-sm text-orange-600">
                              {invoice.paid_amount.toLocaleString('fr-FR')}€ déjà payé
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Total: {invoice.amount.toLocaleString('fr-FR')}€
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-blue-600">
                <FileText className="h-4 w-4" />
                <button className="underline">Créer un paiement sans facture</button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Détails du paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment-amount">Montant du paiement *</Label>
                  <div className="relative mt-1">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="payment-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-10"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      required
                    />
                  </div>
                  {selectedInvoice && (
                    <p className="text-xs text-gray-500 mt-1">
                      Montant restant dû: {((selectedInvoice.remaining_amount || (selectedInvoice.amount - (selectedInvoice.paid_amount || 0)))).toLocaleString('fr-FR')}€
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="payment-date">Date du paiement *</Label>
                  <Input
                    id="payment-date"
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => handleInputChange('payment_date', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment-method">Méthode de paiement *</Label>
                  <select 
                    id="payment-method"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.payment_method}
                    onChange={(e) => handleInputChange('payment_method', e.target.value)}
                    required
                  >
                    <option value="">Sélectionner...</option>
                    <option value="bank_transfer">Virement bancaire</option>
                    <option value="credit_card">Carte bancaire</option>
                    <option value="check">Chèque</option>
                    <option value="cash">Espèces</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                    <option value="sepa">Prélèvement SEPA</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="payment-reference">Référence du paiement</Label>
                  <Input
                    id="payment-reference"
                    placeholder="VIR240728001"
                    className="mt-1"
                    value={formData.reference}
                    onChange={(e) => handleInputChange('reference', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bank-account">Compte bancaire</Label>
                  <select 
                    id="bank-account"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Compte par défaut</option>
                    <option value="main">Compte principal - ****7890</option>
                    <option value="secondary">Compte secondaire - ****1234</option>
                    <option value="paypal">PayPal - contact@simplrh.com</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="currency">Devise</Label>
                  <select 
                    id="currency"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar ($)</option>
                    <option value="GBP">Livre (£)</option>
                    <option value="CHF">Franc suisse (CHF)</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="payment-notes">Notes sur le paiement</Label>
                <Textarea
                  id="payment-notes"
                  placeholder="Informations complémentaires sur ce paiement..."
                  className="mt-1"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-reconcile">Rapprochement automatique</Label>
                    <p className="text-sm text-gray-600">Marquer automatiquement la facture comme payée</p>
                  </div>
                  <Switch 
                    id="auto-reconcile" 
                    checked={formData.auto_reconcile}
                    onCheckedChange={(checked) => handleInputChange('auto_reconcile', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="send-confirmation">Confirmation par email</Label>
                    <p className="text-sm text-gray-600">Envoyer un accusé de réception au client</p>
                  </div>
                  <Switch 
                    id="send-confirmation" 
                    checked={formData.send_confirmation}
                    onCheckedChange={(checked) => handleInputChange('send_confirmation', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fees and Charges */}
          <Card>
            <CardHeader>
              <CardTitle>Frais et commissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transaction-fee">Frais de transaction</Label>
                  <div className="relative mt-1">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="transaction-fee"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-10"
                      value={formData.transaction_fee}
                      onChange={(e) => handleInputChange('transaction_fee', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="exchange-rate">Taux de change</Label>
                  <Input
                    id="exchange-rate"
                    type="number"
                    step="0.0001"
                    placeholder="1.0000"
                    className="mt-1"
                    value={formData.exchange_rate}
                    onChange={(e) => handleInputChange('exchange_rate', e.target.value)}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Montant facture:</span>
                  <span className="font-medium">
                    {selectedInvoice ? selectedInvoice.amount.toLocaleString('fr-FR') : '0.00'}€
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Montant payé:</span>
                  <span className="font-medium">
                    {formData.amount ? parseFloat(formData.amount).toLocaleString('fr-FR') : '0.00'}€
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Frais de transaction:</span>
                  <span className="font-medium text-red-600">
                    -{formData.transaction_fee ? parseFloat(formData.transaction_fee).toLocaleString('fr-FR') : '0.00'}€
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Montant net reçu:</span>
                  <span className="font-bold text-green-600">
                    {calculateNetAmount().toLocaleString('fr-FR')}€
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Pièces jointes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Glissez-déposez vos fichiers ici</p>
                <Button variant="outline" size="sm">
                  Choisir des fichiers
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Formats acceptés: PDF, JPG, PNG (max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé du paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Montant à encaisser</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formData.amount ? parseFloat(formData.amount).toLocaleString('fr-FR') : '0.00'}€
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Facture:</span>
                  <span>{selectedInvoice?.id || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Client:</span>
                  <span>{selectedInvoice?.client_name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Méthode:</span>
                  <span>
                    {formData.payment_method ? 
                      formData.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
                      : '-'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>
                    {formData.payment_date ? 
                      new Date(formData.payment_date).toLocaleDateString('fr-FR') 
                      : new Date().toLocaleDateString('fr-FR')
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Voir la facture
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building className="h-4 w-4 mr-2" />
                Voir le client
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Historique paiements
              </Button>
            </CardContent>
          </Card>

          {/* Payment Methods Info */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Méthodes de paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="font-medium">Virement bancaire</p>
                  <p className="text-xs">Délai: 1-3 jours ouvrés</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 mt-0.5 text-green-500" />
                <div>
                  <p className="font-medium">Carte bancaire</p>
                  <p className="text-xs">Immédiat</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 mt-0.5 text-orange-500" />
                <div>
                  <p className="font-medium">Chèque</p>
                  <p className="text-xs">Délai: 2-5 jours ouvrés</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Conseils</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <p>• Vérifiez toujours le montant avant validation</p>
              <p>• Conservez les justificatifs de paiement</p>
              <p>• Le rapprochement automatique facilite la comptabilité</p>
              <p>• Les confirmations email améliorent la relation client</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" asChild>
          <Link href="/billing/payments">
            Annuler
          </Link>
        </Button>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Sauvegarder en brouillon
          </Button>
          <Button 
            onClick={handleSavePayment}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
            Enregistrer le paiement
          </Button>
        </div>
      </div>
    </div>
  )
}
