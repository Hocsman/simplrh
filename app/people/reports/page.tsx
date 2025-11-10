import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// Removed recharts imports due to compatibility issues
import { Download, Filter, Calendar, TrendingUp, Users, Clock, Target } from 'lucide-react'

// Mock data for charts
const absencesByMonth = [
  { month: 'Jan', conges: 12, maladie: 5, rtt: 8 },
  { month: 'Fév', conges: 15, maladie: 7, rtt: 6 },
  { month: 'Mar', conges: 10, maladie: 4, rtt: 9 },
  { month: 'Avr', conges: 18, maladie: 6, rtt: 7 },
  { month: 'Mai', conges: 22, maladie: 3, rtt: 12 },
  { month: 'Jun', conges: 25, maladie: 8, rtt: 15 },
  { month: 'Jul', conges: 35, maladie: 4, rtt: 10 }
]

const absencesByType = [
  { name: 'Congés payés', value: 60, color: '#3B82F6' },
  { name: 'Arrêts maladie', value: 20, color: '#EF4444' },
  { name: 'RTT', value: 15, color: '#10B981' },
  { name: 'Autres', value: 5, color: '#F59E0B' }
]

const teamPerformance = [
  { name: 'Marie Dupont', absences: 8, performance: 95 },
  { name: 'Jean Martin', absences: 12, performance: 88 },
  { name: 'Sophie Leblanc', absences: 5, performance: 92 },
  { name: 'Pierre Durand', absences: 15, performance: 85 },
  { name: 'Amélie Rousseau', absences: 3, performance: 98 }
]

// Removed COLORS constant as it's no longer needed

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports RH</h1>
          <p className="text-gray-600 mt-2">Analysez les données de votre équipe et générez des rapports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exporter rapport
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="report-period">Période</Label>
              <select 
                id="report-period"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="this-year">Cette année</option>
                <option value="last-year">Année dernière</option>
                <option value="this-month">Ce mois</option>
                <option value="last-month">Mois dernier</option>
                <option value="custom">Période personnalisée</option>
              </select>
            </div>
            <div>
              <Label htmlFor="report-department">Département</Label>
              <select 
                id="report-department"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les départements</option>
                <option value="tech">Technique</option>
                <option value="design">Design</option>
                <option value="direction">Direction</option>
              </select>
            </div>
            <div>
              <Label htmlFor="report-type">Type de rapport</Label>
              <select 
                id="report-type"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="absences">Absences</option>
                <option value="performance">Performance</option>
                <option value="turnover">Turnover</option>
                <option value="costs">Coûts RH</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Générer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux d'absentéisme</p>
                <p className="text-2xl font-bold text-red-600">4.2%</p>
                <p className="text-xs text-gray-500">+0.3% vs mois dernier</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction équipe</p>
                <p className="text-2xl font-bold text-green-600">8.7/10</p>
                <p className="text-xs text-gray-500">+0.2 vs mois dernier</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Turnover annuel</p>
                <p className="text-2xl font-bold text-blue-600">12%</p>
                <p className="text-xs text-gray-500">-2% vs année dernière</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coût par employé</p>
                <p className="text-2xl font-bold text-purple-600">4,250€</p>
                <p className="text-xs text-gray-500">+150€ vs mois dernier</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Absences by Month */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des absences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {absencesByMonth.map((month, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{month.month}</span>
                    <span className="text-gray-500">
                      {month.conges + month.maladie + month.rtt} jours
                    </span>
                  </div>
                  <div className="flex h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500" 
                      style={{ width: `${(month.conges / (month.conges + month.maladie + month.rtt)) * 100}%` }}
                      title={`Congés: ${month.conges} jours`}
                    />
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${(month.maladie / (month.conges + month.maladie + month.rtt)) * 100}%` }}
                      title={`Maladie: ${month.maladie} jours`}
                    />
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${(month.rtt / (month.conges + month.maladie + month.rtt)) * 100}%` }}
                      title={`RTT: ${month.rtt} jours`}
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-4 text-sm mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Congés</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Maladie</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>RTT</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Absences by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des absences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {absencesByType.map((type, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{type.name}</span>
                    <span className="text-gray-500">{type.value}%</span>
                  </div>
                  <div className="flex h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="rounded-full" 
                      style={{ 
                        width: `${type.value}%`,
                        backgroundColor: type.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance de l'équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformance.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.absences} jours d'absence</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Performance</p>
                    <p className={`font-bold ${
                      member.performance >= 90 ? 'text-green-600' :
                      member.performance >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {member.performance}%
                    </p>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        member.performance >= 90 ? 'bg-green-500' :
                        member.performance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${member.performance}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Rapport mensuel</div>
                <div className="text-sm text-gray-500">Synthèse du mois en cours</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Analyse des coûts</div>
                <div className="text-sm text-gray-500">Détail des charges RH</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Bilan social</div>
                <div className="text-sm text-gray-500">Indicateurs sociaux annuels</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Suivi des congés</div>
                <div className="text-sm text-gray-500">État des soldes de congés</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Tableau de bord RH</div>
                <div className="text-sm text-gray-500">KPI et métriques clés</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Rapport personnalisé</div>
                <div className="text-sm text-gray-500">Créer un rapport sur mesure</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
