import { getHeader } from 'h3'
import { useSupabaseAdmin } from '../../utils/supabase'
import {
  sendEmail,
  sendSms,
  emailReviewRequest,
  smsReviewRequest,
} from '../../utils/notification'

export default defineEventHandler(async (event) => {
  // Sécurité : vérifier le secret cron
  const secret = getHeader(event, 'x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    throw createError({ statusCode: 401 })
  }

  const supabase = useSupabaseAdmin()
  const siteUrl = process.env.SITE_URL ?? ''

  // Récupérer la config (délai en jours, canaux)
  const { data: settings } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['review_delay_days', 'review_channel'])

  const config = Object.fromEntries(settings?.map(s => [s.key, s.value]) ?? [])
  const delayDays = parseInt(config.review_delay_days ?? '3', 10)
  const channel = config.review_channel ?? 'both' // 'email' | 'sms' | 'both'

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - delayDays)

  // Interventions terminées, non encore relancées, dont le délai est écoulé
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, name, email, phone')
    .eq('status', 'completed')
    .eq('review_requested', false)
    .lte('completed_at', cutoffDate.toISOString())

  if (!bookings?.length) return { sent: 0 }

  let sent = 0
  for (const booking of bookings) {
    const tasks: Promise<unknown>[] = []

    if (channel === 'email' || channel === 'both') {
      tasks.push(sendEmail({ to: booking.email, ...emailReviewRequest(booking.name, siteUrl) }))
    }
    if (channel === 'sms' || channel === 'both') {
      tasks.push(sendSms({ to: booking.phone, body: smsReviewRequest(siteUrl) }))
    }

    await Promise.allSettled(tasks)
    await supabase.from('bookings').update({ review_requested: true }).eq('id', booking.id)
    sent++
  }

  return { sent }
})
