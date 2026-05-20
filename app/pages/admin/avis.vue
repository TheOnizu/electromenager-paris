<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: pending, refresh } = await useFetch<any[]>('/api/reviews?pending=1')
const moderating = ref<string | null>(null)

async function moderate(id: string, status: 'published' | 'rejected') {
  moderating.value = id
  await $fetch(`/api/reviews/${id}/moderate`, {
    method: 'PATCH',
    body: { status },
  })
  await refresh()
  moderating.value = null
}

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)
</script>

<template>
  <div>
    <header class="h-16 flex items-center px-8 border-b border-slate-800 gap-3">
      <h1 class="text-lg font-semibold text-slate-100">Avis clients</h1>
      <Badge
        v-if="pending?.length"
        class="bg-orange-500/10 text-orange-400 border-orange-500/20"
        variant="outline"
      >
        {{ pending.length }} en attente
      </Badge>
    </header>

    <main class="p-8">
      <div v-if="pending?.length" class="space-y-4">
        <div
          v-for="review in pending"
          :key="review.id"
          class="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="font-medium text-slate-200">{{ review.author_name }}</span>
                <span class="text-orange-400 text-sm">{{ stars(review.rating) }}</span>
                <span class="text-xs text-slate-500">
                  {{ new Date(review.created_at).toLocaleDateString('fr-FR') }}
                </span>
              </div>
              <p class="text-slate-300 text-sm leading-relaxed">{{ review.comment }}</p>
            </div>

            <div class="flex gap-2 shrink-0">
              <Button
                size="sm"
                class="bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30"
                variant="outline"
                :disabled="moderating === review.id"
                @click="moderate(review.id, 'published')"
              >
                ✓ Publier
              </Button>
              <Button
                size="sm"
                class="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                variant="outline"
                :disabled="moderating === review.id"
                @click="moderate(review.id, 'rejected')"
              >
                ✕ Rejeter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="bg-slate-900 border border-slate-800 rounded-xl p-16 text-center text-slate-500"
      >
        <p class="text-4xl mb-3">✓</p>
        <p class="font-medium text-slate-400">Aucun avis en attente</p>
        <p class="text-sm mt-1">Tous les avis ont été traités.</p>
      </div>
    </main>
  </div>
</template>
