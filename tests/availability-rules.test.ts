import { describe, it, expect } from 'vitest'
import { generateDateRange, generateWeekdayDates } from '../server/utils/availability-rules'

describe('generateDateRange', () => {
  it('retourne toutes les dates entre from et to incluses', () => {
    const result = generateDateRange('2024-01-01', '2024-01-03')
    expect(result).toEqual(['2024-01-01', '2024-01-02', '2024-01-03'])
  })

  it('retourne un seul jour si from === to', () => {
    const result = generateDateRange('2024-06-15', '2024-06-15')
    expect(result).toEqual(['2024-06-15'])
  })

  it('retourne un tableau vide si from > to', () => {
    const result = generateDateRange('2024-01-10', '2024-01-05')
    expect(result).toEqual([])
  })

  it('gère le changement de mois', () => {
    const result = generateDateRange('2024-01-30', '2024-02-02')
    expect(result).toEqual(['2024-01-30', '2024-01-31', '2024-02-01', '2024-02-02'])
  })

  it('gère le changement d\'année', () => {
    const result = generateDateRange('2023-12-31', '2024-01-02')
    expect(result).toEqual(['2023-12-31', '2024-01-01', '2024-01-02'])
  })
})

describe('generateWeekdayDates', () => {
  it('retourne toutes les occurrences d\'un jour de la semaine dans l\'horizon', () => {
    // 2024-01-01 est un lundi (jour 1) — horizon 14 = Jan 1..14
    const result = generateWeekdayDates([1], 14, '2024-01-01')
    // Lundis dans les 14 jours : 01/01 et 08/01
    expect(result).toContain('2024-01-01')
    expect(result).toContain('2024-01-08')
    expect(result.every(d => new Date(d + 'T00:00:00').getDay() === 1)).toBe(true)
  })

  it('retourne plusieurs jours de la semaine', () => {
    // Samedi=6, Dimanche=0 sur 14 jours depuis 2024-01-01 (lundi)
    const result = generateWeekdayDates([0, 6], 14, '2024-01-01')
    const weekdays = result.map(d => new Date(d + 'T00:00:00').getDay())
    expect(weekdays.every(w => w === 0 || w === 6)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('retourne un tableau vide si aucun jour sélectionné', () => {
    const result = generateWeekdayDates([], 30, '2024-01-01')
    expect(result).toEqual([])
  })

  it('les dates sont dans l\'ordre croissant', () => {
    const result = generateWeekdayDates([2, 4], 28, '2024-01-01')
    const sorted = [...result].sort()
    expect(result).toEqual(sorted)
  })

  it('ne dépasse pas l\'horizon', () => {
    const from = '2024-01-01'
    const horizon = 10
    const result = generateWeekdayDates([1], horizon, from)
    const limit = new Date('2024-01-01')
    limit.setDate(limit.getDate() + horizon - 1)
    const limitStr = limit.toISOString().split('T')[0]
    expect(result.every(d => d <= limitStr)).toBe(true)
  })
})
