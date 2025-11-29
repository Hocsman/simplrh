import { z } from 'zod'

/**
 * Validation schemas for billing domain
 */

// Customer schemas
export const createCustomerSchema = z.object({
    name: z.string().min(1, 'Le nom est requis').max(255),
    email: z.string().email('Email invalide').optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    siret: z.string()
        .regex(/^\d{14}$/, 'Le SIRET doit contenir 14 chiffres')
        .optional()
        .or(z.literal('')),
    vat_number: z.string().optional()
})

export const updateCustomerSchema = createCustomerSchema.partial()

// Payment schemas
export const createPaymentSchema = z.object({
    invoice_id: z.string().uuid('ID de facture invalide'),
    amount: z.number().positive('Le montant doit être positif'),
    method: z.enum(['card', 'bank_transfer', 'check', 'cash'], {
        errorMap: () => ({ message: 'Méthode de paiement invalide' })
    }),
    reference: z.string().optional(),
    notes: z.string().optional()
})

// Invoice schemas
export const createInvoiceItemSchema = z.object({
    label: z.string().min(1, 'Le libellé est requis'),
    qty: z.number().positive('La quantité doit être positive'),
    unit_price: z.number().nonnegative('Le prix unitaire doit être positif ou nul'),
    vat_rate: z.number().min(0).max(100, 'Le taux de TVA doit être entre 0 et 100')
})

export const createInvoiceSchema = z.object({
    customer_id: z.string().uuid('ID client invalide'),
    due_date: z.string().optional(),
    items: z.array(createInvoiceItemSchema)
        .min(1, 'Au moins un article est requis')
        .max(50, 'Maximum 50 articles par facture')
})

export const updateInvoiceStatusSchema = z.object({
    status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled'], {
        errorMap: () => ({ message: 'Statut invalide' })
    })
})

// Export types
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>
export type UpdateInvoiceStatusInput = z.infer<typeof updateInvoiceStatusSchema>
