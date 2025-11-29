/**
 * Centralized Logging Service
 * 
 * Usage:
 *   import { logger } from '@/lib/logger'
 *   logger.info('User logged in', { userId: '123' })
 *   logger.error('Failed to create invoice', error)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  /**
   * Debug logs - only visible in development
   * Use for detailed debugging information
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`🔍 [DEBUG] ${message}`, context || '')
    }
  }

  /**
   * Info logs - general information
   * Use for normal application flow
   */
  info(message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString()
    console.log(`ℹ️  [INFO] ${timestamp} - ${message}`, context || '')
  }

  /**
   * Warning logs - potential issues
   * Use for recoverable errors or deprecated features
   */
  warn(message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString()
    console.warn(`⚠️  [WARN] ${timestamp} - ${message}`, context || '')
  }

  /**
   * Error logs - critical issues
   * Use for exceptions and failures
   */
  error(message: string, error?: Error | any, context?: LogContext): void {
    const timestamp = new Date().toISOString()
    console.error(`❌ [ERROR] ${timestamp} - ${message}`, {
      error: error?.message || error,
      stack: error?.stack,
      ...context
    })

    // Send to Sentry in production if configured
    if (this.isProduction && typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: { context: message },
        extra: context
      })
    }
  }

  /**
   * Success logs - operations completed successfully
   * Use for important positive outcomes
   */
  success(message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString()
    console.log(`✅ [SUCCESS] ${timestamp} - ${message}`, context || '')
  }

  /**
   * API logs - HTTP requests/responses
   * Use for API route debugging
   */
  api(method: string, path: string, status: number, duration?: number): void {
    const emoji = status >= 200 && status < 300 ? '✅' : status >= 400 ? '❌' : '⚠️'
    const durationStr = duration ? ` (${duration}ms)` : ''
    this.info(`${emoji} ${method} ${path} - ${status}${durationStr}`)
  }
}

// Export singleton instance
export const logger = new Logger()

// Export types for external use
export type { LogLevel, LogContext }
