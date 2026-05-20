import { useSupabaseAdmin } from '../../utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase.from('services').select('*').order('name')
  if (error) throw createError({ statusCode: 500 })
  return data
})
