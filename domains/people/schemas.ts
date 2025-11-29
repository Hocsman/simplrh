import { z } from 'zod'

/**
 * Validation schemas for people/HR domain
 */

// Employee schemas
export const createEmployeeSchema = z.object({
    full_name: z.string().min(1, 'Le nom complet est requis').max(255),
    email: z.string().email('Email invalide').optional().or(z.literal('')),
    phone: z.string().optional(),
    position: z.string().optional(),
    department: z.string().optional(),
    hire_date: z.string().refine((date) => {
        const parsed = new Date(date)
        return !isNaN(parsed.getTime())
    }, 'Date d\'embauche invalide').optional(),
    salary: z.number().nonnegative('Le salaire doit être positif ou nul').optional(),
    status: z.enum(['active', 'inactive', 'on_leave'], {
        errorMap: () => ({ message: 'Statut invalide' })
    }).default('active')
})

export const updateEmployeeSchema = createEmployeeSchema.partial()

// Leave request schemas
export const createLeaveRequestSchema = z.object({
    employee_id: z.string().uuid('ID employé invalide'),
    type: z.enum(['paid_leave', 'sick_leave', 'unpaid_leave', 'parental_leave', 'other'], {
        errorMap: () => ({ message: 'Type de congé invalide' })
    }),
    start_date: z.string().refine((date) => {
        const parsed = new Date(date)
        return !isNaN(parsed.getTime())
    }, 'Date de début invalide'),
    end_date: z.string().refine((date) => {
        const parsed = new Date(date)
        return !isNaN(parsed.getTime())
    }, 'Date de fin invalide'),
    comment: z.string().max(1000, 'Le commentaire ne peut pas dépasser 1000 caractères').optional()
}).refine((data) => {
    const start = new Date(data.start_date)
    const end = new Date(data.end_date)
    return end >= start
}, {
    message: 'La date de fin doit être après la date de début',
    path: ['end_date']
})

export const updateLeaveRequestStatusSchema = z.object({
    status: z.enum(['approved', 'rejected'], {
        errorMap: () => ({ message: 'Statut invalide (approved ou rejected uniquement)' })
    }),
    comment: z.string().max(1000).optional()
})

// Absence schemas
export const createAbsenceSchema = z.object({
    employee_id: z.string().uuid('ID employé invalide'),
    date: z.string().refine((date) => {
        const parsed = new Date(date)
        return !isNaN(parsed.getTime())
    }, 'Date invalide'),
    type: z.enum(['sick', 'vacation', 'unpaid', 'other'], {
        errorMap: () => ({ message: 'Type d\'absence invalide' })
    }),
    reason: z.string().max(500).optional()
})

// Export types
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>
export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestSchema>
export type UpdateLeaveRequestStatusInput = z.infer<typeof updateLeaveRequestStatusSchema>
export type CreateAbsenceInput = z.infer<typeof createAbsenceSchema>
