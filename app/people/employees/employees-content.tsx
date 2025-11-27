'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Plus, Search, Users, Mail, Edit } from 'lucide-react'
import { Employee } from '@/domains/people/employees'

interface EmployeesPageProps {
  initialEmployees: Employee[]
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

export default function EmployeesPageContent({ initialEmployees }: EmployeesPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Filter and search employees
  const filteredEmployees = useMemo(() => {
    return initialEmployees.filter(employee => {
      const matchesSearch =
        employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter, initialEmployees])

  const stats = {
    total: initialEmployees.length,
    active: initialEmployees.filter(e => e.status === 'active').length,
    onLeave: initialEmployees.filter(e => e.status === 'on_leave').length,
    withHireDate: initialEmployees.filter(e => e.hire_date).length
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employés</h1>
          <p className="text-gray-600 mt-2">Gérez votre équipe et leurs informations</p>
        </div>
        <Link href="/people/employees/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel employé
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email ou poste..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="on_leave">En congé</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total employés</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-gray-600">Actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.onLeave}</p>
              <p className="text-sm text-gray-600">En congé</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.withHireDate}</p>
              <p className="text-sm text-gray-600">Avec date d'embauche</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employees List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Liste des employés {searchTerm || statusFilter !== 'all' ? `(${filteredEmployees.length})` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {initialEmployees.length === 0 ? 'Aucun employé' : 'Aucun résultat'}
              </h3>
              <p className="text-gray-600 mb-6">
                {initialEmployees.length === 0 ? 'Commencez par ajouter vos employés' : 'Ajustez vos critères de recherche'}
              </p>
              {initialEmployees.length === 0 && (
                <Link href="/people/employees/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un employé
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEmployees.map((employee) => {
                const initials = employee.full_name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)

                return (
                  <Link
                    key={employee.id}
                    href={`/people/employees/${employee.id}`}
                  >
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-medium">
                            {initials}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-medium text-gray-900">
                              {employee.full_name}
                            </h3>
                            <Badge className={statusColors[employee.status as keyof typeof statusColors]}>
                              {statusLabels[employee.status as keyof typeof statusLabels]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                            {employee.position && (
                              <span>{employee.position}</span>
                            )}
                            {employee.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {employee.email}
                              </div>
                            )}
                            {employee.hire_date && (
                              <span>
                                Embauché le {new Date(employee.hire_date).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        <Link href={`/people/employees/${employee.id}/edit`} onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
