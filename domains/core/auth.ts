import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { logger } from '@/lib/logger'

export interface User {
  id: string
  email: string
  full_name?: string
}

export interface Organization {
  id: string
  name: string
  siret?: string
  billing_plan: 'starter' | 'business' | 'suite'
  modules: {
    billing: boolean
    people: boolean
    docs: boolean
  }
  owner_id: string
}

export interface Member {
  org_id: string
  user_id: string
  role: 'owner' | 'admin' | 'manager' | 'employee' | 'accountant' | 'legal'
  user?: User
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // No-op for server components
        },
        remove(name: string, options: any) {
          // No-op for server components
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return userData as User
}

export async function requireAuth() {
  try {
    const user = await getCurrentUser()
    if (user) return user
  } catch (error) {
    logger.debug('Dev mode: using mock user')
  }

  // Mode développement : retourner un utilisateur mock avec UUID valide
  return {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'demo@simplrh.com',
    full_name: 'Utilisateur Demo'
  } as User
}

export async function getUserOrganizations(userId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // No-op for server components
        },
        remove(name: string, options: any) {
          // No-op for server components
        },
      },
    }
  )

  const { data } = await supabase
    .from('members')
    .select(`
      org_id,
      role,
      orgs:org_id (
        id,
        name,
        siret,
        billing_plan,
        modules,
        owner_id
      )
    `)
    .eq('user_id', userId)

  return data?.map(item => ({
    ...(item.orgs as any),
    role: item.role as Member['role']
  })) as (Organization & { role: Member['role'] })[] || []
}

export async function getCurrentOrganization() {
  const user = await requireAuth()
  const orgs = await getUserOrganizations(user.id)

  // Pour simplifier, on prend la première org
  // En production, on gérerait un système de sélection d'org
  return orgs?.[0] || null
}

export async function requireOrganization() {
  try {
    const org = await getCurrentOrganization()
    if (org) return org
  } catch (error) {
    logger.debug('Dev mode: using mock organization')
  }

  // Mode développement : retourner une organisation mock avec UUID valide
  return {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Entreprise Demo',
    siret: '12345678901234',
    billing_plan: 'starter' as const,
    modules: { billing: true, people: true, docs: true },
    owner_id: '00000000-0000-0000-0000-000000000002'
  } as Organization
}

async function createDefaultOrganization(userId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // No-op for server components
        },
        remove(name: string, options: any) {
          // No-op for server components
        },
      },
    }
  )

  // Créer l'organisation par défaut
  const { data: org, error: orgError } = await supabase
    .from('orgs')
    .insert({
      name: 'Mon Entreprise',
      billing_plan: 'starter',
      modules: { billing: true, people: true, docs: true },
      owner_id: userId
    })
    .select()
    .single()

  if (orgError) {
    logger.error('Error creating default organization', orgError)
    throw new Error('Failed to create default organization')
  }

  // Ajouter l'utilisateur comme membre
  const { error: memberError } = await supabase
    .from('members')
    .insert({
      org_id: org.id,
      user_id: userId,
      role: 'owner'
    })

  if (memberError) {
    logger.error('Error adding user as member', memberError)
    throw new Error('Failed to add user as member')
  }

  return org as Organization
}

export async function hasPermission(
  action: string,
  resource: 'billing' | 'people' | 'docs' | 'settings',
  userRole: Member['role']
): Promise<boolean> {
  // Logique de permissions basée sur les rôles
  const permissions: Record<Member['role'], string[]> = {
    owner: ['*'],
    admin: ['*'],
    manager: ['billing.read', 'billing.write', 'people.read', 'people.write', 'docs.read'],
    employee: ['people.read', 'people.write_own', 'docs.read'],
    accountant: ['billing.read', 'billing.write'],
    legal: ['docs.read', 'docs.write']
  }

  const userPermissions = permissions[userRole] || []

  if (userPermissions.includes('*')) return true

  const fullPermission = `${resource}.${action}`
  return userPermissions.includes(fullPermission)
}
