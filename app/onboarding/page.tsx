'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Building2, FileText, Users, CreditCard } from 'lucide-react'

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [orgData, setOrgData] = useState({
    name: '',
    siret: ''
  })
  const [modules, setModules] = useState({
    billing: true,
    people: true,
    docs: true
  })
  
  const router = useRouter()
  const { toast } = useToast()

  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key-here'

  let supabase: any = null
  if (isSupabaseConfigured) {
    supabase = createClientComponentClient()
  }

  useEffect(() => {
    const getUser = async () => {
      if (!isSupabaseConfigured) {
        // In dev mode, redirect to dashboard
        router.push('/dashboard')
        return
      }
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [router, isSupabaseConfigured])

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    console.log('🚀 Creating organization...')
    console.log('User:', user.email)
    console.log('Org data:', orgData)

    setLoading(true)
    try {
      // Create organization via API
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orgData)
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ API Error:', errorData)
        throw new Error(errorData.error || 'Failed to create organization')
      }

      const org = await response.json()
      console.log('✅ Organization created:', org)
      
      // Update organization modules
      console.log('Updating modules:', modules)
      const { error: moduleError } = await supabase
        .from('orgs')
        .update({ modules })
        .eq('id', org.id)

      if (moduleError) {
        console.error('Module update error:', moduleError)
        throw moduleError
      }

      console.log('✅ Modules updated')

      toast({
        title: '✅ Organisation créée !',
        description: 'Votre espace SimplRH est maintenant configuré.',
        duration: 3000
      })

      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error: any) {
      console.error('❌ Error creating organization:', error)
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de créer l\'organisation',
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">SimplRH</h1>
          <p className="mt-2 text-lg text-gray-600">
            Configurons votre espace de travail
          </p>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations de votre organisation
              </CardTitle>
              <CardDescription>
                Ces informations seront utilisées dans vos factures et documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); setStep(2) }} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom de l'organisation *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={orgData.name}
                    onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                    required
                    className="mt-1"
                    placeholder="Mon Entreprise SARL"
                  />
                </div>

                <div>
                  <label htmlFor="siret" className="block text-sm font-medium text-gray-700">
                    SIRET (optionnel)
                  </label>
                  <Input
                    id="siret"
                    type="text"
                    value={orgData.siret}
                    onChange={(e) => setOrgData({ ...orgData, siret: e.target.value })}
                    className="mt-1"
                    placeholder="12345678901234"
                    maxLength={14}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Nécessaire pour la facturation française
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Continuer
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Choisissez vos modules</CardTitle>
              <CardDescription>
                Activez les fonctionnalités dont vous avez besoin. Vous pourrez les modifier plus tard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-medium">Facturation</h3>
                      <p className="text-sm text-gray-500">
                        Devis, factures, paiements Stripe, Factur-X
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={modules.billing}
                    onCheckedChange={(checked) => 
                      setModules({ ...modules, billing: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Ressources Humaines</h3>
                      <p className="text-sm text-gray-500">
                        Employés, congés, absences, exports paie
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={modules.people}
                    onCheckedChange={(checked) => 
                      setModules({ ...modules, people: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-purple-600" />
                    <div>
                      <h3 className="font-medium">Documents</h3>
                      <p className="text-sm text-gray-500">
                        Contrats, CGV, mises en demeure, modèles juridiques
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={modules.docs}
                    onCheckedChange={(checked) => 
                      setModules({ ...modules, docs: checked })
                    }
                  />
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Retour
                </Button>
                <Button onClick={handleCreateOrganization} disabled={loading} className="flex-1">
                  {loading ? 'Création...' : 'Créer mon espace'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Étape {step} sur 2
          </p>
        </div>
      </div>
    </div>
  )
}
