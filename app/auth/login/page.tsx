'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      supabase = createClient()
    }
  } catch (error) {
    setSupabaseError('Configuration Supabase manquante')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!isSupabaseConfigured) {
      toast({
        title: 'Mode développement',
        description: 'Supabase non configuré - redirection vers le dashboard'
      })
      router.push('/dashboard')
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Check for specific error types
        if (error.message?.includes('Invalid login credentials')) {
          toast({
            variant: 'destructive',
            title: 'Identifiants incorrects',
            description: 'Email ou mot de passe incorrect. Veuillez réessayer.'
          })
        } else if (error.message?.includes('Email not confirmed')) {
          toast({
            variant: 'destructive',
            title: 'Email non confirmé',
            description: (
              <div>
                Veuillez confirmer votre email avant de vous connecter.{' '}
                <span className="text-xs">Vérifiez votre boîte de réception.</span>
              </div>
            ) as any
          })
        } else {
          toast({
            variant: 'destructive',
            title: 'Erreur de connexion',
            description: error.message
          })
        }
      } else {
        toast({
          title: 'Connexion réussie',
          description: 'Redirection en cours...'
        })
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la connexion'
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
                Cliquez sur "Se connecter" pour accéder directement au dashboard.
              </p>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte SimplRH
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="votre@email.com"
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
                  className="mt-1"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                  Créer un compte
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/auth/reset-password" className="text-sm text-blue-600 hover:text-blue-500">
                Mot de passe oublié ?
              </Link>
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