import { describe, it, expect } from 'vitest'

// Logique d'éligibilité du scheduler (isolée du cron handler)
function isEligibleForReviewRequest(booking: {
  status: string
  review_requested: boolean
  completed_at: string | null
}, delayDays: number): boolean {
  if (booking.status !== 'completed') return false
  if (booking.review_requested) return false
  if (!booking.completed_at) return false

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - delayDays)

  return new Date(booking.completed_at) <= cutoff
}

describe('Scheduler — éligibilité relance avis', () => {
  const baseBooking = {
    status: 'completed',
    review_requested: false,
    completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // il y a 5 jours
  }

  it('éligible si complété depuis plus de delayDays jours et non relancé', () => {
    expect(isEligibleForReviewRequest(baseBooking, 3)).toBe(true)
  })

  it('non éligible si délai pas encore écoulé', () => {
    const recent = {
      ...baseBooking,
      completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // hier
    }
    expect(isEligibleForReviewRequest(recent, 3)).toBe(false)
  })

  it('non éligible si review_requested = true', () => {
    expect(isEligibleForReviewRequest({ ...baseBooking, review_requested: true }, 3)).toBe(false)
  })

  it('non éligible si statut != completed', () => {
    expect(isEligibleForReviewRequest({ ...baseBooking, status: 'pending' }, 3)).toBe(false)
  })

  it('non éligible si completed_at est null', () => {
    expect(isEligibleForReviewRequest({ ...baseBooking, completed_at: null }, 3)).toBe(false)
  })

  it('éligible exactement au seuil (juste à la limite)', () => {
    const atThreshold = {
      ...baseBooking,
      completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 1000).toISOString(),
    }
    expect(isEligibleForReviewRequest(atThreshold, 3)).toBe(true)
  })
})
