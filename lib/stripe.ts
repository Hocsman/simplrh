import Stripe from 'stripe'
import { logger } from './logger'
import {
  handleCheckoutCompleted,
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted
} from '@/domains/billing/stripe-webhooks'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20'
})

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: string[]
  stripePriceIds: {
    monthly: string
    yearly: string
  }
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Parfait pour les freelances et petites structures',
    price: {
      monthly: 29,
      yearly: 290 // 2 mois offerts
    },
    features: [
      'Jusqu\'à 5 employés',
      'Facturation illimitée',
      'Gestion des congés',
      'Documents juridiques de base',
      'Support email'
    ],
    stripePriceIds: {
      monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || 'price_starter_monthly',
      yearly: process.env.STRIPE_STARTER_YEARLY_PRICE_ID || 'price_starter_yearly'
    }
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Idéal pour les PME en croissance',
    price: {
      monthly: 59,
      yearly: 590
    },
    features: [
      'Jusqu\'à 25 employés',
      'Toutes les fonctionnalités Starter',
      'Exports paie Silae/PayFit',
      'Templates documents avancés',
      'Intégrations API',
      'Support prioritaire'
    ],
    stripePriceIds: {
      monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || 'price_business_monthly',
      yearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID || 'price_business_yearly'
    }
  },
  {
    id: 'suite',
    name: 'Suite',
    description: 'Solution complète pour les entreprises',
    price: {
      monthly: 99,
      yearly: 990
    },
    features: [
      'Employés illimités',
      'Toutes les fonctionnalités Business',
      '+ 2€/employé/mois au-delà de 50',
      'Audit et logs complets',
      'Formations incluses',
      'Support dédié'
    ],
    stripePriceIds: {
      monthly: process.env.STRIPE_SUITE_MONTHLY_PRICE_ID || 'price_suite_monthly',
      yearly: process.env.STRIPE_SUITE_YEARLY_PRICE_ID || 'price_suite_yearly'
    }
  }
]

export function getPlan(planId: string): PricingPlan | undefined {
  return PRICING_PLANS.find(plan => plan.id === planId)
}

export async function createCheckoutSession(
  planId: string,
  interval: 'monthly' | 'yearly',
  customerId?: string,
  successUrl?: string,
  cancelUrl?: string
) {
  const plan = getPlan(planId)
  if (!plan) {
    throw new Error(`Plan not found: ${planId}`)
  }

  const priceId = interval === 'monthly' ? plan.stripePriceIds.monthly : plan.stripePriceIds.yearly

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    metadata: {
      plan_id: planId,
      interval
    }
  })

  return session
}

export async function createCustomerPortalSession(customerId: string, returnUrl?: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`
  })

  return session
}

export async function handleWebhookEvent(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        logger.info('Processing checkout.session.completed', { session: session.id })
        await handleCheckoutCompleted(session)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice
        logger.info('Processing invoice.payment_succeeded', { invoice: invoice.id })
        await handleInvoicePaymentSucceeded(invoice)
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice
        logger.warn('Processing invoice.payment_failed', { invoice: failedInvoice.id })
        await handleInvoicePaymentFailed(failedInvoice)
        break

      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        logger.info('Processing customer.subscription.updated', { subscription: subscription.id })
        await handleSubscriptionUpdated(subscription)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        logger.warn('Processing customer.subscription.deleted', { subscription: deletedSubscription.id })
        await handleSubscriptionDeleted(deletedSubscription)
        break

      default:
        logger.debug(`Unhandled Stripe event type: ${event.type}`)
    }
  } catch (error) {
    logger.error('Error handling Stripe webhook event', error, { eventType: event.type })
    throw error
  }
}

export function formatPrice(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(amount)
}
