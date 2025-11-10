'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { setAnalyticsConsent, initAnalytics } from '@/lib/analytics'
import { X, Cookie } from 'lucide-react'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Initialize analytics and check if consent was already given
    initAnalytics()
    
    const consent = localStorage.getItem('analytics-consent')
    if (consent === null) {
      // Show banner if no consent decision was made
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setAnalyticsConsent(true)
    setIsVisible(false)
  }

  const handleDecline = () => {
    setAnalyticsConsent(false)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="p-4 shadow-lg border-2">
        <div className="flex items-start gap-3">
          <Cookie className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-2">
              Cookies et Analytics
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic. 
              Acceptez-vous les cookies analytics ?
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleAccept}
                className="flex-1"
              >
                Accepter
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleDecline}
                className="flex-1"
              >
                Refuser
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDecline}
            className="p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
