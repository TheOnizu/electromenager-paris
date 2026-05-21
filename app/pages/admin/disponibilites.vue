<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: blockedDates, refresh } = await useFetch<{ date: string; is_available: boolean }[]>(
  '/api/availability',
)

// ── Section 1 : Plage de dates ─────────────────────────────────────────────
const rangeFrom = ref('')
const rangeTo = ref('')
const rangeLoading = ref(false)
const rangeSuccess = ref('')

async function blockRange() {
  if (!rangeFrom.value || !rangeTo.value) return
  rangeLoading.value = true
  rangeSuccess.value = ''
  try {
    const { count } = await $fetch<{ ok: boolean; count: number }>('/api/availability/block', {
      method: 'POST',
      body: { type: 'range', from: rangeFrom.value, to: rangeTo.value },
    })
    rangeSuccess.value = `${count} jour(s) bloqué(s).`
    rangeFrom.value = ''
    rangeTo.value = ''
    await refresh()
  }
  finally {
    rangeLoading.value = false
  }
}

// ── Section 2 : Jours de la semaine ───────────────────────────────────────
const WEEKDAYS = [
  { label: 'Lundi', value: 1 },
  { label: 'Mardi', value: 2 },
  { label: 'Mercredi', value: 3 },
  { label: 'Jeudi', value: 4 },
  { label: 'Vendredi', value: 5 },
  { label: 'Samedi', value: 6 },
  { label: 'Dimanche', value: 0 },
]
const selectedWeekdays = ref<number[]>([])
const weekdayHorizon = ref(90)
const weekdayLoading = ref(false)
const weekdaySuccess = ref('')

async function blockWeekdays() {
  if (selectedWeekdays.value.length === 0) return
  weekdayLoading.value = true
  weekdaySuccess.value = ''
  try {
    const { count } = await $fetch<{ ok: boolean; count: number }>('/api/availability/block', {
      method: 'POST',
      body: { type: 'weekdays', weekdays: selectedWeekdays.value, horizon: weekdayHorizon.value },
    })
    weekdaySuccess.value = `${count} jour(s) bloqué(s).`
    selectedWeekdays.value = []
    await refresh()
  }
  finally {
    weekdayLoading.value = false
  }
}

// ── Section 3 : Dates actuellement bloquées ────────────────────────────────
const unavailable = computed(() =>
  (blockedDates.value ?? [])
    .filter(d => !d.is_available)
    .map(d => d.date)
    .sort(),
)

const unlockLoading = ref(false)

async function unblockAll() {
  if (!unavailable.value.length) return
  unlockLoading.value = true
  try {
    await $fetch('/api/availability/unblock', {
      method: 'POST',
      body: { dates: unavailable.value },
    })
    await refresh()
  }
  finally {
    unlockLoading.value = false
  }
}

async function unblockOne(date: string) {
  await $fetch('/api/availability/unblock', {
    method: 'POST',
    body: { dates: [date] },
  })
  await refresh()
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// grouper les jours bloqués en plages continues pour l'affichage
const blockedRanges = computed(() => {
  const dates = unavailable.value
  if (!dates.length) return []
  const ranges: { from: string; to: string }[] = []
  let start = dates[0]
  let prev = dates[0]

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(prev + 'T00:00:00')
    prevDate.setDate(prevDate.getDate() + 1)
    const expectedNext = prevDate.toLocaleDateString('sv-SE') // YYYY-MM-DD
    if (dates[i] === expectedNext) {
      prev = dates[i]
    }
    else {
      ranges.push({ from: start, to: prev })
      start = dates[i]
      prev = dates[i]
    }
  }
  ranges.push({ from: start, to: prev })
  return ranges
})
</script>

<template>
  <div>
    <header class="h-16 flex items-center px-8 border-b border-slate-800">
      <h1 class="text-lg font-semibold text-slate-100">Disponibilités</h1>
    </header>

    <main class="p-8 space-y-8 max-w-2xl">

      <!-- Section 1 : Plage de dates -->
      <section class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 class="font-semibold text-slate-100">Bloquer une période</h2>
        <p class="text-sm text-slate-400">Marquer toutes les dates d'une plage comme indisponibles (ex : vacances).</p>
        <div class="flex flex-col sm:flex-row gap-3 items-end">
          <div class="flex-1 space-y-1">
            <label class="text-xs text-slate-400">Du</label>
            <input
              v-model="rangeFrom"
              type="date"
              class="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
          </div>
          <div class="flex-1 space-y-1">
            <label class="text-xs text-slate-400">Au</label>
            <input
              v-model="rangeTo"
              type="date"
              :min="rangeFrom"
              class="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
          </div>
          <Button
            class="bg-orange-500 hover:bg-orange-600 text-white shrink-0"
            :disabled="!rangeFrom || !rangeTo || rangeLoading"
            @click="blockRange"
          >
            {{ rangeLoading ? 'En cours…' : 'Bloquer' }}
          </Button>
        </div>
        <p v-if="rangeSuccess" class="text-sm text-green-400">{{ rangeSuccess }}</p>
      </section>

      <!-- Section 2 : Jours de la semaine récurrents -->
      <section class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 class="font-semibold text-slate-100">Jours de fermeture récurrents</h2>
        <p class="text-sm text-slate-400">Bloquer certains jours de la semaine sur les prochains mois.</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="day in WEEKDAYS"
            :key="day.value"
            class="px-3 py-1.5 rounded-md text-sm font-medium border transition-colors"
            :class="selectedWeekdays.includes(day.value)
              ? 'bg-orange-500/20 border-orange-500/60 text-orange-300'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'"
            @click="selectedWeekdays.includes(day.value)
              ? selectedWeekdays.splice(selectedWeekdays.indexOf(day.value), 1)
              : selectedWeekdays.push(day.value)"
          >
            {{ day.label }}
          </button>
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs text-slate-400 whitespace-nowrap">Sur les</label>
          <select
            v-model="weekdayHorizon"
            class="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option :value="30">30 prochains jours</option>
            <option :value="60">60 prochains jours</option>
            <option :value="90">90 prochains jours</option>
            <option :value="180">6 prochains mois</option>
          </select>
          <Button
            class="bg-orange-500 hover:bg-orange-600 text-white"
            :disabled="selectedWeekdays.length === 0 || weekdayLoading"
            @click="blockWeekdays"
          >
            {{ weekdayLoading ? 'En cours…' : 'Appliquer' }}
          </Button>
        </div>
        <p v-if="weekdaySuccess" class="text-sm text-green-400">{{ weekdaySuccess }}</p>
      </section>

      <!-- Section 3 : Dates bloquées -->
      <section class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-slate-100">
            Périodes bloquées
            <span v-if="unavailable.length" class="ml-2 text-xs font-normal text-slate-400">
              ({{ unavailable.length }} jour{{ unavailable.length > 1 ? 's' : '' }})
            </span>
          </h2>
          <button
            v-if="unavailable.length"
            class="text-xs text-red-400 hover:text-red-300 transition-colors"
            :disabled="unlockLoading"
            @click="unblockAll"
          >
            Tout débloquer
          </button>
        </div>

        <div v-if="!unavailable.length" class="text-sm text-slate-500 py-4 text-center">
          Aucune date bloquée — vous êtes disponible tous les jours.
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="range in blockedRanges"
            :key="range.from"
            class="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3"
          >
            <div class="text-sm text-slate-200">
              <span v-if="range.from === range.to">
                {{ formatDate(range.from) }}
              </span>
              <span v-else>
                Du <span class="font-medium">{{ formatDate(range.from) }}</span>
                au <span class="font-medium">{{ formatDate(range.to) }}</span>
              </span>
            </div>
            <button
              class="text-xs text-slate-400 hover:text-red-400 transition-colors ml-4 shrink-0"
              @click="unavailable.filter(d => d >= range.from && d <= range.to).forEach(d => unblockOne(d))"
            >
              Débloquer
            </button>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>
