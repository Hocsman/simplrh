export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
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
  Plus,
  ArrowRight,
  MoreHorizontal,
  Calendar
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
    <div className="min-h-screen bg-gray-50/50 p-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Bonjour, {org.name} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Voici ce qui se passe dans votre entreprise aujourd'hui.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle facture
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="h-24 w-24 text-blue-600" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Euro className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Chiffre d'affaires</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {stats.totalRevenue.toLocaleString('fr-FR')}€
              </h3>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% ce mois-ci
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Factures en retard</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {stats.overdueInvoices}
              </h3>
              <p className="text-sm text-red-600 flex items-center mt-1">
                Action requise
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <Clock className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Congés en attente</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {stats.pendingLeaveRequests}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Demandes à valider
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Documents</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {stats.recentDocuments}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Générés ce mois-ci
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Overdue Invoices */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  Factures à relancer
                  {overdueInvoices.length > 0 && (
                    <Badge variant="destructive" className="ml-2 rounded-full px-2 py-0.5 text-xs">
                      {overdueInvoices.length}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Paiements en attente de régularisation</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                <Link href="/billing">Tout voir <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              {overdueInvoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-lg border border-dashed">
                  <div className="p-3 bg-green-100 text-green-600 rounded-full mb-3">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <p className="font-medium text-gray-900">Tout est à jour !</p>
                  <p className="text-sm text-muted-foreground">Aucune facture en retard pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {overdueInvoices.slice(0, 5).map((invoice: any) => (
                    <div key={invoice.id} className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">
                          {invoice.customers?.name?.substring(0, 2).toUpperCase() || 'CL'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{invoice.customers?.name || 'Client inconnu'}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            {invoice.number} • Échu le {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {invoice.total_ttc?.toFixed(2) || '0.00'}€
                        </p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-red-600 font-medium">
                          Relancer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold">Documents récents</CardTitle>
                <CardDescription>Derniers documents générés et signés</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/docs">Tout voir <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {recentDocsFiltered.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">Aucun document récent.</p>
                ) : (
                  recentDocsFiltered.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{doc.template_key || 'Document sans titre'}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(doc.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                          </p>
                        </div>
                      </div>
                      <Badge variant={doc.status === 'generated' ? 'outline' : 'secondary'} className={doc.status === 'generated' ? 'text-green-600 border-green-200 bg-green-50' : ''}>
                        {doc.status === 'generated' ? 'Généré' : 'Brouillon'}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">

          {/* Pending Leave Requests */}
          <Card className="border-none shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                Congés à valider
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingLeaveRequests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <p className="font-medium text-gray-900">À jour !</p>
                  <p className="text-sm text-muted-foreground">Aucune demande en attente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingLeaveRequests.slice(0, 5).map((request: any) => (
                    <div key={request.id} className="bg-white border rounded-xl p-4 shadow-sm relative">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">
                              {request.employees?.full_name?.substring(0, 2).toUpperCase() || 'EM'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{request.employees?.full_name}</p>
                            <p className="text-xs text-muted-foreground">{request.type}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-100">
                          En attente
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <Calendar className="h-3 w-3" />
                        {new Date(request.start_date).toLocaleDateString('fr-FR')} - {new Date(request.end_date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <Button size="sm" variant="outline" className="h-8 text-xs w-full">Refuser</Button>
                        <Button size="sm" className="h-8 text-xs w-full bg-green-600 hover:bg-green-700">Valider</Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-sm text-muted-foreground" asChild>
                    <Link href="/people/leave-requests">Voir toutes les demandes</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <CardHeader>
              <CardTitle className="text-white">Accès rapide</CardTitle>
              <CardDescription className="text-blue-100">Raccourcis vers vos tâches fréquentes</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Link href="/billing/invoices/new" className="flex flex-col items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center">
                <CreditCard className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium">Facture</span>
              </Link>
              <Link href="/people/employees/new" className="flex flex-col items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium">Employé</span>
              </Link>
              <Link href="/docs/generate" className="flex flex-col items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center">
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium">Document</span>
              </Link>
              <Link href="/settings" className="flex flex-col items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center">
                <Euro className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium">Paramètres</span>
              </Link>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}