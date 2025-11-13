'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">Une erreur est survenue</CardTitle>
          <CardDescription>
            L'application a rencontré une erreur inattendue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm font-mono text-destructive">
                {error.message}
              </p>
              {error.stack && (
                <pre className="mt-2 text-xs overflow-auto max-h-40">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={reset} variant="outline">
            Réessayer
          </Button>
          <Button onClick={() => window.location.href = '/'}>
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
