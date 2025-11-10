import { NextRequest, NextResponse } from 'next/server'

// Mock storage pour les paiements (en production : Supabase)
let mockPayments: any[] = []
let mockInvoices = [
  {
    id: 'FAC-2024-003',
    client_name: 'E-Commerce Solutions',
    amount: 12000,
    due_date: '2024-08-01T00:00:00Z',
    status: 'pending',
    paid_amount: 0
  },
  {
    id: 'FAC-2024-004',
    client_name: 'StartupX',
    amount: 5500,
    due_date: '2024-07-10T00:00:00Z',
    status: 'overdue',
    paid_amount: 0
  },
  {
    id: 'FAC-2024-006',
    client_name: 'Digital Agency Pro',
    amount: 7800,
    due_date: '2024-08-05T00:00:00Z',
    status: 'partial',
    paid_amount: 3900
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    const requiredFields = ['invoice_id', 'amount', 'payment_date', 'payment_method']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        )
      }
    }

    // Vérifier que la facture existe
    const invoice = mockInvoices.find(inv => inv.id === body.invoice_id)
    if (!invoice) {
      return NextResponse.json(
        { error: 'Facture non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que le montant n'excède pas le montant restant dû
    const remainingAmount = invoice.amount - invoice.paid_amount
    if (body.amount > remainingAmount) {
      return NextResponse.json(
        { error: `Le montant du paiement (${body.amount}€) ne peut pas excéder le montant restant dû (${remainingAmount}€)` },
        { status: 400 }
      )
    }

    // Créer le paiement
    const payment = {
      id: `PAY-${Date.now()}`,
      invoice_id: body.invoice_id,
      invoice_number: invoice.id,
      client_name: invoice.client_name,
      amount: parseFloat(body.amount),
      payment_date: body.payment_date,
      payment_method: body.payment_method,
      reference: body.reference || null,
      bank_account: body.bank_account || null,
      currency: body.currency || 'EUR',
      transaction_fee: parseFloat(body.transaction_fee || 0),
      exchange_rate: parseFloat(body.exchange_rate || 1),
      notes: body.notes || null,
      status: body.is_draft ? 'draft' : 'completed',
      auto_reconcile: body.auto_reconcile || false,
      send_confirmation: body.send_confirmation || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Calculer le montant net (pour usage interne)
    const netAmount = payment.amount - payment.transaction_fee

    // Ajouter le paiement
    mockPayments.push(payment)

    // Mettre à jour la facture si ce n'est pas un brouillon
    if (!body.is_draft && payment.auto_reconcile) {
      const updatedPaidAmount = invoice.paid_amount + payment.amount
      
      // Mettre à jour le statut de la facture
      if (updatedPaidAmount >= invoice.amount) {
        invoice.status = 'paid'
        invoice.paid_amount = invoice.amount
      } else {
        invoice.status = 'partial'
        invoice.paid_amount = updatedPaidAmount
      }
    }

    // Simuler l'envoi d'email de confirmation
    if (payment.send_confirmation && !body.is_draft) {
      console.log(`📧 Email de confirmation envoyé à ${invoice.client_name}`)
    }

    return NextResponse.json({
      success: true,
      payment: payment,
      message: body.is_draft 
        ? 'Paiement sauvegardé en brouillon' 
        : 'Paiement enregistré avec succès',
      invoice_updated: payment.auto_reconcile && !body.is_draft
    })

  } catch (error: any) {
    console.error('Erreur lors de l\'enregistrement du paiement:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Retourner tous les paiements (pour debug)
    return NextResponse.json({
      payments: mockPayments,
      invoices: mockInvoices
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}



