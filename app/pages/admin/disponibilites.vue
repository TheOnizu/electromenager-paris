<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: availability, refresh } = await useFetch<{ date: string; is_available: boolean }[]>('/api/availability')

// Construire les 60 prochains jours
const today = new Date()
const days = Array.from({ length: 60 }, (_, i) => {
  const d = new Date(today)
  d.setDate(today.getDate() + i)
  return d.toISOString().split('T')[0]
})

function isAvailable(date: string) {
  const entry = availability.value?.find(a => a.date === date)
  // Par défaut disponible si pas d'entrée
  return entry ? entry.is_available : true
}

const toggling = ref<string | null>(null)

async function toggle(date: string) {
  toggling.value = date
  await $fetch('/api/availability', {
    method: 'PUT',
    body: { date, is_available: !isAvailable(date) },
  })
  await refresh()
  toggling.value = null
}

const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

function dayLabel(date: string) {
  const d = new Date(date + 'T00:00:00')
  return dayLabels[d.getDay()]
}
function dayNumber(date: string) {
  return new Date(date + 'T00:00:00').getDate()
}
function monthLabel(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

// Grouper par mois
const byMonth = computed(() => {
  const map = new Map<string, string[]>()
  for (const d of days) {
    const month = d.slice(0, 7)
    if (!map.has(month)) map.set(month, [])
    map.get(month)!.push(d)
  }
  return map
})
</script>

<template>
  <div>
    <header class="h-16 flex items-center px-8 border-b border-slate-800 gap-4">
      <h1 class="text-lg font-semibold text-slate-100">Disponibilités</h1>
      <span class="text-sm text-slate-400">Cliquez sur un jour pour le rendre disponible / indisponible</span>
    </header>

    <main class="p-8 space-y-8">
      <div v-for="[month, dates] in byMonth" :key="month">
        <h2 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 capitalize">
          {{ monthLabel(dates[0]) }}
        </h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="date in dates"
            :key="date"
            class="w-14 h-14 flex flex-col items-center justify-center rounded-lg border text-sm font-medium transition-all"
            :class="isAvailable(date)
              ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
              : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'"
            :disabled="toggling === date"
            @click="toggle(date)"
          >
            <span class="text-xs opacity-70">{{ dayLabel(date) }}</span>
            <span class="text-base leading-tight">{{ dayNumber(date) }}</span>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-6 text-sm text-slate-400">
        <span class="flex items-center gap-2">
          <span class="w-4 h-4 rounded bg-green-500/20 border border-green-500/30 inline-block" />
          Disponible
        </span>
        <span class="flex items-center gap-2">
          <span class="w-4 h-4 rounded bg-slate-800 border border-slate-700 inline-block" />
          Indisponible
        </span>
      </div>
    </main>
  </div>
</template>
