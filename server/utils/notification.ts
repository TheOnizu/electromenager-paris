import { Resend } from 'resend'
import twilio from 'twilio'

export function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export function getTwilio() {
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const resend = getResend()
  const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@example.fr'
  return resend.emails.send({ from, to, subject, html })
}

export async function sendSms({ to, body }: { to: string; body: string }) {
  const client = getTwilio()
  return client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body,
  })
}

// --- Email templates ---

export function emailConfirmationClient(name: string, date: string) {
  return {
    subject: 'Confirmation de votre rendez-vous',
    html: `
      <h2>Bonjour ${name},</h2>
      <p>Votre demande d'intervention a bien été enregistrée pour le <strong>${date}</strong>.</p>
      <p>Vous serez contacté pour confirmer l'heure exacte.</p>
      <p>Merci de votre confiance.</p>
    `,
  }
}

export function emailNotificationAdmin(booking: {
  name: string
  phone: string
  email: string
  address: string
  date: string
}) {
  return {
    subject: `Nouvelle réservation — ${booking.name} — ${booking.date}`,
    html: `
      <h2>Nouvelle réservation reçue</h2>
      <ul>
        <li><strong>Nom :</strong> ${booking.name}</li>
        <li><strong>Téléphone :</strong> ${booking.phone}</li>
        <li><strong>Email :</strong> ${booking.email}</li>
        <li><strong>Adresse :</strong> ${booking.address}</li>
        <li><strong>Date souhaitée :</strong> ${booking.date}</li>
      </ul>
    `,
  }
}

export function emailReviewRequest(name: string, siteUrl: string) {
  return {
    subject: 'Comment s\'est passée votre intervention ?',
    html: `
      <h2>Bonjour ${name},</h2>
      <p>Merci d'avoir fait appel à nos services.</p>
      <p>Votre avis nous aide à améliorer notre service et à aider d'autres clients.</p>
      <p><a href="${siteUrl}/avis">Laisser un avis</a></p>
    `,
  }
}

export function smsConfirmationClient(name: string, date: string) {
  return `Bonjour ${name}, votre demande d'intervention du ${date} a bien été enregistrée. Nous vous contacterons pour confirmer l'heure.`
}

export function smsReviewRequest(siteUrl: string) {
  return `Comment s'est passée votre intervention ? Laissez-nous un avis : ${siteUrl}/avis`
}
