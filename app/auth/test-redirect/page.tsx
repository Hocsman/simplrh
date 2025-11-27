'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestRedirectPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        setError(`Erreur: ${error.message}`)
        setLoading(false)
        return
      }

      if (user) {
        setUser(user)
        setLoading(false)
        // Redirection automatique après 2 secondes
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError('Aucun utilisateur connecté')
        setLoading(false)
      }
    } catch (err) {
      setError(`Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`)
      setLoading(false)
    }
  }

  const handleManualRedirect = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de la session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle>Test de Redirection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800">✅ Utilisateur connecté</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Email: {user.email}
                  </p>
                  <p className="text-sm text-green-700">
                    ID: {user.id}
                  </p>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Redirection automatique vers le dashboard dans 2 secondes...
                  </p>
                  
                  <Button onClick={handleManualRedirect} className="w-full">
                    Redirection manuelle vers Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium text-red-800">❌ Problème de session</h3>
                <p className="text-sm text-red-700 mt-1">
                  {error || 'Aucun utilisateur connecté'}
                </p>
                
                <div className="mt-4">
                  <Button onClick={() => router.push('/auth/login-debug')} className="w-full">
                    Retour à la connexion
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}







