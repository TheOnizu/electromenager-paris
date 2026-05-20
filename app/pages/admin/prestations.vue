<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: services, refresh } = await useFetch<any[]>('/api/services')

const showAdd = ref(false)
const form = reactive({ name: '', description: '', icon: 'wrench' })
const adding = ref(false)
const deleting = ref<string | null>(null)

const icons = ['wrench', 'zap', 'wind', 'thermometer', 'droplets', 'flame', 'settings']

async function add() {
  adding.value = true
  await $fetch('/api/services', {
    method: 'POST',
    body: { ...form },
  })
  Object.assign(form, { name: '', description: '', icon: 'wrench' })
  showAdd.value = false
  adding.value = false
  await refresh()
}

async function remove(id: string) {
  deleting.value = id
  await $fetch(`/api/services/${id}`, { method: 'DELETE' })
  await refresh()
  deleting.value = null
}
</script>

<template>
  <div>
    <header class="h-16 flex items-center justify-between px-8 border-b border-slate-800">
      <h1 class="text-lg font-semibold text-slate-100">Prestations</h1>
      <Button
        class="bg-orange-500 hover:bg-orange-600 text-white"
        size="sm"
        @click="showAdd = !showAdd"
      >
        + Ajouter une prestation
      </Button>
    </header>

    <main class="p-8 space-y-6">
      <!-- Formulaire ajout -->
      <div v-if="showAdd" class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 class="font-medium text-slate-100">Nouvelle prestation</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <Label class="text-slate-300">Nom</Label>
            <Input
              v-model="form.name"
              placeholder="Ex: Lave-linge"
              class="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <div class="space-y-1.5">
            <Label class="text-slate-300">Icône</Label>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="icon in icons"
                :key="icon"
                class="px-2 py-1 rounded text-xs border transition-colors"
                :class="form.icon === icon
                  ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'"
                @click="form.icon = icon"
              >
                {{ icon }}
              </button>
            </div>
          </div>
        </div>
        <div class="space-y-1.5">
          <Label class="text-slate-300">Description</Label>
          <Textarea
            v-model="form.description"
            rows="3"
            placeholder="Décrivez la prestation…"
            class="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
          />
        </div>
        <div class="flex gap-2">
          <Button
            class="bg-orange-500 hover:bg-orange-600 text-white"
            :disabled="adding || !form.name || !form.description"
            @click="add"
          >
            {{ adding ? 'Ajout…' : 'Ajouter' }}
          </Button>
          <Button variant="ghost" class="text-slate-400 hover:text-slate-200" @click="showAdd = false">
            Annuler
          </Button>
        </div>
      </div>

      <!-- Liste -->
      <div class="space-y-3">
        <div
          v-for="service in services"
          :key="service.id"
          class="group bg-slate-900 border border-slate-800 rounded-xl px-6 py-4 flex items-center justify-between"
        >
          <div>
            <p class="font-medium text-slate-200">{{ service.name }}</p>
            <p class="text-sm text-slate-400 mt-0.5">{{ service.description }}</p>
          </div>
          <button
            class="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 text-sm ml-4"
            :disabled="deleting === service.id"
            @click="remove(service.id)"
          >
            Supprimer
          </button>
        </div>
        <div v-if="!services?.length" class="text-center text-slate-500 py-12 text-sm">
          Aucune prestation ajoutée.
        </div>
      </div>
    </main>
  </div>
</template>
