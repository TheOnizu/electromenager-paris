<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; statusMessage?: string } }>()
const is404 = computed(() => props.error.statusCode === 404)
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <p class="text-7xl font-bold text-slate-200 mb-4">{{ error.statusCode }}</p>
      <h1 class="text-2xl font-bold text-slate-900 mb-3">
        {{ is404 ? 'Page introuvable' : 'Une erreur est survenue' }}
      </h1>
      <p class="text-slate-500 mb-8">
        {{ is404
          ? 'La page que vous cherchez n\'existe pas ou a été déplacée.'
          : 'Quelque chose s\'est mal passé. Veuillez réessayer.' }}
      </p>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-900 text-white font-medium rounded-xl transition-colors text-sm"
      >
        ← Retour à l'accueil
      </NuxtLink>
    </div>
  </div>
</template>
