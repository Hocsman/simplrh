export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react'
import { requireOrganization } from '@/domains/core/auth'
import { getLeaveRequests } from '@/domains/people/leave-requests'

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />En attente</Badge>
    case 'approved':
      return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approuvée</Badge>
    case 'rejected':
      return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Refusée</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'CP': 'Congés payés',
    'RTT': 'RTT',
    'Maladie': 'Arrêt maladie',
    'Sans solde': 'Congé sans solde',
    'paid_leave': 'Congés payés',
    'sick_leave': 'Arrêt maladie',
    'rtt': 'RTT',
    'unpaid_leave': 'Congé sans solde'
  }
  return labels[type] || type
}

const calculateDays = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays
}

export default async function LeaveRequestsPage() {
  const org = await requireOrganization()
  const leaveRequests = await getLeaveRequests(org.id)
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demandes de congé</h1>
          <p className="text-gray-600 mt-2">Gérez les demandes de congé de votre équipe</p>
        </div>
        <Button asChild>
          <Link href="/people/leave-requests/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {leaveRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approuvées</p>
                <p className="text-2xl font-bold text-green-600">
                  {leaveRequests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{leaveRequests.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières demandes</CardTitle>
        </CardHeader>
        <CardContent>
          {leaveRequests.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande de congé</h3>
              <p className="text-gray-600 mb-4">Créez votre première demande de congé</p>
              <Button asChild>
                <Link href="/people/leave-requests/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle demande
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {leaveRequests.map((request: any) => {
                const daysCount = calculateDays(request.start_date, request.end_date)
                const employeeName = request.employee?.full_name || 'Employé inconnu'
                
                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-medium text-gray-900">{employeeName}</h3>
                          <p className="text-sm text-gray-600">{getTypeLabel(request.type)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">
                            {new Date(request.start_date).toLocaleDateString('fr-FR')} - {new Date(request.end_date).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-sm text-gray-600">{daysCount} jour{daysCount > 1 ? 's' : ''}</p>
                        </div>
                        {request.comment && (
                          <div>
                            <p className="text-sm text-gray-600">"{request.comment}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(request.status)}
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                              Approuver
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                              Refuser
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}





