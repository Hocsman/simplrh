import { NextResponse } from 'next/server'

// Mock des factures impayées (en production : requête Supabase)
const mockUnpaidInvoices = [
  {
    id: 'FAC-2024-003',
    client_name: 'E-Commerce Solutions',
    amount: 12000,
    due_date: '2024-08-01T00:00:00Z',
    status: 'pending',
    days_overdue: 0,
    paid_amount: 0
  },
  {
    id: 'FAC-2024-004',
    client_name: 'StartupX',
    amount: 5500,
    due_date: '2024-07-10T00:00:00Z',
    status: 'overdue',
    days_overdue: 18,
    paid_amount: 0
  },
  {
    id: 'FAC-2024-006',
    client_name: 'Digital Agency Pro',
    amount: 7800,
    due_date: '2024-08-05T00:00:00Z',
    status: 'partial',
    days_overdue: 0,
    paid_amount: 3900
  },
  {
    id: 'FAC-2024-007',
    client_name: 'TechStart SAS',
    amount: 8500,
    due_date: '2024-08-10T00:00:00Z',
    status: 'pending',
    days_overdue: 0,
    paid_amount: 0
  },
  {
    id: 'FAC-2024-008',
    client_name: 'E-Commerce Solutions',
    amount: 15000,
    due_date: '2024-07-25T00:00:00Z',
    status: 'overdue',
    days_overdue: 3,
    paid_amount: 0
  }
]

export async function GET() {
  try {
    // Calculer les jours de retard en temps réel
    const today = new Date()
    const invoicesWithCalculatedOverdue = mockUnpaidInvoices.map(invoice => {
      const dueDate = new Date(invoice.due_date)
      const diffTime = today.getTime() - dueDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      return {
        ...invoice,
        days_overdue: diffDays > 0 ? diffDays : 0,
        status: diffDays > 0 && invoice.status === 'pending' ? 'overdue' : invoice.status,
        remaining_amount: invoice.amount - invoice.paid_amount
      }
    })

    // Filtrer seulement les factures qui ont un montant restant à payer
    const unpaidInvoices = invoicesWithCalculatedOverdue.filter(
      invoice => invoice.remaining_amount > 0
    )

    return NextResponse.json({
      success: true,
      invoices: unpaidInvoices,
      total: unpaidInvoices.length
    })

  } catch (error: any) {
    console.error('Erreur lors de la récupération des factures impayées:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}










