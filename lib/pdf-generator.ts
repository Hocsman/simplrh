// Use pdf-lib instead of PDFKit to avoid file system issues on serverless
import { generateInvoicePDFWithPdfLib } from './pdf-generator-pdflib'
import { Invoice, Customer, InvoiceItem } from '../domains/billing/invoices'
import { FacturXInvoiceData } from './facturx'

export interface PDFInvoiceData {
  invoice: Invoice & { customer?: any }
  organization?: any
  items: InvoiceItem[]
}

export async function generateInvoicePDF(data: PDFInvoiceData): Promise<Buffer> {
  // Delegate to pdf-lib implementation which doesn't require file system access
  // pdf-lib is pure JavaScript and works on Vercel serverless
  return generateInvoicePDFWithPdfLib(data)
}

export function generateDocumentPDF(templateKey: string, payload: Record<string, any>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Document generation not yet implemented with pdf-lib
      reject(new Error('Document generation not yet implemented'))
    } catch (error) {
      reject(error)
    }
  })
}
