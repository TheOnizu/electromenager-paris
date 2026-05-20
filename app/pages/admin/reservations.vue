<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: bookings, refresh } = await useFetch<any[]>('/api/bookings')
const completing = ref<string | null>(null)

async function markComplete(id: string) {
  completing.value = id
  await $fetch(`/api/bookings/${id}/complete`, { method: 'PATCH' })
  await refresh()
  completing.value = null
}

const statusLabel: Record<string, string> = {
  pending: 'En attente',
  completed: 'Terminé',
  cancelled: 'Annulé',
}
const statusClass: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}
</script>

<template>
  <div>
    <header class="h-16 flex items-center px-8 border-b border-slate-800">
      <h1 class="text-lg font-semibold text-slate-100">Réservations</h1>
    </header>

    <main class="p-8">
      <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow class="border-slate-800 hover:bg-transparent">
              <TableHead class="text-slate-400">Client</TableHead>
              <TableHead class="text-slate-400">Contact</TableHead>
              <TableHead class="text-slate-400">Adresse</TableHead>
              <TableHead class="text-slate-400">Date</TableHead>
              <TableHead class="text-slate-400">Statut</TableHead>
              <TableHead class="text-slate-400 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="b in bookings"
              :key="b.id"
              class="border-slate-800 hover:bg-slate-800/50"
            >
              <TableCell class="font-medium text-slate-200">{{ b.name }}</TableCell>
              <TableCell class="text-slate-400 text-sm">
                <div>{{ b.email }}</div>
                <div>{{ b.phone }}</div>
              </TableCell>
              <TableCell class="text-slate-400 text-sm max-w-48 truncate">{{ b.address }}</TableCell>
              <TableCell class="text-slate-300">{{ b.date }}</TableCell>
              <TableCell>
                <Badge variant="outline" :class="statusClass[b.status]">
                  {{ statusLabel[b.status] }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <Button
                  v-if="b.status === 'pending'"
                  size="sm"
                  variant="outline"
                  class="border-slate-700 text-slate-300 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30"
                  :disabled="completing === b.id"
                  @click="markComplete(b.id)"
                >
                  {{ completing === b.id ? '…' : '✓ Terminé' }}
                </Button>
              </TableCell>
            </TableRow>
            <TableRow v-if="!bookings?.length">
              <TableCell colspan="6" class="text-center text-slate-500 py-12">
                Aucune réservation.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </main>
  </div>
</template>
