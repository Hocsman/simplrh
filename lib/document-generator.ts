// Document PDF generator for legal documents
import PDFDocument from 'pdfkit'

interface DocumentMetadata {
  title: string
  author?: string
  subject?: string
}

// Base PDF generator with common styling
export class DocumentPDFGenerator {
  private doc: typeof PDFDocument.prototype
  private pageMargin = 50
  private currentY = 50

  constructor(metadata: DocumentMetadata) {
    this.doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: this.pageMargin,
        bottom: this.pageMargin,
        left: this.pageMargin,
        right: this.pageMargin
      },
      info: {
        Title: metadata.title,
        Author: metadata.author || 'SimplRH',
        Subject: metadata.subject || metadata.title,
        Creator: 'SimplRH - Plateforme RH',
        Producer: 'SimplRH',
        CreationDate: new Date()
      }
    })

    this.currentY = this.pageMargin
  }

  // Add header with logo/title
  addHeader(title: string, subtitle?: string) {
    this.doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text(title, this.pageMargin, this.currentY, {
        align: 'center',
        width: this.doc.page.width - 2 * this.pageMargin
      })

    this.currentY += 30

    if (subtitle) {
      this.doc
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#666666')
        .text(subtitle, this.pageMargin, this.currentY, {
          align: 'center',
          width: this.doc.page.width - 2 * this.pageMargin
        })
      this.currentY += 20
    }

    // Add separator line
    this.doc
      .moveTo(this.pageMargin, this.currentY)
      .lineTo(this.doc.page.width - this.pageMargin, this.currentY)
      .strokeColor('#CCCCCC')
      .lineWidth(1)
      .stroke()

    this.currentY += 30
    this.doc.fillColor('#000000') // Reset color
  }

  // Add section title
  addSectionTitle(title: string) {
    this.checkPageBreak(40)

    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#1a56db')
      .text(title, this.pageMargin, this.currentY)
      .fillColor('#000000')

    this.currentY += 25
  }

  // Add paragraph
  addParagraph(text: string, options: { indent?: boolean; bold?: boolean } = {}) {
    this.checkPageBreak(60)

    const leftMargin = options.indent ? this.pageMargin + 20 : this.pageMargin

    this.doc
      .fontSize(11)
      .font(options.bold ? 'Helvetica-Bold' : 'Helvetica')
      .text(text, leftMargin, this.currentY, {
        width: this.doc.page.width - 2 * this.pageMargin - (options.indent ? 20 : 0),
        align: 'justify',
        lineGap: 3
      })

    this.currentY = this.doc.y + 10
  }

  // Add labeled field
  addField(label: string, value: string, options: { bold?: boolean } = {}) {
    this.checkPageBreak(30)

    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#555555')
      .text(`${label} :`, this.pageMargin, this.currentY, { continued: true })
      .font(options.bold ? 'Helvetica-Bold' : 'Helvetica')
      .fillColor('#000000')
      .text(` ${value}`)

    this.currentY = this.doc.y + 8
  }

  // Add block (for addresses, etc.)
  addBlock(title: string, content: string[]) {
    this.checkPageBreak(80)

    this.doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .text(title, this.pageMargin, this.currentY)

    this.currentY += 15

    this.doc.font('Helvetica')
    content.forEach(line => {
      this.doc.text(line, this.pageMargin + 10, this.currentY)
      this.currentY += 15
    })

    this.currentY += 10
  }

  // Add table
  addTable(headers: string[], rows: string[][], columnWidths?: number[]) {
    this.checkPageBreak(100)

    const tableWidth = this.doc.page.width - 2 * this.pageMargin
    const numColumns = headers.length
    const colWidths = columnWidths || Array(numColumns).fill(tableWidth / numColumns)

    // Draw headers
    let xPos = this.pageMargin
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#1a56db')

    headers.forEach((header, i) => {
      this.doc.text(header, xPos, this.currentY, {
        width: colWidths[i],
        align: 'left'
      })
      xPos += colWidths[i]
    })

    this.currentY += 20
    this.doc.fillColor('#000000')

    // Draw line under headers
    this.doc
      .moveTo(this.pageMargin, this.currentY)
      .lineTo(this.doc.page.width - this.pageMargin, this.currentY)
      .strokeColor('#CCCCCC')
      .stroke()

    this.currentY += 10

    // Draw rows
    this.doc.font('Helvetica')
    rows.forEach(row => {
      this.checkPageBreak(30)
      xPos = this.pageMargin

      row.forEach((cell, i) => {
        this.doc.text(cell, xPos, this.currentY, {
          width: colWidths[i],
          align: 'left'
        })
        xPos += colWidths[i]
      })

      this.currentY += 20
    })

    this.currentY += 10
  }

  // Add signature block
  addSignatureBlock(signerName: string, signerTitle?: string) {
    this.checkPageBreak(100)

    this.currentY += 20

    const signatureX = this.doc.page.width - this.pageMargin - 200

    this.doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Fait à ________________, le ________________`, signatureX, this.currentY)

    this.currentY += 30

    this.doc.text(signerTitle || 'Signature', signatureX, this.currentY)
    this.currentY += 10
    this.doc.font('Helvetica-Bold').text(signerName, signatureX, this.currentY)

    this.currentY += 60
  }

  // Add footer with page numbers
  addFooter() {
    const pages = this.doc.bufferedPageRange()

    for (let i = 0; i < pages.count; i++) {
      this.doc.switchToPage(i)

      this.doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#999999')
        .text(
          `Page ${i + 1} / ${pages.count}`,
          this.pageMargin,
          this.doc.page.height - this.pageMargin + 10,
          {
            width: this.doc.page.width - 2 * this.pageMargin,
            align: 'center'
          }
        )
        .fillColor('#000000')
    }
  }

  // Add legal notice
  addLegalNotice(text: string) {
    this.checkPageBreak(60)

    this.doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#888888')
      .text(text, this.pageMargin, this.currentY, {
        width: this.doc.page.width - 2 * this.pageMargin,
        align: 'justify',
        lineGap: 2
      })
      .fillColor('#000000')

    this.currentY = this.doc.y + 15
  }

  // Check if we need a page break
  private checkPageBreak(requiredSpace: number) {
    const bottomMargin = this.doc.page.height - this.pageMargin - 30 // Reserve space for footer

    if (this.currentY + requiredSpace > bottomMargin) {
      this.doc.addPage()
      this.currentY = this.pageMargin
    }
  }

  // Add spacing
  addSpacing(amount: number = 20) {
    this.currentY += amount
  }

  // Finalize and return buffer
  async finalize(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []

      this.doc.on('data', (chunk) => chunks.push(chunk))
      this.doc.on('end', () => resolve(Buffer.concat(chunks)))
      this.doc.on('error', reject)

      this.addFooter()
      this.doc.end()
    })
  }

  // Get the PDFDocument instance for advanced usage
  getDocument() {
    return this.doc
  }
}

// Helper to format date
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// Helper to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
