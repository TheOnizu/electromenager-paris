<script setup lang="ts">
const mobileOpen = ref(false)

const links = [
  { label: 'Prestations', href: '#prestations' },
  { label: 'Marques', href: '#marques' },
  { label: 'Avis', href: '#avis' },
  { label: 'FAQ', href: '#faq' },
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-900">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-brand-blue">
          <span class="text-orange-500 text-xl">⚙</span>
          <span class="text-lg tracking-tight">ÉlectroMénager<span class="text-orange-500">Paris</span></span>
        </NuxtLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-6">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            {{ link.label }}
          </a>
        </nav>

        <div class="flex items-center gap-3">
          <NuxtLink
            to="/reservation"
            class="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Prendre rendez-vous
          </NuxtLink>
          <!-- Mobile burger -->
          <button
            class="md:hidden p-2 text-slate-600"
            @click="mobileOpen = !mobileOpen"
          >
            <span v-if="!mobileOpen">☰</span>
            <span v-else>✕</span>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileOpen" class="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="block text-sm font-medium text-slate-700 py-2"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </a>
        <NuxtLink
          to="/reservation"
          class="block w-full text-center px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg"
          @click="mobileOpen = false"
        >
          Prendre rendez-vous
        </NuxtLink>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400 py-12">
      <div class="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <p class="font-bold text-white text-lg mb-2">
            ⚙ ÉlectroMénager<span class="text-orange-400">Paris</span>
          </p>
          <p class="text-sm leading-relaxed">
            Technicien indépendant spécialisé dans la réparation d'appareils électroménagers à domicile à Paris.
          </p>
        </div>
        <div>
          <p class="font-semibold text-white mb-3">Liens rapides</p>
          <ul class="space-y-2 text-sm">
            <li><a href="#prestations" class="hover:text-white transition-colors">Nos prestations</a></li>
            <li><a href="#marques" class="hover:text-white transition-colors">Marques prises en charge</a></li>
            <li><a href="#avis" class="hover:text-white transition-colors">Avis clients</a></li>
            <li><NuxtLink to="/reservation" class="hover:text-white transition-colors">Réserver une intervention</NuxtLink></li>
          </ul>
        </div>
        <div>
          <p class="font-semibold text-white mb-3">Zone d'intervention</p>
          <p class="text-sm">Paris (75) — Tous arrondissements</p>
          <p class="text-sm mt-2">Du lundi au samedi</p>
          <NuxtLink
            to="/reservation"
            class="inline-block mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Prendre rendez-vous
          </NuxtLink>
        </div>
      </div>
      <div class="max-w-6xl mx-auto px-4 mt-10 pt-6 border-t border-slate-800 text-xs text-slate-500">
        © {{ new Date().getFullYear() }} ÉlectroMénagerParis · Paris, France
      </div>
    </footer>
  </div>
</template>
