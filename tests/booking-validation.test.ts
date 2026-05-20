import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Réplique du schéma de validation du formulaire client (server/api/bookings/index.post.ts)
const bookingSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  address: z.string().min(5),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cgv_accepted: z.literal(true),
})

describe('Validation formulaire réservation', () => {
  const valid = {
    name: 'Jean Dupont',
    phone: '0612345678',
    email: 'jean@exemple.fr',
    address: '12 rue de la Paix, 75001 Paris',
    date: '2026-06-15',
    cgv_accepted: true as const,
  }

  it('accepte une réservation valide', () => {
    expect(bookingSchema.safeParse(valid).success).toBe(true)
  })

  it('rejette un nom trop court', () => {
    expect(bookingSchema.safeParse({ ...valid, name: 'J' }).success).toBe(false)
  })

  it('rejette un email invalide', () => {
    expect(bookingSchema.safeParse({ ...valid, email: 'pas-un-email' }).success).toBe(false)
  })

  it('rejette un téléphone trop court', () => {
    expect(bookingSchema.safeParse({ ...valid, phone: '0612' }).success).toBe(false)
  })

  it('rejette une date au mauvais format', () => {
    expect(bookingSchema.safeParse({ ...valid, date: '15/06/2026' }).success).toBe(false)
  })

  it('rejette si CGV non acceptées', () => {
    expect(bookingSchema.safeParse({ ...valid, cgv_accepted: false as any }).success).toBe(false)
  })

  it('rejette une adresse trop courte', () => {
    expect(bookingSchema.safeParse({ ...valid, address: '12' }).success).toBe(false)
  })
})
