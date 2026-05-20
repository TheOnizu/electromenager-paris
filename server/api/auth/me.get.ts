import { requireAdmin } from '../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  const payload = await requireAdmin(event)
  return { email: payload.email }
})
