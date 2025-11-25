import mailjet from 'node-mailjet'

// Configuration Mailjet
const mailjetClient = process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY
  ? mailjet
      .apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY)
  : null

interface SendInvoiceEmailProps {
  to: string
  invoiceNumber: string
  customerName: string
  totalTTC: number
  dueDate?: string
  pdfBuffer: Buffer
  organizationName: string
  organizationEmail: string
}

/**
 * Envoyer une facture par email
 */
export async function sendInvoiceEmail(props: SendInvoiceEmailProps) {
  const {
    to,
    invoiceNumber,
    customerName,
    totalTTC,
    dueDate,
    pdfBuffer,
    organizationName,
    organizationEmail,
  } = props

  const dueDateFormatted = dueDate
    ? new Date(dueDate).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'À convenir'

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Facture ${invoiceNumber}</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">De ${organizationName}</p>
      </div>

      <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 8px 8px;">
        <p style="color: #333; margin: 0 0 20px 0;">Bonjour ${customerName},</p>

        <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
          Veuillez trouver ci-joint votre facture pour un montant de <strong>${totalTTC.toFixed(2)} €</strong>.
        </p>

        ${
          dueDate
            ? `<div style="background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #333;"><strong>Date limite de paiement :</strong></p>
                <p style="margin: 5px 0 0 0; color: #667eea; font-size: 18px; font-weight: bold;">${dueDateFormatted}</p>
              </div>`
            : ''
        }

        <h3 style="color: #333; margin: 25px 0 15px 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
          Informations de paiement
        </h3>

        <p style="color: #666; line-height: 1.6; margin: 0 0 10px 0;">
          Vous pouvez télécharger votre facture en pièce jointe ou depuis votre espace client.
        </p>

        <div style="background: #f0f0f0; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="color: #666; margin: 0; font-size: 13px;">
            Facture émise par <strong>${organizationName}</strong><br>
            Email : <a href="mailto:${organizationEmail}" style="color: #667eea;">${organizationEmail}</a>
          </p>
        </div>

        <p style="color: #999; font-size: 12px; margin: 20px 0 0 0; text-align: center;">
          Cet email a été généré automatiquement par SimplRH.<br>
          Merci de votre confiance !
        </p>
      </div>
    </div>
  `

  const fromEmail = process.env.SMTP_FROM || organizationEmail

  try {
    // Vérifier la configuration Mailjet
    if (!mailjetClient) {
      console.warn('⚠️ Mailjet not configured - email would be sent in production')
      console.log('Email preview:', {
        to,
        subject: `Votre facture ${invoiceNumber} - ${organizationName}`,
        hasAttachment: !!pdfBuffer,
      })
      return { success: true, preview: true }
    }

    // Convertir le PDF buffer en base64 pour l'attachement
    const pdfBase64 = pdfBuffer.toString('base64')

    const result = await (mailjetClient as any)
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: organizationName,
            },
            To: [
              {
                Email: to,
                Name: customerName,
              },
            ],
            Subject: `Votre facture ${invoiceNumber} - ${organizationName}`,
            HTMLPart: html,
            Attachments: [
              {
                ContentType: 'application/pdf',
                Filename: `${invoiceNumber}.pdf`,
                Base64Content: pdfBase64,
              },
            ],
          },
        ],
      })

    const messageId = result.body?.Messages?.[0]?.ID || 'sent'
    console.log('✅ Email sent successfully via Mailjet:', messageId)
    return { success: true, messageId }
  } catch (error: any) {
    console.error('❌ Error sending email via Mailjet:', error)
    throw new Error(`Erreur lors de l'envoi du email: ${error.message}`)
  }
}

interface SendReminderEmailProps {
  to: string
  invoiceNumber: string
  customerName: string
  amountDue: number
  daysSinceOverdue: number
  dueDate: string
  organizationName: string
  organizationEmail: string
}

/**
 * Envoyer une relance de paiement
 */
export async function sendReminderEmail(props: SendReminderEmailProps) {
  const {
    to,
    invoiceNumber,
    customerName,
    amountDue,
    daysSinceOverdue,
    dueDate,
    organizationName,
    organizationEmail,
  } = props

  const dueDateFormatted = new Date(dueDate).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  let subject = `Relance : Facture ${invoiceNumber} en attente`
  let greeting = `Bonjour ${customerName},`
  let message = `Nous vous rappelons que la facture <strong>${invoiceNumber}</strong> d'un montant de <strong>${amountDue.toFixed(2)} €</strong> n'a toujours pas été réglée.`

  if (daysSinceOverdue > 30) {
    subject = `⚠️ Mise en demeure : Facture ${invoiceNumber} impayée`
    message = `Malgré nos relances précédentes, la facture <strong>${invoiceNumber}</strong> d'un montant de <strong>${amountDue.toFixed(2)} €</strong> reste impayée depuis plus de 30 jours.`
  } else if (daysSinceOverdue > 15) {
    subject = `Deuxième relance : Facture ${invoiceNumber} en retard`
    message = `La facture <strong>${invoiceNumber}</strong> d'un montant de <strong>${amountDue.toFixed(2)} €</strong> est en retard de paiement depuis ${daysSinceOverdue} jours.`
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${daysSinceOverdue > 30 ? '#dc3545' : '#ffc107'}; padding: 30px; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Rappel de paiement</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Facture ${invoiceNumber}</p>
      </div>

      <div style="padding: 30px; background: #f9f9f9;">
        <p style="color: #333; margin: 0 0 20px 0;">${greeting}</p>

        <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
          ${message}
        </p>

        <div style="background: white; border-left: 4px solid ${daysSinceOverdue > 30 ? '#dc3545' : '#ffc107'}; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; text-align: left;">
            <tr>
              <td style="color: #666; padding: 5px 0;">Numéro de facture :</td>
              <td style="color: #333; font-weight: bold; padding: 5px 0;">${invoiceNumber}</td>
            </tr>
            <tr>
              <td style="color: #666; padding: 5px 0;">Montant dû :</td>
              <td style="color: #333; font-weight: bold; padding: 5px 0; font-size: 18px;">${amountDue.toFixed(2)} €</td>
            </tr>
            <tr>
              <td style="color: #666; padding: 5px 0;">Date d'échéance :</td>
              <td style="color: #333; padding: 5px 0;">${dueDateFormatted}</td>
            </tr>
            <tr>
              <td style="color: #666; padding: 5px 0;">Jours de retard :</td>
              <td style="color: ${daysSinceOverdue > 15 ? '#dc3545' : '#ffc107'}; font-weight: bold; padding: 5px 0;">${daysSinceOverdue} jour${daysSinceOverdue > 1 ? 's' : ''}</td>
            </tr>
          </table>
        </div>

        <p style="color: #666; line-height: 1.6; margin: 20px 0;">
          Nous vous remercions de régulariser cette situation au plus tôt.
        </p>

        <div style="background: #f0f0f0; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="color: #666; margin: 0; font-size: 13px;">
            Facture émise par <strong>${organizationName}</strong><br>
            Email : <a href="mailto:${organizationEmail}" style="color: #667eea;">${organizationEmail}</a>
          </p>
        </div>

        <p style="color: #999; font-size: 12px; margin: 20px 0 0 0; text-align: center;">
          Cet email a été généré automatiquement par SimplRH.
        </p>
      </div>
    </div>
  `

  const fromEmail = process.env.SMTP_FROM || organizationEmail

  try {
    // Vérifier la configuration Mailjet
    if (!mailjetClient) {
      console.warn('⚠️ Mailjet not configured - reminder would be sent in production')
      return { success: true, preview: true }
    }

    const result = await (mailjetClient as any)
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: organizationName,
            },
            To: [
              {
                Email: to,
                Name: customerName,
              },
            ],
            Subject: subject,
            HTMLPart: html,
          },
        ],
      })

    const messageId = result.body?.Messages?.[0]?.ID || 'sent'
    console.log('✅ Reminder email sent successfully via Mailjet:', messageId)
    return { success: true, messageId }
  } catch (error: any) {
    console.error('❌ Error sending reminder email via Mailjet:', error)
    throw new Error(`Erreur lors de l'envoi de la relance: ${error.message}`)
  }
}
