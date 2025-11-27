'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function EmployeeError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Employee page error:', error)
  }, [error])

  return (
    <div className="space-y-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Une erreur est survenue
            </h2>
            <p className="text-red-700 mb-4">
              {error.message || 'Une erreur inattendue s\'est produite'}
            </p>
            {process.env.NODE_ENV === 'development' && error.stack && (
              <pre className="bg-red-100 p-4 rounded text-xs text-red-800 overflow-auto mb-4">
                {error.stack}
              </pre>
            )}
            <Button onClick={() => reset()} variant="outline">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
