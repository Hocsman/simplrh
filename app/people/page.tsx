export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Plus,
  Download,
  Check,
  X,
  Calendar,
  Users as UsersIcon,
  Clock,
  Eye,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  User
} from 'lucide-react'
import Link from 'next/link'
import { requireOrganization } from '@/domains/core/auth'
import { getEmployees } from '@/domains/people/employees'
import { getLeaveRequests } from '@/domains/people/leave-requests'

export default async function PeoplePage() {
  const org = await requireOrganization()
  const employees = await getEmployees(org.id)
  const leaveRequests = await getLeaveRequests(org.id)

  const pendingLeaveRequests = leaveRequests.filter(lr => lr.status === 'pending')
  const approvedLeaveRequests = leaveRequests.filter(lr => lr.status === 'approved')

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestion RH</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos équipes, congés et absences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/people/employees">
              <UsersIcon className="h-4 w-4 mr-2" />
              Tous les employés
            </Link>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm" asChild>
            <Link href="/people/employees/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel employé
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <UsersIcon className="h-24 w-24 text-blue-600" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <UsersIcon className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Total employés</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{employees.length}</h3>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Équipe active
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
              <p className="text-sm font-medium text-muted-foreground">En attente</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{pendingLeaveRequests.length}</h3>
              <p className="text-sm text-orange-600 mt-1">
                Demandes à traiter
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Total demandes</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{leaveRequests.length}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Cette année
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Approuvées</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-green-600">{approvedLeaveRequests.length}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Congés validés
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Pending Leave Requests */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Demandes de congés
                {pendingLeaveRequests.length > 0 && (
                  <Badge className="ml-2 bg-orange-500 hover:bg-orange-600 rounded-full px-2 py-0.5 text-xs">
                    {pendingLeaveRequests.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Demandes en attente de validation</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              <Link href="/people/leave-requests">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingLeaveRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-lg border border-dashed">
                <div className="p-3 bg-green-100 text-green-600 rounded-full mb-3">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="font-medium text-gray-900">Tout est à jour !</p>
                <p className="text-sm text-muted-foreground">Aucune demande en attente.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLeaveRequests.slice(0, 5).map((request: any) => {
                  const initials = request.employee?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'EM'
                  return (
                    <div key={request.id} className="group bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-orange-100 text-orange-700 font-medium text-sm">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{request.employee?.full_name || 'Employé'}</p>
                            <p className="text-xs text-muted-foreground">{request.type}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-100">
                          En attente
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg mb-3">
                        <Calendar className="h-3 w-3" />
                        {new Date(request.start_date).toLocaleDateString('fr-FR')} - {new Date(request.end_date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" className="h-8 text-xs w-full text-red-600 hover:bg-red-50">
                          <X className="h-3 w-3 mr-1" />
                          Refuser
                        </Button>
                        <Button size="sm" className="h-8 text-xs w-full bg-green-600 hover:bg-green-700">
                          <Check className="h-3 w-3 mr-1" />
                          Approuver
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employees Overview */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-blue-500" />
                Équipe
              </CardTitle>
              <CardDescription>Vue d'ensemble des employés</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              <Link href="/people/employees">Gérer</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {employees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-lg border border-dashed">
                <div className="p-3 bg-gray-100 rounded-full mb-3">
                  <UsersIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="font-medium text-gray-900">Aucun employé</p>
                <p className="text-sm text-muted-foreground mb-4">Commencez par ajouter votre premier employé</p>
                <Button asChild>
                  <Link href="/people/employees/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un employé
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {employees.slice(0, 6).map((employee) => {
                  const initials = employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  const colors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-pink-100 text-pink-700', 'bg-indigo-100 text-indigo-700']
                  const colorClass = colors[Math.floor(Math.random() * colors.length)]

                  return (
                    <div key={employee.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={`${colorClass} font-medium text-sm`}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{employee.full_name}</p>
                          <p className="text-xs text-muted-foreground">{employee.position || employee.email || 'Sans poste'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {employee.hire_date && (
                          <div className="text-right hidden md:block">
                            <p className="text-xs text-muted-foreground">
                              Depuis {new Date(employee.hire_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/people/employees/${employee.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
                {employees.length > 6 && (
                  <Button variant="ghost" className="w-full text-sm text-muted-foreground" asChild>
                    <Link href="/people/employees">Voir tous les employés ({employees.length})</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-none shadow-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-white">Actions RH rapides</CardTitle>
          <CardDescription className="text-blue-100">Raccourcis vers vos tâches fréquentes</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/people/employees/new" className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center">
            <Plus className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Employé</span>
          </Link>
          <Link href="/people/leave-requests/new" className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center">
            <Calendar className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Congé</span>
          </Link>
          <Link href="/people/absences" className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center">
            <Clock className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Absences</span>
          </Link>
          <Link href="/people/payroll" className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center">
            <Download className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Paie</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}