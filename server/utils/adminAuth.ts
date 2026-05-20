import { H3Event, getCookie, createError } from 'h3'
import { verifyToken } from './jwt'

export async function requireAdmin(event: H3Event) {
  const token = getCookie(event, 'admin_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  }
  try {
    return await verifyToken(token)
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: 'Token invalide' })
  }
}
