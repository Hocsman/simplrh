export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { requireOrganization } from '@/domains/core/auth'
import { getEmployee } from '@/domains/people/employees'
import { Mail, Briefcase, Calendar, DollarSign, FileText, ArrowLeft, Edit, Trash2 } from 'lucide-react'

interface EmployeeDetailsPageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Détails employé | SimplRH'
}

async function deleteEmployee(employeeId: string) {
  'use server'

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/people/employees/${employeeId}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression')
    }
  } catch (error: any) {
    throw error
  }
}

export default async function EmployeeDetailsPage({
  params
}: EmployeeDetailsPageProps) {
  const { id } = await params
  const org = await requireOrganization()

  let employee
  try {
    employee = await getEmployee(id, org.id)
  } catch (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Employé non trouvé</h2>
        <Link href="/people/employees">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
        </Link>
      </div>
    )
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    on_leave: 'bg-yellow-100 text-yellow-800'
  }

  const statusLabels = {
    active: 'Actif',
    inactive: 'Inactif',
    on_leave: 'En congé'
  }

  const contractLabels = {
    CDI: 'CDI',
    CDD: 'CDD',
    Stage: 'Stage',
    Freelance: 'Freelance'
  }

  const initials = employee.full_name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/people/employees">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{employee.full_name}</h1>
            <p className="text-gray-600 mt-1">{employee.position || 'Poste non spécifié'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href={`/people/employees/${employee.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar and Status */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">{initials}</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-900">{employee.full_name}</h3>
              <Badge className={`mt-3 ${statusColors[employee.status as keyof typeof statusColors]}`}>
                {statusLabels[employee.status as keyof typeof statusLabels]}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card>
          <CardContent className="p-6 space-y-4">
            {employee.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href={`mailto:${employee.email}`} className="font-medium text-blue-600 hover:underline">
                    {employee.email}
                  </a>
                </div>
              </div>
            )}
            {employee.position && (
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Poste</p>
                  <p className="font-medium">{employee.position}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract Info */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Type de contrat</p>
              <Badge variant="secondary">
                {contractLabels[employee.contract_type as keyof typeof contractLabels]}
              </Badge>
            </div>
            {employee.hire_date && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Embauché</p>
                  <p className="font-medium">
                    {new Date(employee.hire_date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Nom complet</label>
              <p className="font-medium text-gray-900">{employee.full_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Email</label>
              <p className="font-medium text-gray-900">{employee.email || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Poste</label>
              <p className="font-medium text-gray-900">{employee.position || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Type de contrat</label>
              <p className="font-medium text-gray-900">
                {contractLabels[employee.contract_type as keyof typeof contractLabels]}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Date d'embauche</label>
              <p className="font-medium text-gray-900">
                {employee.hire_date
                  ? new Date(employee.hire_date).toLocaleDateString('fr-FR')
                  : '-'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Salaire</label>
              <p className="font-medium text-gray-900">
                {employee.salary ? `${employee.salary.toFixed(2)} €` : '-'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Statut</label>
              <Badge className={`${statusColors[employee.status as keyof typeof statusColors]}`}>
                {statusLabels[employee.status as keyof typeof statusLabels]}
              </Badge>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Créé le</label>
              <p className="font-medium text-gray-900">
                {new Date(employee.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
