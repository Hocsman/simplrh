import { NextRequest, NextResponse } from 'next/server'
import { generateInvoicePDF } from '@/lib/pdf-generator'

// Test endpoint to verify PDF generation works
export async function GET(request: NextRequest) {
  try {
    console.log('=== TEST PDF GENERATION ===')

    // Create minimal test data
    const testData = {
      invoice: {
        id: 'test-123',
        number: 'TEST-001',
        status: 'draft' as const,
        created_at: new Date().toISOString(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        total_ht: 1000,
        vat: 200,
        total_ttc: 1200,
        customer: {
          id: 'cust-123',
          name: 'Test Customer',
          email: 'test@example.com',
          address: 'Test Street 123'
        }
      },
      organization: {
        id: 'org-123',
        name: 'Test Organization',
        email: 'contact@test.com',
        siret: '12345678901234',
        address: 'Org Street 456'
      },
      items: [
        {
          id: 'item-1',
          invoice_id: 'test-123',
          label: 'Test Product',
          qty: 1,
          unit_price: 1000,
          vat_rate: 20,
          created_at: new Date().toISOString()
        }
      ]
    }

    console.log('Test data created')

    const pdfBuffer = await generateInvoicePDF(testData as any)

    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes')

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test.pdf"'
      }
    })
  } catch (error: any) {
    console.error('Test PDF generation failed:', error)
    console.error('Error stack:', error.stack)

    return NextResponse.json({
      error: 'PDF generation failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
