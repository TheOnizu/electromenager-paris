<script setup lang="ts">
useSeoMeta({
  title: 'Prendre rendez-vous — Réparation électroménager Paris',
  description: 'Réservez votre intervention à domicile en ligne. Choisissez une date disponible, renseignez vos coordonnées. Confirmation immédiate par email et SMS.',
  ogTitle: 'Prendre rendez-vous — ÉlectroMénagerParis',
  ogDescription: 'Réservez votre intervention à domicile en ligne. Confirmation immédiate.',
  ogType: 'website',
  twitterCard: 'summary',
  robots: 'noindex',
})

const { data: availability } = await useFetch<{ date: string; is_available: boolean }[]>('/api/availability')
const { data: settings } = await useFetch<Record<string, string>>('/api/settings')

const cgvText = computed(() => settings.value?.cgv_text ?? '')

// ── Calendrier ──────────────────────────────────────────────────────────────
const today = new Date()
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const monthLabel = computed(() =>
  currentMonth.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
)

function prevMonth() {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() - 1)
  if (d >= new Date(today.getFullYear(), today.getMonth(), 1)) currentMonth.value = d
}
function nextMonth() {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() + 1)
  currentMonth.value = d
}

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)

  // Padding avant le 1er (lundi = 0)
  const startPad = (first.getDay() + 6) % 7
  const days: Array<{ date: string | null; available: boolean; past: boolean }> = []

  for (let i = 0; i < startPad; i++) days.push({ date: null, available: false, past: true })

  for (let d = 1; d <= last.getDate(); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const past = new Date(dateStr + 'T00:00:00') < new Date(today.toISOString().split('T')[0] + 'T00:00:00')
    const entry = availability.value?.find(a => a.date === dateStr)
    const available = !past && (entry ? entry.is_available : false)
    days.push({ date: dateStr, available, past })
  }

  return days
})

const selectedDate = ref<string | null>(null)
const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

// ── Formulaire ──────────────────────────────────────────────────────────────
const form = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  cgv_accepted: false,
})
const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const success = ref(false)
const serverError = ref('')

function validate() {
  errors.value = {}
  if (!selectedDate.value) errors.value.date = 'Veuillez choisir une date'
  if (!form.name.trim() || form.name.length < 2) errors.value.name = 'Nom requis (min. 2 caractères)'
  if (!/^[\d\s+()-]{10,}$/.test(form.phone)) errors.value.phone = 'Numéro de téléphone invalide'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.value.email = 'Adresse email invalide'
  if (!form.address.trim() || form.address.length < 5) errors.value.address = 'Adresse requise'
  if (!form.cgv_accepted) errors.value.cgv = 'Vous devez accepter les conditions générales'
  return Object.keys(errors.value).length === 0
}

const showCgv = ref(false)

async function submit() {
  if (!validate()) return
  submitting.value = true
  serverError.value = ''
  try {
    await $fetch('/api/bookings', {
      method: 'POST',
      body: { ...form, date: selectedDate.value, cgv_accepted: true },
    })
    success.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  catch (e: any) {
    serverError.value = e?.data?.statusMessage ?? 'Une erreur est survenue. Veuillez réessayer.'
  }
  finally {
    submitting.value = false
  }
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4">
    <div class="max-w-2xl mx-auto">

      <!-- Succès -->
      <div v-if="success" class="bg-white rounded-2xl border border-green-200 p-10 text-center shadow-sm">
        <div class="text-5xl mb-4">✅</div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Demande enregistrée !</h2>
        <p class="text-slate-500 mb-6">
          Votre demande pour le <strong>{{ formatDate(selectedDate!) }}</strong> a bien été reçue.
          Un email de confirmation vous a été envoyé. Nous vous contacterons pour confirmer l'heure exacte.
        </p>
        <NuxtLink
          to="/"
          class="inline-flex px-6 py-3 bg-brand-blue text-white font-medium rounded-xl text-sm"
        >
          Retour à l'accueil
        </NuxtLink>
      </div>

      <template v-else>
        <div class="mb-8">
          <NuxtLink to="/" class="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Retour
          </NuxtLink>
          <h1 class="text-2xl font-bold text-slate-900 mt-4">Prendre rendez-vous</h1>
          <p class="text-slate-500 mt-1">Choisissez une date disponible et renseignez vos informations.</p>
        </div>

        <!-- Calendrier -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <button
              class="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 disabled:opacity-30"
              @click="prevMonth"
            >
              ←
            </button>
            <h2 class="font-semibold text-slate-900 capitalize">{{ monthLabel }}</h2>
            <button
              class="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
              @click="nextMonth"
            >
              →
            </button>
          </div>

          <!-- Jours de la semaine -->
          <div class="grid grid-cols-7 mb-2">
            <div v-for="d in dayNames" :key="d" class="text-center text-xs font-medium text-slate-400 py-2">
              {{ d }}
            </div>
          </div>

          <!-- Cases du calendrier -->
          <div class="grid grid-cols-7 gap-1">
            <div v-for="(day, i) in calendarDays" :key="i" class="aspect-square">
              <button
                v-if="day.date"
                class="w-full h-full flex items-center justify-center rounded-lg text-sm font-medium transition-all"
                :class="{
                  'bg-orange-500 text-white shadow-md': selectedDate === day.date,
                  'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200': day.available && selectedDate !== day.date,
                  'text-slate-300 cursor-not-allowed': !day.available,
                }"
                :disabled="!day.available"
                @click="selectedDate = day.date"
              >
                {{ parseInt(day.date.split('-')[2]) }}
              </button>
            </div>
          </div>

          <!-- Légende -->
          <div class="flex items-center gap-5 mt-4 text-xs text-slate-500">
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded bg-green-100 border border-green-200 inline-block" />
              Disponible
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded bg-orange-500 inline-block" />
              Sélectionné
            </span>
          </div>

          <p v-if="selectedDate" class="mt-4 text-sm font-medium text-orange-600">
            ✓ {{ formatDate(selectedDate) }}
          </p>
          <p v-if="errors.date" class="mt-2 text-xs text-red-500">{{ errors.date }}</p>
        </div>

        <!-- Formulaire client -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h2 class="font-semibold text-slate-900">Vos informations</h2>

          <div class="space-y-1.5">
            <Label for="name">Nom complet</Label>
            <Input id="name" v-model="form.name" placeholder="Jean Dupont" />
            <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <Label for="phone">Téléphone</Label>
              <Input id="phone" v-model="form.phone" type="tel" placeholder="06 12 34 56 78" />
              <p v-if="errors.phone" class="text-xs text-red-500">{{ errors.phone }}</p>
            </div>
            <div class="space-y-1.5">
              <Label for="email">Email</Label>
              <Input id="email" v-model="form.email" type="email" placeholder="jean@exemple.fr" />
              <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
            </div>
          </div>

          <div class="space-y-1.5">
            <Label for="address">Adresse complète</Label>
            <Input id="address" v-model="form.address" placeholder="12 rue de la Paix, 75001 Paris" />
            <p v-if="errors.address" class="text-xs text-red-500">{{ errors.address }}</p>
          </div>

          <!-- CGV -->
          <div class="pt-2 border-t border-slate-100 space-y-3">
            <div class="flex items-start gap-3">
              <Checkbox
                id="cgv"
                :checked="form.cgv_accepted"
                @update:checked="form.cgv_accepted = $event"
              />
              <div class="flex-1">
                <label for="cgv" class="text-sm text-slate-700 cursor-pointer leading-snug">
                  J'accepte les
                  <button
                    class="text-orange-500 hover:underline font-medium"
                    type="button"
                    @click="showCgv = true"
                  >
                    conditions générales de service
                  </button>
                </label>
                <p v-if="errors.cgv" class="text-xs text-red-500 mt-1">{{ errors.cgv }}</p>
              </div>
            </div>
          </div>

          <p v-if="serverError" class="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3">
            {{ serverError }}
          </p>

          <Button
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3"
            :disabled="submitting"
            @click="submit"
          >
            {{ submitting ? 'Envoi en cours…' : 'Valider ma demande de rendez-vous' }}
          </Button>
        </div>
      </template>
    </div>

    <!-- Modal CGV -->
    <Dialog :open="showCgv" @update:open="showCgv = $event">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>Conditions générales de service</DialogTitle>
        </DialogHeader>
        <div class="text-sm text-slate-600 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto py-2">
          {{ cgvText || 'Conditions générales en cours de chargement…' }}
        </div>
        <DialogFooter>
          <Button
            class="bg-orange-500 hover:bg-orange-600 text-white"
            @click="form.cgv_accepted = true; showCgv = false"
          >
            J'accepte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
