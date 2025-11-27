export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Plus, Search, Calendar, Filter, Download, AlertCircle } from 'lucide-react'
import { requireOrganization } from '@/domains/core/auth'
import { getAbsences } from '@/domains/people/absences'

const getSourceBadge = (source: string) => {
  const colors = {
    manual: 'bg-blue-100 text-blue-800',
    import: 'bg-purple-100 text-purple-800',
    auto: 'bg-green-100 text-green-800'
  }
  const labels = {
    manual: 'Manuel',
    import: 'Importé',
    auto: 'Automatique'
  }
  return <Badge variant="outline" className={colors[source as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
    {labels[source as keyof typeof labels] || source}
  </Badge>
}

const getTypeBadge = (type: string) => {
  return <Badge variant="outline" className="bg-gray-100 text-gray-800">
    {type}
  </Badge>
}

export default async function AbsencesPage() {
  const org = await requireOrganization()
  const absences = await getAbsences(org.id)
  
  // Group absences by employee
  const absencesByEmployee = absences.reduce((acc: any, absence: any) => {
    const employeeName = absence.employee?.full_name || 'Employé inconnu'
    if (!acc[employeeName]) {
      acc[employeeName] = []
    }
    acc[employeeName].push(absence)
    return acc
  }, {})
  
  const uniqueTypes = Array.from(new Set(absences.map(a => a.type)))
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des absences</h1>
          <p className="text-gray-600 mt-2">Suivez et gérez toutes les absences de votre équipe</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button asChild>
            <Link href="/people/leave-requests/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle absence
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une absence..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Tous les types</Button>
            <Button variant="outline">Tous les statuts</Button>
            <Button variant="outline">Ce mois</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{absences.length}</p>
              <p className="text-sm text-gray-600">Total absences</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Object.keys(absencesByEmployee).length}
              </p>
              <p className="text-sm text-gray-600">Employés concernés</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {uniqueTypes.length}
              </p>
              <p className="text-sm text-gray-600">Types d'absence</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {absences.filter(a => a.source === 'manual').length}
              </p>
              <p className="text-sm text-gray-600">Saisies manuelles</p>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Absences List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des absences ({absences.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {absences.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune absence</h3>
              <p className="text-gray-600">Aucune absence enregistrée pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {absences.map((absence: any) => {
                const employeeName = absence.employee?.full_name || 'Employé inconnu'
                
                return (
                  <div
                    key={absence.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-gray-900">{employeeName}</h3>
                          {getTypeBadge(absence.type)}
                          {getSourceBadge(absence.source)}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          <strong>{new Date(absence.date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</strong>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>Enregistré le {new Date(absence.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
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





