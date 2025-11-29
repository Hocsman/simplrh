import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  siret: z.string().optional(),
})

export type CreateOrganizationData = z.infer<typeof createOrganizationSchema>

export async function createOrganization(data: CreateOrganizationData, ownerId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // Créer l'organisation
  const { data: org, error: orgError } = await supabase
    .from('orgs')
    .insert({
      name: data.name,
      siret: data.siret,
      owner_id: ownerId,
      billing_plan: 'starter',
      modules: {
        billing: true,
        people: true,
        docs: true
      }
    })
    .select()
    .single()

  if (orgError) throw orgError

  // Ajouter le propriétaire comme membre
  const { error: memberError } = await supabase
    .from('members')
    .insert({
      org_id: org.id,
      user_id: ownerId,
      role: 'owner'
    })

  if (memberError) throw memberError

  return org
}

export async function updateOrganizationModules(
  orgId: string, 
  modules: { billing: boolean; people: boolean; docs: boolean }
) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data, error } = await supabase
    .from('orgs')
    .update({ modules })
    .eq('id', orgId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function inviteMember(orgId: string, email: string, role: string) {
  // TODO: Implémenter l'invitation par email
  // Pour l'instant, on simule
  console.log(`Inviting ${email} as ${role} to org ${orgId}`)
  return { success: true }
}



