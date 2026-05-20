import { readBody, setCookie } from 'h3'
import bcrypt from 'bcryptjs'
import { signToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  const adminEmail = process.env.ADMIN_EMAIL
  const adminHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminEmail || !adminHash) {
    throw createError({ statusCode: 500, statusMessage: 'Configuration admin manquante' })
  }

  const emailMatch = email === adminEmail
  const passwordMatch = await bcrypt.compare(password, adminHash)

  if (!emailMatch || !passwordMatch) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants incorrects' })
  }

  const token = await signToken({ role: 'admin', email })

  setCookie(event, 'admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
  })

  return { ok: true }
})
