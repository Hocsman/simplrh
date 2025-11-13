export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orgs: {
        Row: {
          id: string
          name: string
          siret: string | null
          billing_plan: string
          modules: Json
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          siret?: string | null
          billing_plan?: string
          modules?: Json
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          siret?: string | null
          billing_plan?: string
          modules?: Json
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      members: {
        Row: {
          org_id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          org_id: string
          user_id: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          org_id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          org_id: string
          name: string
          email: string | null
          address: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          email?: string | null
          address?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          email?: string | null
          address?: Json
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          org_id: string
          customer_id: string
          number: string
          status: string
          due_date: string | null
          total_ht: number
          total_ttc: number
          vat: number
          pdf_path: string | null
          facturx_xml_path: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          customer_id: string
          number: string
          status?: string
          due_date?: string | null
          total_ht?: number
          total_ttc?: number
          vat?: number
          pdf_path?: string | null
          facturx_xml_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          customer_id?: string
          number?: string
          status?: string
          due_date?: string | null
          total_ht?: number
          total_ttc?: number
          vat?: number
          pdf_path?: string | null
          facturx_xml_path?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          label: string
          qty: number
          unit_price: number
          vat_rate: number
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          label: string
          qty?: number
          unit_price: number
          vat_rate?: number
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          label?: string
          qty?: number
          unit_price?: number
          vat_rate?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          invoice_id: string
          method: string
          amount: number
          paid_at: string
          stripe_pi: string | null
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          method?: string
          amount: number
          paid_at?: string
          stripe_pi?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          method?: string
          amount?: number
          paid_at?: string
          stripe_pi?: string | null
          created_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          org_id: string
          user_id: string | null
          full_name: string
          email: string | null
          team_id: string | null
          hire_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          user_id?: string | null
          full_name: string
          email?: string | null
          team_id?: string | null
          hire_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          user_id?: string | null
          full_name?: string
          email?: string | null
          team_id?: string | null
          hire_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leave_requests: {
        Row: {
          id: string
          org_id: string
          employee_id: string
          type: string
          start_date: string
          end_date: string
          days: number
          status: string
          approver_id: string | null
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          employee_id: string
          type: string
          start_date: string
          end_date: string
          days?: number
          status?: string
          approver_id?: string | null
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          employee_id?: string
          type?: string
          start_date?: string
          end_date?: string
          days?: number
          status?: string
          approver_id?: string | null
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      absences: {
        Row: {
          id: string
          org_id: string
          employee_id: string
          date: string
          type: string
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          employee_id: string
          date: string
          type: string
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          employee_id?: string
          date?: string
          type?: string
          source?: string | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          org_id: string
          actor_id: string | null
          action: string
          target_table: string | null
          target_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          actor_id?: string | null
          action: string
          target_table?: string | null
          target_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          actor_id?: string | null
          action?: string
          target_table?: string | null
          target_id?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      doc_templates: {
        Row: {
          id: string
          org_id: string | null
          key: string
          locale: string
          version: number
          title: string
          schema: Json
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id?: string | null
          key: string
          locale?: string
          version?: number
          title: string
          schema?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string | null
          key?: string
          locale?: string
          version?: number
          title?: string
          schema?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      doc_requests: {
        Row: {
          id: string
          org_id: string
          template_key: string
          payload_json: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          template_key: string
          payload_json?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          template_key?: string
          payload_json?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      doc_files: {
        Row: {
          id: string
          org_id: string
          request_id: string
          path: string
          type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          request_id: string
          path: string
          type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          request_id?: string
          path?: string
          type?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Basic types for the app
export type UserRole = 'owner' | 'admin' | 'manager' | 'employee' | 'accountant' | 'legal'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'
export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected'
export type BillingPlan = 'starter' | 'business' | 'suite'
