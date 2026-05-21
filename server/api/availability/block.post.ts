import { readBody } from 'h3'
import { requireAdmin } from '../../utils/adminAuth'
import { useSupabaseAdmin } from '../../utils/supabase'
import { generateDateRange, generateWeekdayDates } from '../../utils/availability-rules'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const supabase = useSupabaseAdmin()

  let dates: string[] = []

  if (body.type === 'range') {
    dates = generateDateRange(body.from, body.to)
  }
  else if (body.type === 'weekdays') {
    dates = generateWeekdayDates(body.weekdays, body.horizon ?? 90)
  }
  else {
    throw createError({ statusCode: 400, statusMessage: 'Type invalide' })
  }

  if (dates.length === 0) return { ok: true, count: 0 }

  const rows = dates.map(date => ({ date, is_available: false }))
  const { error } = await supabase
    .from('availability')
    .upsert(rows, { onConflict: 'date' })

  if (error) throw createError({ statusCode: 500 })
  return { ok: true, count: dates.length }
})
