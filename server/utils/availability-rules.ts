function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Génère toutes les dates entre `from` et `to` (incluses), format YYYY-MM-DD.
 */
export function generateDateRange(from: string, to: string): string[] {
  const result: string[] = []
  const current = new Date(from + 'T00:00:00')
  const end = new Date(to + 'T00:00:00')

  while (current <= end) {
    result.push(toDateStr(current))
    current.setDate(current.getDate() + 1)
  }

  return result
}

/**
 * Génère toutes les occurrences des jours de la semaine donnés
 * dans les `horizon` prochains jours à partir de `fromDate`.
 *
 * @param weekdays - Tableau de jours (0=Dimanche, 1=Lundi … 6=Samedi)
 * @param horizon  - Nombre de jours à couvrir
 * @param fromDate - Date de départ au format YYYY-MM-DD (défaut : aujourd'hui)
 */
export function generateWeekdayDates(
  weekdays: number[],
  horizon: number,
  fromDate?: string,
): string[] {
  if (weekdays.length === 0) return []

  const result: string[] = []
  const set = new Set(weekdays)
  const current = fromDate
    ? new Date(fromDate + 'T00:00:00')
    : new Date(toDateStr(new Date()) + 'T00:00:00')

  for (let i = 0; i < horizon; i++) {
    if (set.has(current.getDay())) {
      result.push(toDateStr(current))
    }
    current.setDate(current.getDate() + 1)
  }

  return result
}
