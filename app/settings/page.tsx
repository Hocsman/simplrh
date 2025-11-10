import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Building,
  CreditCard,
  Users,
  Bell,
  Shield,
  Palette,
  Download,
  Upload,
  ArrowLeft
} from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation */}
      <header className="bg-white border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            SimplRH
          </Link>
          
          <div className="ml-8">
            <Link 
              href="/dashboard"
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-muted-foreground">
              Gérez les paramètres de votre organisation
            </p>
          </div>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <CardTitle>Organisation</CardTitle>
          </div>
          <CardDescription>
            Informations générales de votre entreprise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom de l'entreprise
              </label>
              <Input defaultValue="Mon Entreprise SARL" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                SIRET
              </label>
              <Input defaultValue="12345678901234" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Adresse
            </label>
            <textarea 
              className="w-full p-3 border rounded-md"
              rows={3}
              defaultValue="123 Rue de la République&#10;75001 PARIS&#10;FRANCE"
            />
          </div>

          <div className="flex justify-end">
            <Button>Enregistrer</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Abonnement</CardTitle>
            </div>
            <Badge variant="success">Business</Badge>
          </div>
          <CardDescription>
            Plan actuel et facturation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Starter</h3>
              <div className="text-2xl font-bold">29€<span className="text-sm font-normal">/mois</span></div>
              <p className="text-sm text-muted-foreground">1 module, 5 utilisateurs</p>
            </div>
            <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
              <h3 className="font-medium">Business</h3>
              <div className="text-2xl font-bold">59€<span className="text-sm font-normal">/mois</span></div>
              <p className="text-sm text-muted-foreground">2 modules, 15 utilisateurs</p>
              <Badge className="mt-2">Actuel</Badge>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Suite</h3>
              <div className="text-2xl font-bold">99€<span className="text-sm font-normal">/mois</span></div>
              <p className="text-sm text-muted-foreground">Tous les modules</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <p className="font-medium">Prochaine facturation: 15 janvier 2025</p>
              <p className="text-sm text-muted-foreground">Vous serez facturé 59€</p>
            </div>
            <Button variant="outline">Changer de plan</Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <CardTitle>Équipe</CardTitle>
            </div>
            <Button size="sm">Inviter un membre</Button>
          </div>
          <CardDescription>
            Gérez les membres de votre équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Demo User', email: 'demo@simplrh.com', role: 'owner', status: 'active' },
              { name: 'Marie Dupont', email: 'marie@simplrh.com', role: 'admin', status: 'active' },
              { name: 'Jean Martin', email: 'jean@simplrh.com', role: 'employee', status: 'pending' }
            ].map((member, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                    {member.role === 'owner' ? 'Propriétaire' : 
                     member.role === 'admin' ? 'Admin' : 'Employé'}
                  </Badge>
                  <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
                    {member.status === 'active' ? 'Actif' : 'En attente'}
                  </Badge>
                  <Button variant="ghost" size="sm">Gérer</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Configurez vos préférences de notification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>Nouvelles factures</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span>Demandes de congés</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span>Factures en retard</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span>Mises à jour produit</span>
              <input type="checkbox" />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <CardTitle>Export de données</CardTitle>
          </div>
          <CardDescription>
            Exportez vos données pour sauvegarde ou migration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="flex items-center justify-center h-20">
              <div className="text-center">
                <Download className="h-6 w-6 mx-auto mb-2" />
                <p>Exporter les factures</p>
                <p className="text-xs text-muted-foreground">PDF ou Excel</p>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center justify-center h-20">
              <div className="text-center">
                <Download className="h-6 w-6 mx-auto mb-2" />
                <p>Exporter les données RH</p>
                <p className="text-xs text-muted-foreground">CSV anonymisé</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
        </div>
      </main>
    </div>
  )
}