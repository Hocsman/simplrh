import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  CreditCard, 
  Users, 
  FileText, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Euro,
  Settings
} from 'lucide-react'

export default function DashboardFallbackPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenue dans votre espace SimplRH
        </p>
      </div>

      {/* Configuration Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <Settings className="h-6 w-6 text-yellow-600 mt-1 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-yellow-800">
              Configuration requise
            </h3>
            <p className="mt-2 text-yellow-700">
              Pour utiliser toutes les fonctionnalités, vous devez configurer votre organisation.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/onboarding">
                  Configurer mon organisation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - Empty State */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Factures en retard</p>
                <p className="text-2xl font-bold text-gray-400">-</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Congés en attente</p>
                <p className="text-2xl font-bold text-gray-400">-</p>
              </div>
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents générés</p>
                <p className="text-2xl font-bold text-gray-400">-</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CA total</p>
                <p className="text-2xl font-bold text-gray-400">-</p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button asChild className="h-20 flex-col" disabled>
              <Link href="#">
                <CreditCard className="h-6 w-6 mb-2" />
                Nouvelle facture
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-20 flex-col" disabled>
              <Link href="#">
                <Users className="h-6 w-6 mb-2" />
                Demande de congé
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-20 flex-col" disabled>
              <Link href="#">
                <FileText className="h-6 w-6 mb-2" />
                Générer document
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/settings">
                <Euro className="h-6 w-6 mb-2" />
                Paramètres
              </Link>
            </Button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Configurez votre organisation pour débloquer toutes les fonctionnalités
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}







