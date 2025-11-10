import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  Menu
} from 'lucide-react'

export default function DashboardLayout({
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

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  )
}