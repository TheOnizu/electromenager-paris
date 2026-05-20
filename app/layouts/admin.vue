<script setup lang="ts">
const route = useRoute()

const nav = [
  { label: 'Tableau de bord', href: '/admin', icon: 'grid' },
  { label: 'Réservations', href: '/admin/reservations', icon: 'calendar' },
  { label: 'Disponibilités', href: '/admin/disponibilites', icon: 'calendar-check' },
  { label: 'Marques', href: '/admin/marques', icon: 'tag' },
  { label: 'Prestations', href: '/admin/prestations', icon: 'wrench' },
  { label: 'Avis clients', href: '/admin/avis', icon: 'star' },
  { label: 'Paramètres', href: '/admin/parametres', icon: 'settings' },
]

const isActive = (href: string) =>
  href === '/admin' ? route.path === '/admin' : route.path.startsWith(href)

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen flex bg-slate-950 text-slate-100">
    <!-- Sidebar -->
    <aside class="w-64 flex flex-col border-r border-slate-800 shrink-0">
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-slate-800">
        <span class="font-bold text-orange-400 text-lg tracking-tight">⚙ Admin</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <NuxtLink
          v-for="item in nav"
          :key="item.href"
          :to="item.href"
          class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="isActive(item.href)
            ? 'bg-orange-500/10 text-orange-400'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'"
        >
          <span class="w-4 h-4 shrink-0 opacity-80">·</span>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-800">
        <button
          class="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          @click="logout"
        >
          <span>↩</span> Déconnexion
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <slot />
    </div>
  </div>
</template>
