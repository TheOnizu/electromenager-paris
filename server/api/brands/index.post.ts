import { readBody } from 'h3'
import { z } from 'zod'
import { requireAdmin } from '../../utils/adminAuth'
import { useSupabaseAdmin } from '../../utils/supabase'

const schema = z.object({
  name: z.string().min(1),
  logo_url: z.string().url(),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400 })

  const supabase = useSupabaseAdmin()
  const { error } = await supabase.from('brands').insert(parsed.data)
  if (error) throw createError({ statusCode: 500 })
  return { ok: true }
})
