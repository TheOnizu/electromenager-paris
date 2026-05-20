import { readBody } from 'h3'
import { z } from 'zod'
import { useSupabaseAdmin } from '../../utils/supabase'

const reviewSchema = z.object({
  author_name: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = reviewSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, data: parsed.error.flatten() })
  }

  const supabase = useSupabaseAdmin()
  const { error } = await supabase
    .from('reviews')
    .insert({ ...parsed.data, status: 'pending' })

  if (error) throw createError({ statusCode: 500 })
  return { ok: true }
})
