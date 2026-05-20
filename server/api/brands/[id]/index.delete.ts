import { requireAdmin } from '../../../utils/adminAuth'
import { useSupabaseAdmin } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const supabase = useSupabaseAdmin()
  const { error } = await supabase.from('brands').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500 })
  return { ok: true }
})
