import { useSupabaseAdmin } from '../../utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('availability')
    .select('date, is_available')
    .gte('date', today)
    .order('date')

  if (error) throw createError({ statusCode: 500 })
  return data
})
