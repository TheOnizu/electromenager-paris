import { readBody } from 'h3'
import { requireAdmin } from '../../utils/adminAuth'
import { useSupabaseAdmin } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event) // { key: string, value: string }[]
  const supabase = useSupabaseAdmin()

  const upserts = Object.entries(body).map(([key, value]) => ({ key, value }))
  const { error } = await supabase.from('settings').upsert(upserts, { onConflict: 'key' })

  if (error) throw createError({ statusCode: 500 })
  return { ok: true }
})
