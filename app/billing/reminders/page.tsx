import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Mail, 
  Send, 
  Calendar, 
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Building,
  Euro,
  Phone,
  FileText,
  Settings
} from 'lucide-react'

// Mock reminders data
const mockReminders = [
  {
    id: '1',
    invoice_number: 'FAC-2024-004',
    client_name: 'StartupX',
    client_email: 'jean@startupx.io',
    amount: 5500,
    due_date: '2024-07-10T00:00:00Z',
    days_overdue: 18,
    reminder_level: 1,
    last_reminder_sent: '2024-07-15T09:30:00Z',
    next_reminder_date: '2024-08-01T00:00:00Z',
    status: 'active',
    total_reminders_sent: 1,
    created_at: '2024-06-10T08:20:00Z'
  },
  {
    id: '2',
    invoice_number: 'FAC-2024-007',
    client_name: 'E-Commerce Solutions',
    client_email: 'sophie@ecommerce-sol.fr',
    amount: 8500,
    due_date: '2024-07-05T00:00:00Z',
    days_overdue: 23,
    reminder_level: 2,
    last_reminder_sent: '2024-07-20T14:15:00Z',
    next_reminder_date: '2024-08-05T00:00:00Z',
    status: 'active',
    total_reminders_sent: 2,
    created_at: '2024-06-05T11:30:00Z'
  },
  {
    id: '3',
    invoice_number: 'FAC-2024-008',
    client_name: 'Digital Agency Pro',
    client_email: 'p.martin@digitalagency.com',
    amount: 12000,
    due_date: '2024-07-12T00:00:00Z',
    days_overdue: 16,
    reminder_level: 3,
    last_reminder_sent: '2024-07-25T16:45:00Z',
    next_reminder_date: null,
    status: 'legal',
    total_reminders_sent: 3,
    created_at: '2024-06-12T14:20:00Z'
  },
  {
    id: '4',
    invoice_number: 'FAC-2024-009',
    client_name: 'TechStart SAS',
    client_email: 'marie.dubois@techstart.fr',
    amount: 3200,
    due_date: '2024-07-20T00:00:00Z',
    days_overdue: 8,
    reminder_level: 1,
    last_reminder_sent: null,
    next_reminder_date: '2024-07-30T00:00:00Z',
    status: 'pending',
    total_reminders_sent: 0,
    created_at: '2024-06-20T10:15:00Z'
  },
  {
    id: '5',
    invoice_number: 'FAC-2024-010',
    client_name: 'StartupX',
    client_email: 'jean@startupx.io',
    amount: 7800,
    due_date: '2024-06-30T00:00:00Z',
    days_overdue: 28,
    reminder_level: 2,
    last_reminder_sent: '2024-07-18T11:20:00Z',
    next_reminder_date: '2024-08-02T00:00:00Z',
    status: 'paused',
    total_reminders_sent: 2,
    created_at: '2024-05-30T09:45:00Z'
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        <Clock className="h-3 w-3 mr-1" />Actif
      </Badge>
    case 'pending':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        <AlertTriangle className="h-3 w-3 mr-1" />En attente
      </Badge>
    case 'paused':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        <Clock className="h-3 w-3 mr-1" />En pause
      </Badge>
    case 'legal':
      return <Badge variant="secondary" className="bg-red-100 text-red-800">
        <AlertTriangle className="h-3 w-3 mr-1" />Contentieux
      </Badge>
    case 'resolved':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />Résolu
      </Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getReminderLevelBadge = (level: number) => {
  const colors = {
    1: 'bg-yellow-100 text-yellow-800',
    2: 'bg-orange-100 text-orange-800',
    3: 'bg-red-100 text-red-800'
  }
  const labels = {
    1: 'Relance 1',
    2: 'Relance 2',
    3: 'Mise en demeure'
  }
  return <Badge variant="outline" className={colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
    {labels[level as keyof typeof labels] || `Niveau ${level}`}
  </Badge>
}

export default function RemindersPage() {
  const activeReminders = mockReminders.filter(r => r.status === 'active').length
  const totalOverdueAmount = mockReminders.reduce((sum, r) => sum + r.amount, 0)
  const legalCases = mockReminders.filter(r => r.status === 'legal').length
  const avgDaysOverdue = Math.round(mockReminders.reduce((sum, r) => sum + r.days_overdue, 0) / mockReminders.length)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relances</h1>
          <p className="text-gray-600 mt-2">Gérez les relances de paiement automatiques</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Envoyer relances
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
                placeholder="Rechercher une relance..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Tous les statuts</Button>
            <Button variant="outline">Tous les niveaux</Button>
            <Button variant="outline">Tous les clients</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Relances actives</p>
                <p className="text-2xl font-bold text-blue-600">{activeReminders}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {(totalOverdueAmount / 1000).toFixed(0)}k€
              </p>
              <p className="text-sm text-gray-600">Montant en retard</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{avgDaysOverdue}</p>
              <p className="text-sm text-gray-600">Jours de retard moyen</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{legalCases}</p>
              <p className="text-sm text-gray-600">Contentieux</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto p-4 justify-start">
          <div className="text-left">
            <div className="font-medium">Relances à envoyer</div>
            <div className="text-sm text-gray-500">3 relances prêtes</div>
          </div>
        </Button>
        
        <Button variant="outline" className="h-auto p-4 justify-start">
          <div className="text-left">
            <div className="font-medium">Mises en demeure</div>
            <div className="text-sm text-gray-500">1 à traiter</div>
          </div>
        </Button>
        
        <Button variant="outline" className="h-auto p-4 justify-start">
          <div className="text-left">
            <div className="font-medium">Relances automatiques</div>
            <div className="text-sm text-gray-500">Configurer les règles</div>
          </div>
        </Button>
        
        <Button variant="outline" className="h-auto p-4 justify-start">
          <div className="text-left">
            <div className="font-medium">Rapport mensuel</div>
            <div className="text-sm text-gray-500">Efficacité des relances</div>
          </div>
        </Button>
      </div>

      {/* Reminders List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des relances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-gray-900">{reminder.invoice_number}</h3>
                      {getStatusBadge(reminder.status)}
                      {getReminderLevelBadge(reminder.reminder_level)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {reminder.client_name} • {reminder.client_email}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Euro className="h-3 w-3" />
                        <span className="font-medium text-red-600">
                          {reminder.amount.toLocaleString('fr-FR')}€
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Échéance: {new Date(reminder.due_date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-red-600 font-medium">
                          {reminder.days_overdue} jours de retard
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                      <span>{reminder.total_reminders_sent} relance{reminder.total_reminders_sent > 1 ? 's' : ''} envoyée{reminder.total_reminders_sent > 1 ? 's' : ''}</span>
                      {reminder.last_reminder_sent && (
                        <span>Dernière: {new Date(reminder.last_reminder_sent).toLocaleDateString('fr-FR')}</span>
                      )}
                      {reminder.next_reminder_date && (
                        <span>Prochaine: {new Date(reminder.next_reminder_date).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Days overdue */}
                  <div className="text-right text-sm">
                    <p className="font-bold text-red-600 text-lg">
                      +{reminder.days_overdue}j
                    </p>
                    <p className="text-gray-500 text-xs">
                      Niveau {reminder.reminder_level}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    {reminder.status === 'pending' && (
                      <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                        <Send className="h-4 w-4 mr-1" />
                        Envoyer
                      </Button>
                    )}
                    {reminder.status === 'active' && (
                      <Button size="sm" variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                        <Mail className="h-4 w-4 mr-1" />
                        Relancer
                      </Button>
                    )}
                    {reminder.status === 'legal' && (
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        <FileText className="h-4 w-4 mr-1" />
                        Contentieux
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Appeler
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600">
              Affichage de 1 à {mockReminders.length} sur {mockReminders.length} relances
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Précédent</Button>
              <Button variant="outline" size="sm">Suivant</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reminder Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration des relances automatiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Première relance</h4>
              <div>
                <Label htmlFor="reminder1-days">Jours après échéance</Label>
                <Input id="reminder1-days" type="number" defaultValue="7" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="reminder1-template">Modèle d'email</Label>
                <select 
                  id="reminder1-template"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gentle">Relance courtoise</option>
                  <option value="standard">Relance standard</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Deuxième relance</h4>
              <div>
                <Label htmlFor="reminder2-days">Jours après première relance</Label>
                <Input id="reminder2-days" type="number" defaultValue="15" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="reminder2-template">Modèle d'email</Label>
                <select 
                  id="reminder2-template"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="firm">Relance ferme</option>
                  <option value="urgent">Relance urgente</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Mise en demeure</h4>
              <div>
                <Label htmlFor="reminder3-days">Jours après deuxième relance</Label>
                <Input id="reminder3-days" type="number" defaultValue="30" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="reminder3-template">Modèle d'email</Label>
                <select 
                  id="reminder3-template"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="legal">Mise en demeure</option>
                  <option value="final">Dernier avertissement</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Sauvegarder la configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}










