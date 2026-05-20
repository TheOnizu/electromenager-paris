<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: settings } = await useFetch<Record<string, string>>('/api/settings')

const cgv = ref(settings.value?.cgv_text ?? '')
const delay = ref(settings.value?.review_delay_days ?? '3')
const channel = ref(settings.value?.review_channel ?? 'both')

const saving = ref(false)
const saved = ref(false)

async function save() {
  saving.value = true
  await $fetch('/api/settings', {
    method: 'PUT',
    body: {
      cgv_text: cgv.value,
      review_delay_days: delay.value,
      review_channel: channel.value,
    },
  })
  saving.value = false
  saved.value = true
  setTimeout(() => saved.value = false, 3000)
}
</script>

<template>
  <div>
    <header class="h-16 flex items-center px-8 border-b border-slate-800">
      <h1 class="text-lg font-semibold text-slate-100">Paramètres</h1>
    </header>

    <main class="p-8 max-w-2xl space-y-8">
      <!-- CGV -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 class="font-medium text-slate-100">Conditions Générales de Vente</h2>
        <p class="text-sm text-slate-400">Ce texte est affiché sur le formulaire de réservation. Le client doit l'accepter avant de valider.</p>
        <Textarea
          v-model="cgv"
          rows="6"
          placeholder="Entrez vos conditions générales de vente…"
          class="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
        />
      </div>

      <!-- Relance avis -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 class="font-medium text-slate-100">Relance avis post-intervention</h2>

        <div class="space-y-2">
          <Label class="text-slate-300">Délai (en jours après l'intervention)</Label>
          <Input
            v-model="delay"
            type="number"
            min="1"
            max="30"
            class="w-32 bg-slate-800 border-slate-700 text-slate-100"
          />
        </div>

        <div class="space-y-2">
          <Label class="text-slate-300">Canal de notification</Label>
          <div class="flex gap-4">
            <label
              v-for="opt in [{ value: 'email', label: 'Email uniquement' }, { value: 'sms', label: 'SMS uniquement' }, { value: 'both', label: 'Email + SMS' }]"
              :key="opt.value"
              class="flex items-center gap-2 cursor-pointer text-sm text-slate-300"
            >
              <input
                v-model="channel"
                type="radio"
                :value="opt.value"
                class="accent-orange-500"
              />
              {{ opt.label }}
            </label>
          </div>
        </div>
      </div>

      <!-- Save -->
      <div class="flex items-center gap-4">
        <Button
          class="bg-orange-500 hover:bg-orange-600 text-white"
          :disabled="saving"
          @click="save"
        >
          {{ saving ? 'Enregistrement…' : 'Enregistrer les modifications' }}
        </Button>
        <span v-if="saved" class="text-sm text-green-400">✓ Enregistré</span>
      </div>
    </main>
  </div>
</template>
