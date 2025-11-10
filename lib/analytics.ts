// Simple analytics placeholder with consent management
let analyticsConsent = false

export function initAnalytics() {
  // Check for existing consent
  if (typeof window !== 'undefined') {
    const consent = localStorage.getItem('analytics-consent')
    analyticsConsent = consent === 'true'
  }
}

export function setAnalyticsConsent(consent: boolean) {
  analyticsConsent = consent
  if (typeof window !== 'undefined') {
    localStorage.setItem('analytics-consent', consent.toString())
  }
}

export function hasAnalyticsConsent(): boolean {
  return analyticsConsent
}

export function logEvent(eventName: string, properties: Record<string, any> = {}) {
  if (!hasAnalyticsConsent()) {
    return
  }

  // Placeholder implementation - replace with your analytics provider
  console.log('📊 Analytics Event:', eventName, properties)
  
  // Example: Google Analytics 4
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', eventName, properties)
  // }
}

export function logPageView(url: string) {
  logEvent('page_view', {
    page_location: url,
    page_title: document.title
  })
}

export function logSignup(method: string = 'email') {
  logEvent('sign_up', {
    method,
    timestamp: new Date().toISOString()
  })
}

export function logLogin(method: string = 'email') {
  logEvent('login', {
    method,
    timestamp: new Date().toISOString()
  })
}

export function logPricingView(plan: string) {
  logEvent('view_pricing', {
    plan,
    timestamp: new Date().toISOString()
  })
}

export function logDemoRequest() {
  logEvent('request_demo', {
    timestamp: new Date().toISOString()
  })
}
