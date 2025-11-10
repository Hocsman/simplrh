import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url') {
      return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'not_configured',
        services: {
          supabase: 'not_configured',
          auth: 'not_configured'
        },
        message: 'Supabase not configured - running in demo mode'
      })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Test de connectivité à la base de données
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1)
    
    if (error) {
      throw error
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      services: {
        supabase: 'ok',
        auth: 'ok'
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
