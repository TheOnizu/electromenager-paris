import { readBody } from 'h3'
import { requireAdmin } from '../../../utils/adminAuth'
import { useSupabaseAdmin } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const { status } = await readBody(event) // 'published' | 'rejected'

  if (!['published', 'rejected'].includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Statut invalide' })
  }

  const supabase = useSupabaseAdmin()
  const { error } = await supabase.from('reviews').update({ status }).eq('id', id)
  if (error) throw createError({ statusCode: 500 })
  return { ok: true }
})
