export const dynamic = 'force-dynamic'

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
  Euro
} from 'lucide-react'

import { requireOrganization } from '@/domains/core/auth'
import { 
  getDashboardStats, 
  getRecentInvoices,
  getOverdueInvoices,
  getPendingLeaveRequests,
  getRecentDocuments
} from '@/domains/core/dashboard'

export default async function DashboardPage() {
  // Get organization and user data
  const org = await requireOrganization()
  
  // Fetch real data from the database
  const stats = await getDashboardStats(org.id)
  const recentInvoices = await getRecentInvoices(org.id, 5)
  const overdueInvoices = await getOverdueInvoices(org.id, 5)
  const pendingLeaveRequests = await getPendingLeaveRequests(org.id, 5)
  const recentDocsFiltered = await getRecentDocuments(org.id, 5)

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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Factures en retard</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdueInvoices}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Congés en attente</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingLeaveRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents générés</p>
                <p className="text-2xl font-bold text-green-600">{stats.recentDocuments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CA total</p>
                <p className="text-2xl font-bold text-blue-600">€{stats.totalRevenue.toLocaleString('fr-FR')}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Overdue Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              Factures en retard
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/billing">Voir toutes</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {overdueInvoices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucune facture en retard 🎉
              </p>
            ) : (
              <div className="space-y-4">
                {overdueInvoices.slice(0, 5).map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium">{invoice.number}</p>
                      <p className="text-sm text-gray-600">
                        {invoice.customers?.name || 'Client non spécifié'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">
                        {invoice.total_ttc?.toFixed(2) || '0.00'}€
                      </p>
                      <p className="text-xs text-gray-500">
                        Échéance: {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('fr-FR') : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Leave Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              Demandes de congés
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/people/leave-requests">Voir toutes</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingLeaveRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucune demande en attente
              </p>
            ) : (
              <div className="space-y-4">
                {pendingLeaveRequests.slice(0, 5).map((request: any) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div>
                      <p className="font-medium">{request.employees?.full_name || 'Employé non spécifié'}</p>
                      <p className="text-sm text-gray-600">
                        {request.type} - {new Date(request.start_date).toLocaleDateString('fr-FR')} au {new Date(request.end_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      En attente
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Documents récents
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/docs">Voir tous</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentDocsFiltered.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucun document généré
              </p>
            ) : (
              <div className="space-y-4">
                {recentDocsFiltered.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{doc.template_key || 'Document'}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Badge 
                      variant={doc.status === 'generated' ? 'default' : doc.status === 'error' ? 'destructive' : 'secondary'}
                    >
                      {doc.status === 'generated' ? 'Généré' : doc.status === 'error' ? 'Erreur' : 'Brouillon'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild className="h-20 flex-col">
                <Link href="/billing/invoices/new">
                  <CreditCard className="h-6 w-6 mb-2" />
                  Nouvelle facture
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link href="/people/leave-requests/new">
                  <Users className="h-6 w-6 mb-2" />
                  Demande de congé
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link href="/docs/generate">
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
          </CardContent>
        </Card>
      </div>

      {/* Module Status */}
      <Card>
        <CardHeader>
          <CardTitle>Modules activés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Badge variant="default" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Facturation
            </Badge>
            <Badge variant="default" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              RH
            </Badge>
            <Badge variant="default" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </Badge>
          </div>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/settings">
                Gérer les modules
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}