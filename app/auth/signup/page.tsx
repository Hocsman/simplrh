'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [supabaseError, setSupabaseError] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key-here'

  let supabase: any = null
  try {
    if (isSupabaseConfigured) {
      supabase = createClientComponentClient()
    }
  } catch (error) {
    setSupabaseError('Configuration Supabase manquante')
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!isSupabaseConfigured) {
      toast({
        title: 'Mode développement',
        description: 'Supabase non configuré - redirection vers le dashboard'
      })
      router.push('/dashboard')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        console.error('Erreur Supabase:', error)
        toast({
          variant: 'destructive',
          title: 'Erreur d\'inscription',
          description: `${error.message} (Code: ${error.status || 'inconnu'})`
        })
      } else if (data.user) {
        console.log('Utilisateur créé avec succès:', data.user)
        
        // Try to create user record in our users table
        try {
          const { error: userError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
            })

          if (userError) {
            console.error('Error creating user record:', userError)
            // Continue anyway, the auth user is created
          }
        } catch (userErr) {
          console.error('Failed to insert user record:', userErr)
          // Continue anyway
        }

        toast({
          title: 'Compte créé !',
          description: 'Vérifiez votre email pour confirmer votre compte.'
        })
        
        // Redirect to onboarding to setup organization
        router.push('/onboarding')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'inscription'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-blue-600">SimplRH</h1>
          </Link>
          <p className="mt-2 text-gray-600">La suite admin pour PME</p>
          {!isSupabaseConfigured && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Mode développement :</strong> Supabase non configuré. 
                Cliquez sur "S'inscrire" pour accéder directement au dashboard.
              </p>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Créer un compte</CardTitle>
            <CardDescription>
              Rejoignez SimplRH et simplifiez votre gestion d'entreprise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email professionnel
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="jean@monentreprise.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 6 caractères
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Création...' : 'Créer mon compte'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Se connecter
                </Link>
              </p>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              En créant un compte, vous acceptez nos{' '}
              <Link href="/legal/terms" className="text-blue-600 hover:text-blue-500">
                conditions d'utilisation
              </Link>{' '}
              et notre{' '}
              <Link href="/legal/privacy" className="text-blue-600 hover:text-blue-500">
                politique de confidentialité
              </Link>
              .
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}