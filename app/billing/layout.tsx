import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  CreditCard,
  Users,
  FileText,
  Settings,
  LogOut,
  Receipt,
  UserCheck,
  DollarSign,
  Bell
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            SimplRH
          </Link>
          
          <nav className="hidden md:flex ml-8 space-x-6">
            <Link 
              href="/dashboard" 
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
            <Link 
              href="/billing" 
              className="flex items-center text-sm font-medium text-blue-600 border-b-2 border-blue-600"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Facturation
            </Link>
            <Link 
              href="/people" 
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <Users className="h-4 w-4 mr-2" />
              RH
            </Link>
            <Link 
              href="/docs" 
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </Link>
          </nav>

          <div className="ml-auto flex items-center space-x-4">
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <nav className="p-4 space-y-2">
            <Link 
              href="/billing"
              className="flex items-center space-x-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-md"
            >
              <Receipt className="h-4 w-4" />
              <span>Factures</span>
            </Link>
            <Link 
              href="/billing/customers"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
            >
              <UserCheck className="h-4 w-4" />
              <span>Clients</span>
            </Link>
            <Link 
              href="/billing/payments"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
            >
              <DollarSign className="h-4 w-4" />
              <span>Paiements</span>
            </Link>
            <Link 
              href="/billing/reminders"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
            >
              <Bell className="h-4 w-4" />
              <span>Relances</span>
            </Link>
            <Link 
              href="/billing/settings"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
            >
              <Settings className="h-4 w-4" />
              <span>Paramètres</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}