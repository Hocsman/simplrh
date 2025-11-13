'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardTestPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [envStatus, setEnvStatus] = useState<any>({})

  useEffect(() => {
    checkEnvironment()
    checkUser()
  }, [])

  const checkEnvironment = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    setEnvStatus({
      supabaseUrl: supabaseUrl ? '✅ Configuré' : '❌ Manquant',
      supabaseKey: supabaseKey ? '✅ Configuré' : '❌ Manquant',
      urlValue: supabaseUrl || 'Non défini',
      keyValue: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Non défini'
    })
  }

  const checkUser = async () => {
    try {
      const supabase = createClientComponentClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        setError(`Erreur: ${error.message}`)
      } else {
        setUser(user)
      }
    } catch (err) {
      setError(`Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTestLogin = async () => {
    try {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123'
      })
      
      if (error) {
        setError(`Erreur de connexion: ${error.message}`)
      } else {
        setUser(data.user)
        setError('')
      }
    } catch (err) {
      setError(`Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test d'accès au Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status de l'environnement */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'environnement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</p>
                <p className="text-sm text-gray-600">{envStatus.supabaseUrl}</p>
                <p className="text-xs text-gray-500">{envStatus.urlValue}</p>
              </div>
              <div>
                <p className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</p>
                <p className="text-sm text-gray-600">{envStatus.supabaseKey}</p>
                <p className="text-xs text-gray-500">{envStatus.keyValue}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status de l'utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle>Status de l'utilisateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p>Vérification en cours...</p>
              ) : user ? (
                <div>
                  <p className="text-green-600">✅ Utilisateur connecté</p>
                  <p className="text-sm text-gray-600">Email: {user.email}</p>
                  <p className="text-sm text-gray-600">ID: {user.id}</p>
                </div>
              ) : (
                <div>
                  <p className="text-red-600">❌ Aucun utilisateur connecté</p>
                  <Button onClick={handleTestLogin} className="mt-2">
                    Tester la connexion
                  </Button>
                </div>
              )}
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 space-x-4">
          <Button asChild>
            <Link href="/dashboard">
              Aller au Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/login">
              Page de connexion
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/login-debug">
              Debug de connexion
            </Link>
          </Button>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions pour résoudre le problème</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">1. Configurer Supabase</h3>
              <p className="text-sm text-gray-600">
                Créez un projet Supabase et mettez à jour le fichier <code>.env.local</code> avec vos vraies clés.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg">2. Mode développement</h3>
              <p className="text-sm text-gray-600">
                Si vous n'avez pas encore configuré Supabase, le middleware permet l'accès à toutes les routes.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg">3. Tester l'accès</h3>
              <p className="text-sm text-gray-600">
                Utilisez les boutons ci-dessus pour tester différents scénarios d'accès.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}






