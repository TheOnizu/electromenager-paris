import { useSupabaseAdmin } from '../../utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase.from('settings').select('key, value')
  if (error) throw createError({ statusCode: 500 })

  return Object.fromEntries(data.map(({ key, value }) => [key, value]))
})
