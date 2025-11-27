export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus,
  Download,
  Check,
  X,
  Calendar,
  Users as UsersIcon,
  Clock,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { requireOrganization } from '@/domains/core/auth'
import { getEmployees } from '@/domains/people/employees'
import { getLeaveRequests } from '@/domains/people/leave-requests'

export default async function PeoplePage() {
  const org = await requireOrganization()
  const employees = await getEmployees(org.id)
  const leaveRequests = await getLeaveRequests(org.id)
  
  // Get only pending leave requests for the overview
  const pendingLeaveRequests = leaveRequests.filter(lr => lr.status === 'pending').slice(0, 5)
  const recentEmployees = employees.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion RH</h1>
          <p className="text-muted-foreground">
            Gérez vos équipes, congés et absences
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/people/employees">
              Employés
            </Link>
          </Button>
          <Button asChild>
            <Link href="/people/leave-requests/new">
              <Plus className="h-4 w-4 mr-2" />
              Demande de congé
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total employés
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">
              employé{employees.length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En attente
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLeaveRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              demande{pendingLeaveRequests.length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total demandes
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              demande{leaveRequests.length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approuvées
            </CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveRequests.filter(lr => lr.status === 'approved').length}</div>
            <p className="text-xs text-muted-foreground">
              demande{leaveRequests.filter(lr => lr.status === 'approved').length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Leave Requests */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Demandes de congés</CardTitle>
                <CardDescription>
                  Demandes en attente de validation
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/people/leave-requests">
                  Voir tout
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {pendingLeaveRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Aucune demande en attente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingLeaveRequests.map((request: any) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{request.employee?.full_name || 'Employé inconnu'}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.start_date).toLocaleDateString('fr-FR')} - {new Date(request.end_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-green-600">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employees Overview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Employés</CardTitle>
                <CardDescription>
                  Vue d'ensemble des équipes
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/people/employees">
                  Gérer
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentEmployees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UsersIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Aucun employé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEmployees.map((employee) => {
                  const initials = employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  return (
                    <div key={employee.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium">{employee.full_name}</p>
                          <p className="text-sm text-muted-foreground">{employee.email || 'Pas d\'email'}</p>
                        </div>
                      </div>
                      
                      {employee.hire_date && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Embauche: {new Date(employee.hire_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accès rapide aux fonctions RH
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/people/leave-requests/new">
                <Calendar className="h-6 w-6 mb-2" />
                Demander un congé
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/people/absences">
                <UsersIcon className="h-6 w-6 mb-2" />
                Gérer les absences
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/people/payroll">
                <Download className="h-6 w-6 mb-2" />
                Export paie
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/people/reports">
                <Eye className="h-6 w-6 mb-2" />
                Rapports RH
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}