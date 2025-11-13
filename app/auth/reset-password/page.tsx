'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Check if this is a password update (user clicked link in email)
  const isUpdateMode = searchParams.get('type') === 'recovery'

  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key-here'

  const supabase = isSupabaseConfigured ? createClient() : null

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!isSupabaseConfigured || !supabase) {
      toast({
        variant: 'destructive',
        title: 'Configuration manquante',
        description: 'Supabase non configuré'
      })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      })

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: error.message
        })
      } else {
        setEmailSent(true)
        toast({
          title: 'Email envoyé !',
          description: 'Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.'
        })
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas'
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Mot de passe trop court',
        description: 'Le mot de passe doit contenir au moins 6 caractères'
      })
      return
    }

    setLoading(true)

    if (!isSupabaseConfigured || !supabase) {
      toast({
        variant: 'destructive',
        title: 'Configuration manquante',
        description: 'Supabase non configuré'
      })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: error.message
        })
      } else {
        setPasswordReset(true)
        toast({
          title: 'Mot de passe modifié !',
          description: 'Votre mot de passe a été mis à jour avec succès.'
        })

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.'
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isUpdateMode ? 'Nouveau mot de passe' : 'Mot de passe oublié'}
            </CardTitle>
            <CardDescription>
              {isUpdateMode
                ? 'Entrez votre nouveau mot de passe'
                : 'Entrez votre email pour recevoir un lien de réinitialisation'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {passwordReset ? (
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900">
                  Mot de passe modifié !
                </h3>
                <p className="text-sm text-gray-600">
                  Redirection vers la page de connexion...
                </p>
              </div>
            ) : emailSent && !isUpdateMode ? (
              <div className="space-y-4">
                <div className="text-center">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Email envoyé !
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    Vérifiez également votre dossier spam si vous ne voyez pas l'email.
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setEmailSent(false)
                    setEmail('')
                  }}
                >
                  Renvoyer l'email
                </Button>

                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-sm text-blue-600 hover:text-blue-500 inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </div>
              </div>
            ) : isUpdateMode ? (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    Nouveau mot de passe
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="mt-1"
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 6 caractères
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmer le mot de passe
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="mt-1"
                    placeholder="••••••••"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Modification...' : 'Modifier le mot de passe'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRequestReset} className="space-y-4">
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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
                </Button>

                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-sm text-blue-600 hover:text-blue-500 inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </div>
              </form>
            )}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
