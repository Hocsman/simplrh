import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock data for testing
    const invoices = [
      {
        id: '1',
        number: 'FAC-2024-001',
        customer_name: 'Client Test',
        amount: 1000,
        status: 'draft',
        created_at: new Date().toISOString()
      }
    ]
    
    return NextResponse.json(invoices)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Creating invoice with data:', body)
    
    // Mock invoice creation
    const invoice = {
      id: Date.now().toString(),
      number: `FAC-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      customer_name: body.customer_name || 'Client Test',
      amount: body.amount || 1000,
      status: 'draft',
      created_at: new Date().toISOString(),
      pdf_path: null,
      facturx_xml_path: null,
      message: 'Facture créée avec succès (mode test)'
    }
    
    return NextResponse.json(invoice)
  } catch (error: any) {
    console.error('Invoice creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la facture' },
      { status: 400 }
    )
  }
}