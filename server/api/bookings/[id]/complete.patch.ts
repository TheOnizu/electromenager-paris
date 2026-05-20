import { requireAdmin } from '../../../utils/adminAuth'
import { useSupabaseAdmin } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const supabase = useSupabaseAdmin()

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw createError({ statusCode: 500 })
  return { ok: true }
})
