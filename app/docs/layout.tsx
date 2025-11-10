import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  File,
  Files,
  History,
  FolderOpen
} from 'lucide-react'

export default function DocsLayout({
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
              className="flex items-center text-sm font-medium text-blue-600 border-b-2 border-blue-600"
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
              href="/docs"
              className="flex items-center space-x-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-md"
            >
              <FileText className="h-4 w-4" />
              <span>Vue d'ensemble</span>
            </Link>
            <Link 
              href="/docs/generate"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
            >
              <File className="h-4 w-4" />
              <span>Générer</span>
            </Link>
            <Link 
              href="/docs/templates"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
            >
              <Files className="h-4 w-4" />
              <span>Modèles</span>
            </Link>
            <Link 
              href="/docs/history"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
            >
              <History className="h-4 w-4" />
              <span>Historique</span>
            </Link>
            <Link 
              href="/docs/library"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
            >
              <FolderOpen className="h-4 w-4" />
              <span>Bibliothèque</span>
            </Link>
            <Link 
              href="/docs/settings"
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