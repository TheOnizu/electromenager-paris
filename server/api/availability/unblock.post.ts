import { readBody } from 'h3'
import { requireAdmin } from '../../utils/adminAuth'
import { useSupabaseAdmin } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { dates } = await readBody(event)
  const supabase = useSupabaseAdmin()

  const { error } = await supabase
    .from('availability')
    .delete()
    .in('date', dates)

  if (error) throw createError({ statusCode: 500 })
  return { ok: true }
})
