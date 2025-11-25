import PDFDocument from 'pdfkit'
import { Invoice, Customer, InvoiceItem } from '../domains/billing/invoices'
import { FacturXInvoiceData } from './facturx'

export interface PDFInvoiceData {
  invoice: Invoice & { customer?: any }
  organization?: any
  items: InvoiceItem[]
}

export function generateInvoicePDF(data: PDFInvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' })
      const chunks: Buffer[] = []

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))

      const { invoice, organization, items } = data
      const pageWidth = doc.page.width
      const pageHeight = doc.page.height
      const margins = 40

      // En-tête - Titre facture
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .text('FACTURE', margins, 40)

      // Infos facture (droite)
      doc.fontSize(10)
         .font('Helvetica')
         .text(`N° ${invoice.number}`, pageWidth - 200, 45)
         .text(`Date: ${new Date(invoice.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - 200, 60)

      if (invoice.due_date) {
        doc.text(`Date limite: ${new Date(invoice.due_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - 200, 75)
      }

      doc.text(`Statut: ${getStatusLabel(invoice.status)}`, pageWidth - 200, invoice.due_date ? 90 : 75)

      // Séparateur
      doc.moveTo(margins, 110).lineTo(pageWidth - margins, 110).stroke()

      // Infos émetteur (organisation)
      if (organization) {
        doc.fontSize(11)
           .font('Helvetica-Bold')
           .text('Facturé par', margins, 130)

        doc.fontSize(10)
           .font('Helvetica')
           .text(organization.name, margins, 150)

        if (organization.siret) {
          doc.text(`SIRET: ${organization.siret}`, margins, 166)
        }
        if (organization.address) {
          doc.text(organization.address, margins, 182)
        }
        if (organization.email) {
          doc.text(`Email: ${organization.email}`, margins, 198)
        }
        if (organization.phone) {
          doc.text(`Tél: ${organization.phone}`, margins, 214)
        }
      }

      // Infos client
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('Facturé à', pageWidth - 200, 130)

      doc.fontSize(10)
         .font('Helvetica')
         .text(invoice.customer?.name || 'Client', pageWidth - 200, 150)

      if (invoice.customer?.address) {
        const addr = invoice.customer.address
        if (typeof addr === 'object') {
          if (addr.street) doc.text(addr.street, pageWidth - 200, 166)
          if (addr.postal_code || addr.city) {
            doc.text(`${addr.postal_code || ''} ${addr.city || ''}`, pageWidth - 200, 182)
          }
          if (addr.country) doc.text(addr.country, pageWidth - 200, 198)
        } else if (typeof addr === 'string') {
          doc.text(addr, pageWidth - 200, 166)
        }
      }
      if (invoice.customer?.email) {
        doc.text(`Email: ${invoice.customer.email}`, pageWidth - 200, 214)
      }

      // Tableau des articles
      const tableTop = 250
      const rowHeight = 25
      const cellPadding = 8

      // Headers
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#f0f0f0')
         .rect(margins, tableTop, pageWidth - 2 * margins, rowHeight)
         .fill()

      doc.fillColor('#000000')
      doc.text('Description', margins + cellPadding, tableTop + cellPadding, { width: 200 })
      doc.text('Quantité', margins + 220, tableTop + cellPadding, { width: 60 })
      doc.text('Prix unitaire', margins + 300, tableTop + cellPadding, { width: 70 })
      doc.text('TVA', margins + 390, tableTop + cellPadding, { width: 40 })
      doc.text('Total HT', margins + 450, tableTop + cellPadding, { width: 60 })

      let currentY = tableTop + rowHeight

      // Lignes articles
      doc.fontSize(9)
         .font('Helvetica')

      items.forEach((item, index) => {
        const rowTotal = item.qty * item.unit_price
        const rowVat = rowTotal * ((item.vat_rate || 20) / 100)

        doc.text(item.label, margins + cellPadding, currentY + cellPadding, { width: 200 })
        doc.text(String(item.qty), margins + 220, currentY + cellPadding, { width: 60 })
        doc.text(`${item.unit_price.toFixed(2)} €`, margins + 300, currentY + cellPadding, { width: 70 })
        doc.text(`${(item.vat_rate || 20)}%`, margins + 390, currentY + cellPadding, { width: 40 })
        doc.text(`${rowTotal.toFixed(2)} €`, margins + 450, currentY + cellPadding, { width: 60 })

        // Ligne de séparation
        doc.moveTo(margins, currentY + rowHeight).lineTo(pageWidth - margins, currentY + rowHeight).stroke()
        currentY += rowHeight
      })

      // Totaux
      const totalY = currentY + 15
      const totalBoxX = margins + 350

      doc.fontSize(10)
         .font('Helvetica')
      doc.text('Sous-total:', totalBoxX, totalY)
      doc.text(`${invoice.total_ht.toFixed(2)} €`, pageWidth - margins - 60, totalY)

      doc.text('TVA (20%):', totalBoxX, totalY + 20)
      doc.text(`${invoice.vat.toFixed(2)} €`, pageWidth - margins - 60, totalY + 20)

      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#667eea')
      doc.text('TOTAL TTC:', totalBoxX, totalY + 45)
      doc.fillColor('#000000')
      doc.text(`${invoice.total_ttc.toFixed(2)} €`, pageWidth - margins - 60, totalY + 45)

      // Conditions de paiement (footer)
      const footerY = pageHeight - 100

      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#666666')
         .text('Conditions de paiement', margins, footerY, { underline: true })
         .text('• Délai de paiement: 30 jours net', margins, footerY + 15)
         .text('• Escompte de 2% pour paiement à 10 jours', margins, footerY + 30)
         .text('• En cas de retard: pénalités légales + intérêts', margins, footerY + 45)

      // Numéro de page
      doc.fontSize(8)
         .fillColor('#999999')
         .text('Facture générée par SimplRH - www.simplrh.com', margins, pageHeight - 20, { align: 'center' })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

function getStatusLabel(status: string): string {
  const labels: { [key: string]: string } = {
    'draft': 'Brouillon',
    'sent': 'Envoyée',
    'paid': 'Payée',
    'overdue': 'En retard',
    'partially_paid': 'Partiellement payée'
  }
  return labels[status] || status
}

export function generateDocumentPDF(templateKey: string, payload: Record<string, any>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 })
      const chunks: Buffer[] = []

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))

      // Generate different documents based on template
      switch (templateKey) {
        case 'contrat-prestation':
          generateContractPDF(doc, payload)
          break
        case 'cgv-ecommerce':
          generateCGVPDF(doc, payload)
          break
        case 'mise-en-demeure':
          generateMiseEnDemeurePDF(doc, payload)
          break
        default:
          throw new Error(`Unknown template: ${templateKey}`)
      }

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

function generateContractPDF(doc: PDFKit.PDFDocument, payload: any) {
  doc.fontSize(16).text('CONTRAT DE PRESTATION DE SERVICES', 50, 50, { align: 'center' })
  
  doc.fontSize(12).text('Entre les soussignés :', 50, 100)
  
  // Prestataire
  doc.text('LE PRESTATAIRE :', 50, 130)
  doc.fontSize(10)
     .text(payload.prestataire.nom, 70, 150)
     .text(payload.prestataire.adresse, 70, 165)
  
  if (payload.prestataire.siret) {
    doc.text(`SIRET: ${payload.prestataire.siret}`, 70, 180)
  }
  
  // Client
  doc.fontSize(12).text('LE CLIENT :', 50, 210)
  doc.fontSize(10)
     .text(payload.client.nom, 70, 230)
     .text(payload.client.adresse, 70, 245)
  
  // Prestation
  doc.fontSize(12).text('OBJET DE LA PRESTATION :', 50, 280)
  doc.fontSize(10)
     .text(payload.prestation.description, 70, 300, { width: 450 })
  
  if (payload.prestation.duree) {
    doc.text(`Durée: ${payload.prestation.duree}`, 70, 340)
  }
  
  doc.text(`Prix: ${payload.prestation.prix} € HT`, 70, 355)
  
  // Conditions générales
  doc.fontSize(12).text('CONDITIONS GÉNÉRALES :', 50, 390)
  doc.fontSize(10)
     .text('- Le présent contrat prend effet à sa signature par les deux parties.', 70, 410)
     .text('- Les prestations seront réalisées avec le plus grand soin.', 70, 425)
     .text('- Le paiement s\'effectuera sous 30 jours à réception de facture.', 70, 440)
  
  // Signatures
  doc.text('Fait en deux exemplaires', 50, 500)
     .text('Le prestataire', 100, 550)
     .text('Le client', 350, 550)
}

function generateCGVPDF(doc: PDFKit.PDFDocument, payload: any) {
  doc.fontSize(16).text('CONDITIONS GÉNÉRALES DE VENTE', 50, 50, { align: 'center' })
  
  doc.fontSize(12).text('Article 1 - Informations légales', 50, 100)
  doc.fontSize(10)
     .text(`Raison sociale: ${payload.entreprise.nom}`, 70, 120)
     .text(`Adresse: ${payload.entreprise.adresse}`, 70, 135)
     .text(`SIRET: ${payload.entreprise.siret}`, 70, 150)
     .text(`Email: ${payload.entreprise.email}`, 70, 165)
     .text(`Site web: ${payload.site.url}`, 70, 180)
  
  doc.fontSize(12).text('Article 2 - Objet', 50, 210)
  doc.fontSize(10)
     .text(`Les présentes conditions générales régissent les ventes de ${payload.site.activite} sur le site ${payload.site.url}.`, 70, 230, { width: 450 })
  
  doc.fontSize(12).text('Article 3 - Prix', 50, 270)
  doc.fontSize(10)
     .text('Les prix sont indiqués en euros TTC. Ils peuvent être modifiés à tout moment.', 70, 290, { width: 450 })
  
  doc.fontSize(12).text('Article 4 - Commandes', 50, 330)
  doc.fontSize(10)
     .text('Toute commande implique l\'acceptation des présentes conditions générales.', 70, 350, { width: 450 })
  
  doc.fontSize(12).text('Article 5 - Livraison', 50, 390)
  doc.fontSize(10)
     .text('Les délais de livraison sont donnés à titre indicatif.', 70, 410, { width: 450 })
}

function generateMiseEnDemeurePDF(doc: PDFKit.PDFDocument, payload: any) {
  const today = new Date().toLocaleDateString('fr-FR')
  
  doc.fontSize(16).text('MISE EN DEMEURE', 50, 50, { align: 'center' })
  
  // Expéditeur
  doc.fontSize(10)
     .text(payload.expediteur.nom, 50, 100)
     .text(payload.expediteur.adresse, 50, 115)
  
  // Destinataire
  doc.text(payload.destinataire.nom, 350, 100)
     .text(payload.destinataire.adresse, 350, 115)
  
  doc.text(`Le ${today}`, 350, 160)
  
  // Objet
  doc.fontSize(12).text('Objet: Mise en demeure de payer', 50, 200)
  
  doc.fontSize(10).text('Madame, Monsieur,', 50, 240)
  
  doc.text(`Malgré nos précédents courriers, nous constatons que ${payload.objet.description} d'un montant de ${payload.objet.montant} €, échue le ${payload.objet.echeance}, demeure impayée.`, 50, 270, { width: 450 })
  
  doc.text(`En conséquence, nous vous mettons en demeure de procéder au règlement de cette somme dans un délai de ${payload.objet.delai || 8} jours à compter de la réception de la présente.`, 50, 320, { width: 450 })
  
  doc.text('À défaut, nous nous réservons le droit d\'engager toute action en recouvrement, y compris judiciaire.', 50, 370, { width: 450 })
  
  doc.text('Veuillez agréer, Madame, Monsieur, nos salutations distinguées.', 50, 420)
  
  doc.text(payload.expediteur.nom, 350, 480)
}












