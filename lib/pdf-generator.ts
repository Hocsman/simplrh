import PDFDocument from 'pdfkit'
import { Invoice, Customer, InvoiceItem } from '../domains/billing/invoices'
import { FacturXInvoiceData } from './facturx'

export interface PDFInvoiceData extends Invoice {
  customer: Customer
  items: InvoiceItem[]
  company: {
    name: string
    address: string
    siret?: string
    email?: string
    phone?: string
  }
}

export function generateInvoicePDF(data: PDFInvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 })
      const chunks: Buffer[] = []

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))

      // Header
      doc.fontSize(20)
         .text('FACTURE', 50, 50)
         .fontSize(10)
         .text(`N° ${data.number}`, 50, 80)
         .text(`Date: ${new Date(data.created_at).toLocaleDateString('fr-FR')}`, 50, 95)
         
      if (data.due_date) {
        doc.text(`Échéance: ${new Date(data.due_date).toLocaleDateString('fr-FR')}`, 50, 110)
      }

      // Company info (right side)
      doc.text(data.company.name, 350, 50)
         .text(data.company.address, 350, 65)
         
      if (data.company.siret) {
        doc.text(`SIRET: ${data.company.siret}`, 350, 95)
      }
      if (data.company.email) {
        doc.text(data.company.email, 350, 110)
      }

      // Customer info
      doc.text('Facturé à:', 50, 160)
         .text(data.customer.name, 50, 175)
         
      if (data.customer.address) {
        const addr = data.customer.address
        const addressLines = [
          addr.street,
          `${addr.postal_code || ''} ${addr.city || ''}`,
          addr.country
        ].filter(Boolean)
        
        addressLines.forEach((line, index) => {
          doc.text(line, 50, 190 + (index * 15))
        })
      }

      // Items table
      const tableTop = 280
      const itemCodeX = 50
      const descriptionX = 150
      const quantityX = 350
      const priceX = 400
      const amountX = 470

      // Table headers
      doc.text('Code', itemCodeX, tableTop)
         .text('Description', descriptionX, tableTop)
         .text('Qté', quantityX, tableTop)
         .text('Prix HT', priceX, tableTop)
         .text('Total HT', amountX, tableTop)

      // Draw line under headers
      doc.moveTo(50, tableTop + 15)
         .lineTo(550, tableTop + 15)
         .stroke()

      let y = tableTop + 30

      // Items
      data.items.forEach((item, index) => {
        const total = item.qty * item.unit_price
        
        doc.text(String(index + 1), itemCodeX, y)
           .text(item.label, descriptionX, y, { width: 180 })
           .text(String(item.qty), quantityX, y)
           .text(`${item.unit_price.toFixed(2)} €`, priceX, y)
           .text(`${total.toFixed(2)} €`, amountX, y)
           
        y += 20
      })

      // Totals
      const totalsX = 400
      y += 20

      doc.text(`Total HT: ${data.total_ht.toFixed(2)} €`, totalsX, y)
         .text(`TVA (20%): ${data.vat.toFixed(2)} €`, totalsX, y + 15)
         .fontSize(12)
         .text(`Total TTC: ${data.total_ttc.toFixed(2)} €`, totalsX, y + 35)

      // Footer
      doc.fontSize(8)
         .text('Conditions de paiement: 30 jours net', 50, 700)
         .text('En cas de retard de paiement, des pénalités de retard seront appliquées.', 50, 715)

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
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











