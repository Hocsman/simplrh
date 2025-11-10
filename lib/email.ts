import nodemailer from 'nodemailer'

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  } : undefined
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType?: string
  }>
}

export async function sendEmail(options: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@simplrh.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

export function generateInvoiceEmailHTML(invoiceNumber: string, customerName: string, amount: number): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Facture ${invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .amount { font-size: 24px; font-weight: bold; color: #28a745; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 14px; color: #6c757d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouvelle facture</h1>
          <p>Bonjour ${customerName},</p>
        </div>
        
        <p>Vous trouverez ci-joint votre facture <strong>${invoiceNumber}</strong> d'un montant de <span class="amount">${amount.toFixed(2)} €</span>.</p>
        
        <p>Cette facture est payable sous 30 jours à réception.</p>
        
        <p>Pour toute question concernant cette facture, n'hésitez pas à nous contacter.</p>
        
        <p>Cordialement,<br>L'équipe SimplRH</p>
        
        <div class="footer">
          <p>Cet email a été envoyé automatiquement depuis SimplRH.<br>
          Merci de ne pas répondre à cet email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateLeaveRequestEmailHTML(
  employeeName: string, 
  type: string, 
  startDate: string, 
  endDate: string,
  comment?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouvelle demande de congé</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .details { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .actions { margin: 30px 0; text-align: center; }
        .btn { display: inline-block; padding: 12px 24px; margin: 0 10px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .btn-approve { background: #28a745; color: white; }
        .btn-reject { background: #dc3545; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouvelle demande de congé</h1>
        </div>
        
        <p><strong>${employeeName}</strong> a fait une demande de congé :</p>
        
        <div class="details">
          <p><strong>Type :</strong> ${type}</p>
          <p><strong>Du :</strong> ${new Date(startDate).toLocaleDateString('fr-FR')}</p>
          <p><strong>Au :</strong> ${new Date(endDate).toLocaleDateString('fr-FR')}</p>
          ${comment ? `<p><strong>Commentaire :</strong> ${comment}</p>` : ''}
        </div>
        
        <div class="actions">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/people/leave-requests" class="btn btn-approve">Approuver</a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/people/leave-requests" class="btn btn-reject">Rejeter</a>
        </div>
        
        <p>Connectez-vous à SimplRH pour traiter cette demande.</p>
      </div>
    </body>
    </html>
  `
}

export function generateWelcomeEmailHTML(userName: string, organizationName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bienvenue sur SimplRH</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; }
        .logo { font-size: 32px; font-weight: bold; color: #2563eb; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0; }
        .cta { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; padding: 15px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SimplRH</div>
          <p>La suite admin pour PME</p>
        </div>
        
        <div class="content">
          <h2>Bienvenue ${userName} !</h2>
          
          <p>Félicitations ! Votre organisation <strong>${organizationName}</strong> est maintenant configurée sur SimplRH.</p>
          
          <p>Vous pouvez dès maintenant :</p>
          <ul>
            <li>📄 Créer vos premières factures</li>
            <li>👥 Gérer vos équipes et congés</li>
            <li>📋 Générer des documents juridiques</li>
          </ul>
          
          <div class="cta">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">Accéder au tableau de bord</a>
          </div>
        </div>
        
        <p>Besoin d'aide ? Consultez notre <a href="${process.env.NEXT_PUBLIC_APP_URL}/docs">documentation</a> ou contactez notre support.</p>
        
        <p>L'équipe SimplRH</p>
      </div>
    </body>
    </html>
  `
}
