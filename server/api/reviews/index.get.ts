import { getQuery } from 'h3'
import { useSupabaseAdmin } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const { pending } = getQuery(event)
  const supabase = useSupabaseAdmin()

  // pending=1 → admin view (requires auth handled in caller via middleware)
  const status = pending === '1' ? 'pending' : 'published'

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500 })
  return data
})
