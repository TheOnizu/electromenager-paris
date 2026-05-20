<script setup lang="ts">
definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    navigateTo('/admin')
  }
  catch {
    error.value = 'Email ou mot de passe incorrect.'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950">
    <div class="w-full max-w-sm p-8 bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
      <div class="mb-8 text-center">
        <span class="text-3xl">⚙</span>
        <h1 class="mt-2 text-xl font-bold text-slate-100">Administration</h1>
        <p class="text-sm text-slate-400 mt-1">Connectez-vous pour accéder au tableau de bord</p>
      </div>

      <form class="space-y-4" @submit.prevent="submit">
        <div class="space-y-1.5">
          <Label for="email" class="text-slate-300">Email</Label>
          <Input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="admin@exemple.fr"
            class="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
          />
        </div>

        <div class="space-y-1.5">
          <Label for="password" class="text-slate-300">Mot de passe</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••"
            class="bg-slate-800 border-slate-700 text-slate-100"
          />
        </div>

        <p v-if="error" class="text-sm text-red-400 text-center">{{ error }}</p>

        <Button
          type="submit"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white"
          :disabled="loading"
        >
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </Button>
      </form>
    </div>
  </div>
</template>
