<script setup lang="ts">
useSeoMeta({
  title: 'Laisser un avis — ÉlectroMénagerParis',
  description: 'Partagez votre expérience après votre intervention. Votre avis aide d\'autres clients parisiens à choisir un technicien de confiance.',
  ogTitle: 'Laisser un avis — ÉlectroMénagerParis',
  ogDescription: 'Partagez votre expérience après votre intervention.',
  ogType: 'website',
  twitterCard: 'summary',
  robots: 'noindex',
})

const form = reactive({
  author_name: '',
  rating: 0,
  comment: '',
})
const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const success = ref(false)
const serverError = ref('')

function validate() {
  errors.value = {}
  if (!form.author_name.trim() || form.author_name.length < 2) errors.value.author_name = 'Votre prénom est requis'
  if (!form.rating) errors.value.rating = 'Veuillez choisir une note'
  if (!form.comment.trim() || form.comment.length < 10) errors.value.comment = 'Commentaire trop court (min. 10 caractères)'
  if (form.comment.length > 1000) errors.value.comment = 'Commentaire trop long (max. 1000 caractères)'
  return Object.keys(errors.value).length === 0
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  serverError.value = ''
  try {
    await $fetch('/api/reviews', {
      method: 'POST',
      body: { ...form },
    })
    success.value = true
  }
  catch {
    serverError.value = 'Une erreur est survenue. Veuillez réessayer.'
  }
  finally {
    submitting.value = false
  }
}

const hovered = ref(0)
const starLabels = ['', 'Très insatisfait', 'Insatisfait', 'Correct', 'Satisfait', 'Très satisfait']
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4">
    <div class="max-w-lg mx-auto">
      <div class="mb-8">
        <NuxtLink to="/" class="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Retour à l'accueil
        </NuxtLink>
      </div>

      <!-- Succès -->
      <div v-if="success" class="bg-white rounded-2xl border border-green-200 p-10 text-center shadow-sm">
        <div class="text-5xl mb-4">🙏</div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Merci pour votre avis !</h2>
        <p class="text-slate-500 mb-6">
          Votre témoignage sera publié après validation. Nous apprécions votre retour, il nous aide à améliorer notre service.
        </p>
        <NuxtLink
          to="/"
          class="inline-flex px-6 py-3 bg-brand-blue text-white font-medium rounded-xl text-sm"
        >
          Retour à l'accueil
        </NuxtLink>
      </div>

      <template v-else>
        <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h1 class="text-2xl font-bold text-slate-900 mb-1">Laisser un avis</h1>
          <p class="text-slate-500 text-sm mb-8">
            Votre avis sera affiché sur le site après modération.
          </p>

          <!-- Nom -->
          <div class="space-y-1.5 mb-5">
            <Label for="name">Votre prénom</Label>
            <Input
              id="name"
              v-model="form.author_name"
              placeholder="Jean"
            />
            <p v-if="errors.author_name" class="text-xs text-red-500">{{ errors.author_name }}</p>
          </div>

          <!-- Note étoiles -->
          <div class="space-y-2 mb-5">
            <Label>Note</Label>
            <div class="flex items-center gap-1">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                class="text-3xl transition-transform hover:scale-110"
                :class="n <= (hovered || form.rating) ? 'text-orange-400' : 'text-slate-300'"
                @mouseenter="hovered = n"
                @mouseleave="hovered = 0"
                @click="form.rating = n"
              >
                ★
              </button>
              <span class="ml-3 text-sm text-slate-500">
                {{ starLabels[hovered || form.rating] }}
              </span>
            </div>
            <p v-if="errors.rating" class="text-xs text-red-500">{{ errors.rating }}</p>
          </div>

          <!-- Commentaire -->
          <div class="space-y-1.5 mb-6">
            <Label for="comment">Votre commentaire</Label>
            <Textarea
              id="comment"
              v-model="form.comment"
              rows="5"
              placeholder="Décrivez votre expérience…"
            />
            <div class="flex justify-between">
              <p v-if="errors.comment" class="text-xs text-red-500">{{ errors.comment }}</p>
              <p class="text-xs text-slate-400 ml-auto">{{ form.comment.length }}/1000</p>
            </div>
          </div>

          <p v-if="serverError" class="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
            {{ serverError }}
          </p>

          <Button
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3"
            :disabled="submitting"
            @click="submit"
          >
            {{ submitting ? 'Envoi…' : 'Soumettre mon avis' }}
          </Button>

          <p class="text-xs text-slate-400 text-center mt-4">
            Votre avis sera visible après validation par notre équipe.
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
