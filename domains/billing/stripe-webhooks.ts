/**
 * Stripe Webhooks Handler
 * 
 * Handles all Stripe webhook events for billing operations
 */

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import type Stripe from 'stripe'

/**
 * Update organization billing after successful checkout
 */
export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const { customer, subscription, metadata } = session
    const { plan_id, interval } = metadata || {}

    if (!customer || !plan_id) {
        logger.warn('Missing required data in checkout session', { session: session.id })
        return
    }

    const supabase = await createClient()

    // Update organization with Stripe data
    const { error } = await supabase
        .from('orgs')
        .update({
            stripe_customer_id: customer as string,
            stripe_subscription_id: subscription as string,
            billing_plan: plan_id,
            billing_interval: interval || 'monthly',
            subscription_status: 'active',
            updated_at: new Date().toISOString()
        })
        .eq('stripe_customer_id', customer as string)

    if (error) {
        logger.error('Failed to update organization billing', error, {
            customer,
            session: session.id
        })
        throw error
    }

    logger.success(`Organization billing activated: ${customer}`, {
        plan: plan_id,
        interval
    })
}

/**
 * Handle successful invoice payment
 */
export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const { customer, amount_paid, subscription } = invoice

    logger.info('Invoice payment succeeded', {
        customer,
        amount: amount_paid / 100,
        subscription
    })

    const supabase = await createClient()

    // Update subscription status if needed
    if (subscription) {
        const { error } = await supabase
            .from('orgs')
            .update({
                subscription_status: 'active',
                updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscription as string)

        if (error) {
            logger.error('Failed to update subscription status', error)
        }
    }

    // TODO: Send confirmation email to customer
    logger.success(`Payment processed: ${amount_paid / 100}€ for customer ${customer}`)
}

/**
 * Handle failed invoice payment
 */
export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const { customer, amount_due, subscription, attempt_count } = invoice

    logger.warn('Invoice payment failed', {
        customer,
        amount: amount_due / 100,
        attempt: attempt_count
    })

    const supabase = await createClient()

    // Update subscription status to past_due if critical
    if (subscription && attempt_count && attempt_count >= 3) {
        const { error } = await supabase
            .from('orgs')
            .update({
                subscription_status: 'past_due',
                updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscription as string)

        if (error) {
            logger.error('Failed to update subscription to past_due', error)
        }
    }

    // TODO: Send payment failed notification email
    logger.error(`Payment failed for customer ${customer} after ${attempt_count} attempts`)
}

/**
 * Handle subscription updates
 */
export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const { id, customer, status, items } = subscription
    const plan = items.data[0]?.price

    logger.info('Subscription updated', {
        subscription: id,
        customer,
        status
    })

    const supabase = await createClient()

    const updateData: any = {
        subscription_status: status,
        updated_at: new Date().toISOString()
    }

    // Extract plan info from price metadata if available
    if (plan?.metadata?.plan_id) {
        updateData.billing_plan = plan.metadata.plan_id
    }

    const { error } = await supabase
        .from('orgs')
        .update(updateData)
        .eq('stripe_subscription_id', id)

    if (error) {
        logger.error('Failed to update subscription details', error)
        throw error
    }

    logger.success(`Subscription updated: ${id} - status: ${status}`)
}

/**
 * Handle subscription cancellation
 */
export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const { id, customer, canceled_at } = subscription

    logger.warn('Subscription canceled', {
        subscription: id,
        customer,
        canceled_at
    })

    const supabase = await createClient()

    // Update organization to canceled status
    const { error } = await supabase
        .from('orgs')
        .update({
            subscription_status: 'canceled',
            updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', id)

    if (error) {
        logger.error('Failed to update subscription to canceled', error)
        throw error
    }

    // TODO: Send cancellation confirmation email
    // TODO: Set grace period before account restriction
    logger.success(`Subscription canceled: ${id}`)
}
