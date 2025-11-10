import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  UserCheck,
  Calendar,
  Clock,
  Download,
  BarChart3
} from 'lucide-react'

export default function PeopleLayout({
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
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Facturation
            </Link>
            <Link 
              href="/people" 
              className="flex items-center text-sm font-medium text-blue-600 border-b-2 border-blue-600"
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
              href="/people"
              className="flex items-center space-x-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-md"
            >
              <Users className="h-4 w-4" />
              <span>Vue d'ensemble</span>
            </Link>
            <Link 
              href="/people/employees"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
            >
              <UserCheck className="h-4 w-4" />
              <span>Employés</span>
            </Link>
            <Link 
              href="/people/leave-requests"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
            >
              <Calendar className="h-4 w-4" />
              <span>Congés</span>
            </Link>
            <Link 
              href="/people/absences"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
            >
              <Clock className="h-4 w-4" />
              <span>Absences</span>
            </Link>
            <Link 
              href="/people/payroll"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
            >
              <Download className="h-4 w-4" />
              <span>Export paie</span>
            </Link>
            <Link 
              href="/people/reports"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Rapports</span>
            </Link>
            <Link 
              href="/people/settings"
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