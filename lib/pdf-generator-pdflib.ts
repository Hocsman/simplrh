import { PDFDocument, PDFPage, rgb, PDFFont } from 'pdf-lib'
import { Invoice, Customer, InvoiceItem } from '../domains/billing/invoices'

export interface PDFInvoiceData {
  invoice: Invoice & { customer?: any }
  organization?: any
  items: InvoiceItem[]
}

export async function generateInvoicePDFWithPdfLib(data: PDFInvoiceData): Promise<Buffer> {
  try {
    // Validate input data
    if (!data || !data.invoice) {
      throw new Error('Invoice data is required')
    }

    const { invoice, organization, items } = data
    const itemsToRender = items || []

    // Create PDF document
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4 size in points
    const { width, height } = page.getSize()

    const margins = 40
    const pageWidth = width
    const pageHeight = height

    // Use standard font (embedded, no file system access needed)
    const font = await pdfDoc.embedFont('Helvetica')
    const fontBold = await pdfDoc.embedFont('Helvetica-Bold')

    let currentY = margins

    // Title
    page.drawText('FACTURE', {
      x: margins,
      y: pageHeight - currentY,
      size: 24,
      font: fontBold,
      color: rgb(0, 0, 0),
    })

    // Invoice info (right side)
    const infoX = pageWidth - 200
    let infoY = pageHeight - currentY

    page.drawText(`N° ${invoice.number}`, {
      x: infoX,
      y: infoY - 20,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    })

    const createdDate = new Date(invoice.created_at).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    page.drawText(`Date: ${createdDate}`, {
      x: infoX,
      y: infoY - 35,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    })

    let dateLineHeight = 15
    if (invoice.due_date) {
      const dueDate = new Date(invoice.due_date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      page.drawText(`Date limite: ${dueDate}`, {
        x: infoX,
        y: infoY - 50,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      })
      dateLineHeight = 30
    }

    const statusLabel = getStatusLabel(invoice.status)
    page.drawText(`Statut: ${statusLabel}`, {
      x: infoX,
      y: infoY - (50 + dateLineHeight),
      size: 10,
      font,
      color: rgb(0, 0, 0),
    })

    // Separator line
    currentY += 70
    page.drawLine({
      start: { x: margins, y: pageHeight - currentY },
      end: { x: pageWidth - margins, y: pageHeight - currentY },
      thickness: 1,
      color: rgb(0, 0, 0),
    })

    currentY += 30

    // Organization info
    if (organization) {
      page.drawText('Facturé par', {
        x: margins,
        y: pageHeight - currentY,
        size: 11,
        font: fontBold,
        color: rgb(0, 0, 0),
      })

      currentY += 20
      page.drawText(organization.name || '', {
        x: margins,
        y: pageHeight - currentY,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      })

      currentY += 16
      if (organization.siret) {
        page.drawText(`SIRET: ${organization.siret}`, {
          x: margins,
          y: pageHeight - currentY,
          size: 10,
          font,
          color: rgb(0, 0, 0),
        })
        currentY += 16
      }

      if (organization.address) {
        page.drawText(organization.address, {
          x: margins,
          y: pageHeight - currentY,
          size: 10,
          font,
          color: rgb(0, 0, 0),
        })
        currentY += 16
      }

      if (organization.email) {
        page.drawText(`Email: ${organization.email}`, {
          x: margins,
          y: pageHeight - currentY,
          size: 10,
          font,
          color: rgb(0, 0, 0),
        })
        currentY += 16
      }

      if (organization.phone) {
        page.drawText(`Tél: ${organization.phone}`, {
          x: margins,
          y: pageHeight - currentY,
          size: 10,
          font,
          color: rgb(0, 0, 0),
        })
        currentY += 16
      }
    }

    // Customer info (right side)
    page.drawText('Facturé à', {
      x: pageWidth - 200,
      y: pageHeight - 130,
      size: 11,
      font: fontBold,
      color: rgb(0, 0, 0),
    })

    page.drawText(invoice.customer?.name || 'Client', {
      x: pageWidth - 200,
      y: pageHeight - 150,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    })

    if (invoice.customer?.address) {
      const addr = invoice.customer.address
      let addressY = pageHeight - 166
      if (typeof addr === 'string') {
        page.drawText(addr, {
          x: pageWidth - 200,
          y: addressY,
          size: 10,
          font,
          color: rgb(0, 0, 0),
        })
      } else if (typeof addr === 'object') {
        if (addr.street) {
          page.drawText(addr.street, {
            x: pageWidth - 200,
            y: addressY,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          })
          addressY -= 16
        }
        if (addr.postal_code || addr.city) {
          page.drawText(`${addr.postal_code || ''} ${addr.city || ''}`, {
            x: pageWidth - 200,
            y: addressY,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          })
          addressY -= 16
        }
        if (addr.country) {
          page.drawText(addr.country, {
            x: pageWidth - 200,
            y: addressY,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          })
        }
      }
    }

    if (invoice.customer?.email) {
      page.drawText(`Email: ${invoice.customer.email}`, {
        x: pageWidth - 200,
        y: pageHeight - 214,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      })
    }

    // Items table
    const tableTop = pageHeight - 250
    const rowHeight = 25
    const cellPadding = 8

    // Table header background
    page.drawRectangle({
      x: margins,
      y: tableTop - rowHeight,
      width: pageWidth - 2 * margins,
      height: rowHeight,
      color: rgb(0.94, 0.94, 0.94), // Light gray
    })

    // Table headers
    page.drawText('Description', {
      x: margins + cellPadding,
      y: tableTop - rowHeight + cellPadding,
      size: 10,
      font: fontBold,
      color: rgb(0, 0, 0),
    })
    page.drawText('Quantité', {
      x: margins + 220,
      y: tableTop - rowHeight + cellPadding,
      size: 10,
      font: fontBold,
      color: rgb(0, 0, 0),
    })
    page.drawText('Prix unitaire', {
      x: margins + 300,
      y: tableTop - rowHeight + cellPadding,
      size: 10,
      font: fontBold,
      color: rgb(0, 0, 0),
    })
    page.drawText('TVA', {
      x: margins + 390,
      y: tableTop - rowHeight + cellPadding,
      size: 10,
      font: fontBold,
      color: rgb(0, 0, 0),
    })
    page.drawText('Total HT', {
      x: margins + 450,
      y: tableTop - rowHeight + cellPadding,
      size: 10,
      font: fontBold,
      color: rgb(0, 0, 0),
    })

    // Items rows
    let currentItemY = tableTop - rowHeight
    itemsToRender.forEach((item) => {
      if (!item) return

      const qty = item.qty || 0
      const unitPrice = item.unit_price || 0
      const rowTotal = qty * unitPrice

      currentItemY -= rowHeight

      page.drawText(item.label || 'Article', {
        x: margins + cellPadding,
        y: currentItemY + cellPadding,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      })
      page.drawText(String(qty), {
        x: margins + 220,
        y: currentItemY + cellPadding,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      })
      page.drawText(`${unitPrice.toFixed(2)} €`, {
        x: margins + 300,
        y: currentItemY + cellPadding,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      })
      page.drawText(`${(item.vat_rate || 20)}%`, {
        x: margins + 390,
        y: currentItemY + cellPadding,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      })
      page.drawText(`${rowTotal.toFixed(2)} €`, {
        x: margins + 450,
        y: currentItemY + cellPadding,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      })

      // Row separator
      page.drawLine({
        start: { x: margins, y: currentItemY },
        end: { x: pageWidth - margins, y: currentItemY },
        thickness: 1,
        color: rgb(0, 0, 0),
      })
    })

    // Totals
    const totalY = currentItemY - 40
    const totalBoxX = margins + 350

    const totalHT = invoice.total_ht || 0
    const vat = invoice.vat || 0
    const totalTTC = invoice.total_ttc || 0

    page.drawText('Sous-total:', {
      x: totalBoxX,
      y: totalY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    })
    page.drawText(`${totalHT.toFixed(2)} €`, {
      x: pageWidth - margins - 60,
      y: totalY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    })

    page.drawText('TVA (20%):', {
      x: totalBoxX,
      y: totalY - 20,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    })
    page.drawText(`${vat.toFixed(2)} €`, {
      x: pageWidth - margins - 60,
      y: totalY - 20,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    })

    page.drawText('TOTAL TTC:', {
      x: totalBoxX,
      y: totalY - 45,
      size: 12,
      font: fontBold,
      color: rgb(102, 126, 234), // Blue color
    })
    page.drawText(`${totalTTC.toFixed(2)} €`, {
      x: pageWidth - margins - 60,
      y: totalY - 45,
      size: 12,
      font: fontBold,
      color: rgb(0, 0, 0),
    })

    // Footer
    const footerY = 100
    page.drawText('Conditions de paiement', {
      x: margins,
      y: footerY,
      size: 9,
      font,
      color: rgb(102, 102, 102),
    })
    page.drawText('• Délai de paiement: 30 jours net', {
      x: margins,
      y: footerY - 15,
      size: 9,
      font,
      color: rgb(102, 102, 102),
    })
    page.drawText('• Escompte de 2% pour paiement à 10 jours', {
      x: margins,
      y: footerY - 30,
      size: 9,
      font,
      color: rgb(102, 102, 102),
    })
    page.drawText('• En cas de retard: pénalités légales + intérêts', {
      x: margins,
      y: footerY - 45,
      size: 9,
      font,
      color: rgb(102, 102, 102),
    })

    // Page number
    page.drawText('Facture générée par SimplRH - www.simplrh.com', {
      x: margins,
      y: 20,
      size: 8,
      font,
      color: rgb(153, 153, 153),
    })

    // Save to buffer
    const pdfBytes = await pdfDoc.save()
    const buffer = Buffer.from(pdfBytes)

    console.log('PDF generated successfully with pdf-lib, size:', buffer.length, 'bytes')
    return buffer
  } catch (error) {
    console.error('Error during PDF generation:', error)
    throw error
  }
}

function getStatusLabel(status: string): string {
  const labels: { [key: string]: string } = {
    draft: 'Brouillon',
    sent: 'Envoyée',
    paid: 'Payée',
    overdue: 'En retard',
    partially_paid: 'Partiellement payée',
  }
  return labels[status] || status
}
