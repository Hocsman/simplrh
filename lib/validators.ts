import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})

export const signupSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères')
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>

// Organization schemas
export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  siret: z.string().optional()
})

export const organizationSchema = createOrganizationSchema

export type OrganizationFormData = z.infer<typeof organizationSchema>
export type CreateOrganizationData = z.infer<typeof createOrganizationSchema>

// Billing schemas
export const customerSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().default('France')
  }).optional()
})

export const invoiceItemSchema = z.object({
  label: z.string().min(1, 'La description est requise'),
  qty: z.number().min(0.01, 'La quantité doit être supérieure à 0'),
  unit_price: z.number().min(0, 'Le prix doit être positif'),
  vat_rate: z.number().min(0).max(100, 'Le taux de TVA doit être entre 0 et 100')
})

export const invoiceSchema = z.object({
  customer_id: z.string().uuid('ID client invalide'),
  due_date: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'Au moins un article est requis')
})

export type CustomerFormData = z.infer<typeof customerSchema>
export type InvoiceFormData = z.infer<typeof invoiceSchema>
export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>

// People schemas
export const employeeSchema = z.object({
  full_name: z.string().min(1, 'Le nom complet est requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  hire_date: z.string().optional()
})

export const leaveRequestSchema = z.object({
  employee_id: z.string().uuid('ID employé invalide'),
  type: z.enum(['CP', 'RTT', 'Maladie', 'Congé sans solde'], {
    errorMap: () => ({ message: 'Type de congé invalide' })
  }),
  start_date: z.string().min(1, 'Date de début requise'),
  end_date: z.string().min(1, 'Date de fin requise'),
  comment: z.string().optional()
})

export type EmployeeFormData = z.infer<typeof employeeSchema>
export type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>

// Documents schemas
export const documentGenerateSchema = z.object({
  template_key: z.string().min(1, 'Template requis'),
  payload: z.record(z.any())
})

export type DocumentGenerateFormData = z.infer<typeof documentGenerateSchema>

// Settings schemas
export const moduleSettingsSchema = z.object({
  billing: z.boolean(),
  people: z.boolean(),
  docs: z.boolean()
})

export const profileSettingsSchema = z.object({
  full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide')
})

export type ModuleSettingsFormData = z.infer<typeof moduleSettingsSchema>
export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>

// Utility validation functions
export function validateEmail(email: string): boolean {
  return z.string().email().safeParse(email).success
}

export function validateSIRET(siret: string): boolean {
  return /^\d{14}$/.test(siret)
}

export function validatePhoneNumber(phone: string): boolean {
  return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(phone)
}

export function validatePostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode)
}

// Form field validation helpers
export const fieldValidation = {
  required: (message = 'Ce champ est requis') => z.string().min(1, message),
  email: (message = 'Email invalide') => z.string().email(message),
  minLength: (min: number, message?: string) => 
    z.string().min(min, message || `Minimum ${min} caractères`),
  maxLength: (max: number, message?: string) => 
    z.string().max(max, message || `Maximum ${max} caractères`),
  number: (message = 'Doit être un nombre') => 
    z.number({ errorMap: () => ({ message }) }),
  positiveNumber: (message = 'Doit être un nombre positif') => 
    z.number().min(0, message),
  percentage: (message = 'Doit être entre 0 et 100') => 
    z.number().min(0).max(100, message),
  date: (message = 'Date invalide') => 
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, message),
  uuid: (message = 'Identifiant invalide') => 
    z.string().uuid(message)
}