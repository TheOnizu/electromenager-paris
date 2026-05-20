import { readBody } from 'h3'
import { z } from 'zod'
import { useSupabaseAdmin } from '../../utils/supabase'
import {
  sendEmail,
  sendSms,
  emailConfirmationClient,
  emailNotificationAdmin,
  smsConfirmationClient,
} from '../../utils/notification'

const bookingSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  address: z.string().min(5),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cgv_accepted: z.literal(true),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = bookingSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Données invalides', data: parsed.error.flatten() })
  }

  const { name, phone, email, address, date } = parsed.data
  const supabase = useSupabaseAdmin()

  // Vérifier que la date est disponible
  const { data: availability } = await supabase
    .from('availability')
    .select('is_available')
    .eq('date', date)
    .single()

  if (!availability?.is_available) {
    throw createError({ statusCode: 409, statusMessage: 'Cette date n\'est plus disponible' })
  }

  // Enregistrer la réservation
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({ name, phone, email, address, date, status: 'pending' })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors de l\'enregistrement' })
  }

  const siteUrl = process.env.SITE_URL ?? ''
  const dateFormatted = new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  // Notifications en parallèle (non bloquantes)
  const adminEmail = process.env.ADMIN_EMAIL!
  await Promise.allSettled([
    sendEmail({ to: email, ...emailConfirmationClient(name, dateFormatted) }),
    sendEmail({ to: adminEmail, ...emailNotificationAdmin({ name, phone, email, address, date: dateFormatted }) }),
    sendSms({ to: phone, body: smsConfirmationClient(name, dateFormatted) }),
  ])

  return { ok: true, id: booking.id }
})
