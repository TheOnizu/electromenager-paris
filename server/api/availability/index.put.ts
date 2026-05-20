import { readBody } from 'h3'
import { requireAdmin } from '../../utils/adminAuth'
import { useSupabaseAdmin } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { date, is_available } = await readBody(event)
  const supabase = useSupabaseAdmin()

  const { error } = await supabase
    .from('availability')
    .upsert({ date, is_available }, { onConflict: 'date' })

  if (error) throw createError({ statusCode: 500 })
  return { ok: true }
})
