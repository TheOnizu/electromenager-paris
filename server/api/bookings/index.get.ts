import { requireAdmin } from '../../utils/adminAuth'
import { useSupabaseAdmin } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useSupabaseAdmin()

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw createError({ statusCode: 500 })
  return data
})
