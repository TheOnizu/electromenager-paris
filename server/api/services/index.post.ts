import { readBody } from 'h3'
import { z } from 'zod'
import { requireAdmin } from '../../utils/adminAuth'
import { useSupabaseAdmin } from '../../utils/supabase'

const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(5),
  icon: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400 })

  const supabase = useSupabaseAdmin()
  const { error } = await supabase.from('services').insert(parsed.data)
  if (error) throw createError({ statusCode: 500 })
  return { ok: true }
})
