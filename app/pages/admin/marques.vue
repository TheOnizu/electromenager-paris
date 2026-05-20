<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: brands, refresh } = await useFetch<any[]>('/api/brands')

const showAdd = ref(false)
const newName = ref('')
const newLogoUrl = ref('')
const adding = ref(false)
const deleting = ref<string | null>(null)

async function add() {
  if (!newName.value || !newLogoUrl.value) return
  adding.value = true
  await $fetch('/api/brands', {
    method: 'POST',
    body: { name: newName.value, logo_url: newLogoUrl.value },
  })
  newName.value = ''
  newLogoUrl.value = ''
  showAdd.value = false
  adding.value = false
  await refresh()
}

async function remove(id: string) {
  deleting.value = id
  await $fetch(`/api/brands/${id}`, { method: 'DELETE' })
  await refresh()
  deleting.value = null
}
</script>

<template>
  <div>
    <header class="h-16 flex items-center justify-between px-8 border-b border-slate-800">
      <h1 class="text-lg font-semibold text-slate-100">Marques</h1>
      <Button
        class="bg-orange-500 hover:bg-orange-600 text-white"
        size="sm"
        @click="showAdd = !showAdd"
      >
        + Ajouter une marque
      </Button>
    </header>

    <main class="p-8 space-y-6">
      <!-- Formulaire ajout -->
      <div v-if="showAdd" class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 class="font-medium text-slate-100">Nouvelle marque</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <Label class="text-slate-300">Nom de la marque</Label>
            <Input
              v-model="newName"
              placeholder="Ex: Bosch"
              class="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <div class="space-y-1.5">
            <Label class="text-slate-300">URL du logo</Label>
            <Input
              v-model="newLogoUrl"
              placeholder="https://exemple.com/logo.png"
              class="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
            />
          </div>
        </div>
        <div class="flex gap-2">
          <Button
            class="bg-orange-500 hover:bg-orange-600 text-white"
            :disabled="adding || !newName || !newLogoUrl"
            @click="add"
          >
            {{ adding ? 'Ajout…' : 'Ajouter' }}
          </Button>
          <Button variant="ghost" class="text-slate-400 hover:text-slate-200" @click="showAdd = false">
            Annuler
          </Button>
        </div>
      </div>

      <!-- Grille des marques -->
      <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="brand in brands"
          :key="brand.id"
          class="group relative bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center gap-3"
        >
          <img :src="brand.logo_url" :alt="brand.name" class="h-12 w-auto object-contain" />
          <span class="text-xs text-slate-400 font-medium text-center">{{ brand.name }}</span>
          <button
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 text-xs"
            :disabled="deleting === brand.id"
            @click="remove(brand.id)"
          >
            ✕
          </button>
        </div>

        <div
          v-if="!brands?.length"
          class="col-span-full text-center text-slate-500 py-12 text-sm"
        >
          Aucune marque ajoutée pour le moment.
        </div>
      </div>
    </main>
  </div>
</template>
