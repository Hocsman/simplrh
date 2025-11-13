// Mock data for demo mode when Supabase is not configured
export const mockUser = {
  id: 'demo-user-1',
  email: 'demo@simplrh.com',
  full_name: 'Utilisateur Démo'
}

export const mockOrganization = {
  id: 'demo-org-1',
  name: 'Entreprise Démo',
  siret: '12345678901234',
  billing_plan: 'starter',
  modules: { billing: true, people: true, docs: true },
  owner_id: 'demo-user-1'
}

export const mockCustomers = [
  {
    id: 'demo-customer-1',
    org_id: 'demo-org-1',
    name: 'Client Demo',
    email: 'client@demo.com',
    address: {
      street: '123 Rue de la Paix',
      city: 'Paris',
      postal_code: '75001',
      country: 'France'
    }
  }
]

export const mockInvoices = [
  {
    id: 'demo-invoice-1',
    org_id: 'demo-org-1',
    customer_id: 'demo-customer-1',
    number: 'FAC-2024-001',
    status: 'sent',
    due_date: '2024-02-15',
    total_ht: 1000.00,
    total_ttc: 1200.00,
    vat: 200.00,
    created_at: '2024-01-15T10:00:00Z'
  }
]

export const mockEmployees = [
  {
    id: 'demo-employee-1',
    org_id: 'demo-org-1',
    full_name: 'Jean Dupont',
    email: 'jean.dupont@demo.com',
    hire_date: '2023-01-01'
  }
]

export const mockLeaveRequests = [
  {
    id: 'demo-leave-1',
    org_id: 'demo-org-1',
    employee_id: 'demo-employee-1',
    type: 'CP',
    start_date: '2024-02-01',
    end_date: '2024-02-05',
    status: 'pending',
    created_at: '2024-01-20T10:00:00Z'
  }
]

export const mockDocuments = [
  {
    id: 'demo-doc-1',
    org_id: 'demo-org-1',
    template_key: 'contrat-prestation',
    status: 'generated',
    created_at: '2024-01-10T10:00:00Z'
  }
]







