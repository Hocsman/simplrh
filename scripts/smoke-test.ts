#!/usr/bin/env tsx
/**
 * Smoke Tests for SimplRH
 * 
 * Quick validation that critical endpoints are working
 * Run with: npm run test:smoke
 */

const COLORS = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
}

interface TestResult {
    name: string
    passed: boolean
    duration: number
    error?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function runTest(name: string, testFn: () => Promise<void>): Promise<TestResult> {
    const start = Date.now()
    try {
        await testFn()
        const duration = Date.now() - start
        console.log(`${COLORS.green}✅${COLORS.reset} ${name} - OK (${duration}ms)`)
        return { name, passed: true, duration }
    } catch (error) {
        const duration = Date.now() - start
        const errorMsg = error instanceof Error ? error.message : String(error)
        console.log(`${COLORS.red}❌${COLORS.reset} ${name} - FAILED (${duration}ms)`)
        console.log(`   ${COLORS.red}${errorMsg}${COLORS.reset}`)
        return { name, passed: false, duration, error: errorMsg }
    }
}

async function testHealthCheck() {
    const response = await fetch(`${BASE_URL}/api/health`)
    if (!response.ok) {
        throw new Error(`Health check failed with status ${response.status}`)
    }
    const data = await response.json()
    if (data.status !== 'healthy' && data.status !== 'unhealthy') {
        throw new Error('Invalid health check response')
    }
}

async function testSupabaseConnection() {
    // Test that Supabase env vars are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
        throw new Error('Supabase URL not configured')
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase Anon Key not configured')
    }
}

async function testAPIRoutesExist() {
    // Test that critical API routes exist (return 401 without auth is OK)
    const routes = [
        '/api/billing/customers',
        '/api/billing/invoices',
        '/api/people/employees',
        '/api/people/leave-requests'
    ]

    for (const route of routes) {
        const response = await fetch(`${BASE_URL}${route}`)
        if (response.status !== 401 && !response.ok) {
            throw new Error(`Route ${route} returned unexpected status ${response.status}`)
        }
    }
}

async function testLoggerImports() {
    // Verify logger is properly imported (static check)
    const fs = await import('fs/promises')
    const loggerContent = await fs.readFile('lib/logger.ts', 'utf-8')

    if (!loggerContent.includes('class Logger')) {
        throw new Error('Logger class not found')
    }

    if (!loggerContent.includes('export const logger')) {
        throw new Error('Logger instance not exported')
    }
}

async function testZodSchemas() {
    // Verify Zod schemas exist
    const fs = await import('fs/promises')

    const billingSchemas = await fs.readFile('domains/billing/schemas.ts', 'utf-8')
    if (!billingSchemas.includes('createCustomerSchema')) {
        throw new Error('Billing schemas not found')
    }

    const peopleSchemas = await fs.readFile('domains/people/schemas.ts', 'utf-8')
    if (!peopleSchemas.includes('createEmployeeSchema')) {
        throw new Error('People schemas not found')
    }
}

async function main() {
    console.log(`\n${COLORS.blue}🏃 Running SimplRH Smoke Tests...${COLORS.reset}\n`)

    const results: TestResult[] = []

    // Run all tests
    results.push(await runTest('Health Check API', testHealthCheck))
    results.push(await runTest('Supabase Configuration', testSupabaseConnection))
    results.push(await runTest('API Routes Exist', testAPIRoutesExist))
    results.push(await runTest('Logger Service', testLoggerImports))
    results.push(await runTest('Zod Validation Schemas', testZodSchemas))

    // Summary
    console.log(`\n${COLORS.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`)

    const passed = results.filter(r => r.passed).length
    const total = results.length
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)

    if (passed === total) {
        console.log(`\n${COLORS.green}🎉 All tests passed! (${passed}/${total})${COLORS.reset}`)
    } else {
        console.log(`\n${COLORS.red}❌ Some tests failed (${passed}/${total})${COLORS.reset}`)
        process.exit(1)
    }

    console.log(`${COLORS.blue}⏱️  Total time: ${(totalDuration / 1000).toFixed(2)}s${COLORS.reset}\n`)
}

main().catch((error) => {
    console.error(`${COLORS.red}Fatal error:${COLORS.reset}`, error)
    process.exit(1)
})
