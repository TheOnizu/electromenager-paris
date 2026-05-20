<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: bookings } = await useFetch('/api/bookings')
const { data: reviews } = await useFetch('/api/reviews?pending=1')

const stats = computed(() => [
  {
    label: 'Réservations totales',
    value: (bookings.value as any[])?.length ?? 0,
    sub: 'depuis le début',
    color: 'text-blue-400',
  },
  {
    label: 'Avis en attente',
    value: (reviews.value as any[])?.length ?? 0,
    sub: 'à modérer',
    color: 'text-orange-400',
  },
  {
    label: 'Interventions terminées',
    value: (bookings.value as any[])?.filter((b: any) => b.status === 'completed').length ?? 0,
    sub: 'au total',
    color: 'text-green-400',
  },
  {
    label: 'En attente',
    value: (bookings.value as any[])?.filter((b: any) => b.status === 'pending').length ?? 0,
    sub: 'à planifier',
    color: 'text-yellow-400',
  },
])

const recent = computed(() =>
  ((bookings.value as any[]) ?? []).slice(0, 5)
)
</script>

<template>
  <div>
    <header class="h-16 flex items-center px-8 border-b border-slate-800">
      <h1 class="text-lg font-semibold text-slate-100">Tableau de bord</h1>
    </header>

    <main class="p-8 space-y-8">
      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-slate-900 border border-slate-800 rounded-xl p-5"
        >
          <p class="text-sm text-slate-400">{{ stat.label }}</p>
          <p class="text-3xl font-bold mt-1" :class="stat.color">{{ stat.value }}</p>
          <p class="text-xs text-slate-500 mt-1">{{ stat.sub }}</p>
        </div>
      </div>

      <!-- Dernières réservations -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl">
        <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 class="font-medium text-slate-100">Dernières réservations</h2>
          <NuxtLink to="/admin/reservations" class="text-xs text-orange-400 hover:underline">
            Tout voir →
          </NuxtLink>
        </div>
        <div class="divide-y divide-slate-800">
          <div
            v-for="booking in recent"
            :key="booking.id"
            class="px-6 py-4 flex items-center justify-between"
          >
            <div>
              <p class="text-sm font-medium text-slate-200">{{ booking.name }}</p>
              <p class="text-xs text-slate-400">{{ booking.date }} · {{ booking.phone }}</p>
            </div>
            <Badge
              :class="{
                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20': booking.status === 'pending',
                'bg-green-500/10 text-green-400 border-green-500/20': booking.status === 'completed',
                'bg-red-500/10 text-red-400 border-red-500/20': booking.status === 'cancelled',
              }"
              variant="outline"
            >
              {{ booking.status === 'pending' ? 'En attente' : booking.status === 'completed' ? 'Terminé' : 'Annulé' }}
            </Badge>
          </div>
          <div v-if="!recent.length" class="px-6 py-8 text-center text-slate-500 text-sm">
            Aucune réservation pour le moment.
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
