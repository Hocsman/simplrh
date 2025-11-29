export const dynamic = 'force-dynamic'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogoutButton } from '@/components/LogoutButton'
import {
  Building,
  CreditCard,
  Users,
  Bell,
  Shield,
  Palette,
  Download,
  Upload,
  ArrowLeft,
  Check,
  Briefcase,
  MapPin,
  FileText,
  Settings
} from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-lg font-semibold text-gray-900">Paramètres de l'organisation</h1>
          </div>
          <div className="flex items-center gap-2">
            <LogoutButton className="text-red-600 hover:text-red-700 hover:bg-red-50" />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 max-w-5xl space-y-8">

        {/* Hero Section / Organization Identity */}
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card className="border-none shadow-md overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                  <div className="h-24 w-24 rounded-xl border-4 border-white bg-white shadow-sm flex items-center justify-center overflow-hidden">
                    <div className="bg-blue-100 h-full w-full flex items-center justify-center text-blue-600 font-bold text-3xl">
                      M
                    </div>
                  </div>
                </div>
              </div>
              <CardHeader className="pt-16 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Mon Entreprise SARL</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Briefcase className="h-3.5 w-3.5 mr-1" />
                      Services aux entreprises
                      <span className="mx-2">•</span>
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      Paris, France
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Modifier le logo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                    <Input defaultValue="Mon Entreprise SARL" className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Numéro SIRET</label>
                    <Input defaultValue="12345678901234" className="font-mono bg-gray-50" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Adresse du siège</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-gray-50 px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="123 Rue de la République&#10;75001 PARIS&#10;FRANCE"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button>Enregistrer les modifications</Button>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Membres de l'équipe
                    </CardTitle>
                    <CardDescription>Gérez les accès à votre espace SimplRH</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Inviter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Demo User', email: 'demo@simplrh.com', role: 'Propriétaire', status: 'active', initials: 'DU' },
                    { name: 'Marie Dupont', email: 'marie@simplrh.com', role: 'Admin', status: 'active', initials: 'MD' },
                    { name: 'Jean Martin', email: 'jean@simplrh.com', role: 'Employé', status: 'pending', initials: 'JM' }
                  ].map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="font-normal">
                          {member.role}
                        </Badge>
                        <div className={`h-2 w-2 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-orange-400'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Secondary Settings */}
          <div className="space-y-6">

            {/* Subscription Plan */}
            <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-blue-900">Abonnement Actuel</CardTitle>
                  <Badge className="bg-blue-600 hover:bg-blue-700">Business</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-blue-900">
                  59€<span className="text-sm font-normal text-blue-700">/mois</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-blue-800">
                    <Check className="h-4 w-4 mr-2 text-blue-600" />
                    Jusqu'à 15 utilisateurs
                  </div>
                  <div className="flex items-center text-sm text-blue-800">
                    <Check className="h-4 w-4 mr-2 text-blue-600" />
                    Modules RH & Facturation
                  </div>
                  <div className="flex items-center text-sm text-blue-800">
                    <Check className="h-4 w-4 mr-2 text-blue-600" />
                    Support prioritaire
                  </div>
                </div>
                <Separator className="bg-blue-200" />
                <div className="text-xs text-blue-700">
                  Prochaine facture le 15 Janvier 2025
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Gérer l'abonnement
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Factures</span>
                  <div className="h-5 w-9 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-3 w-3 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Demandes RH</span>
                  <div className="h-5 w-9 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-3 w-3 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Marketing</span>
                  <div className="h-5 w-9 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 h-3 w-3 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exports */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exports
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full h-auto py-2 flex flex-col gap-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">Factures</span>
                </Button>
                <Button variant="outline" size="sm" className="w-full h-auto py-2 flex flex-col gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Personnel</span>
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  )
}