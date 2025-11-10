import { NextRequest, NextResponse } from 'next/server'

interface DownloadRouteProps {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: DownloadRouteProps) {
  try {
    const { id } = params

    // Mock document data
    const documents = {
      '1': {
        title: 'Contrat de prestation - TechStart SAS',
        filename: 'contrat_prestation_techstart.pdf'
      },
      '2': {
        title: 'CGV E-commerce - MonShop',
        filename: 'cgv_ecommerce_monshop.pdf'
      },
      '3': {
        title: 'Lettre de mise en demeure - Client X',
        filename: 'mise_en_demeure_client_x.pdf'
      }
    }

    const document = documents[id as keyof typeof documents]
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Create mock PDF content with document ID
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 128
>>
stream
BT
/F1 12 Tf
50 750 Td
(Document généré par SimplRH) Tj
0 -20 Td
(Mode test - PDF fictif) Tj
0 -20 Td
(ID: ${id}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000101 00000 n 
0000000249 00000 n 
0000000426 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
523
%%EOF`
    const buffer = Buffer.from(pdfContent, 'utf-8')

    // Return PDF with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${document.filename}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error: any) {
    console.error('Document download error:', error)
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    )
  }
}
