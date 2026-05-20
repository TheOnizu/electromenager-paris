<script setup lang="ts">
useSeoMeta({
  title: 'Réparation électroménager Paris — Intervention à domicile',
  description: 'Technicien indépendant à Paris. Réparation lave-linge, frigo, four, lave-vaisselle. Intervention sous 24–48h, devis sur place, toutes marques.',
  ogTitle: 'Réparation électroménager Paris — Intervention à domicile',
  ogDescription: 'Technicien indépendant à Paris. Réparation lave-linge, frigo, four, lave-vaisselle. Toutes marques, devis gratuit.',
  ogType: 'website',
  twitterCard: 'summary',
})

const { data: brands } = await useFetch<any[]>('/api/brands')
const { data: services } = await useFetch<any[]>('/api/services')
const { data: reviews } = await useFetch<any[]>('/api/reviews')

const avgRating = computed(() => {
  if (!reviews.value?.length) return 0
  return (reviews.value.reduce((s, r) => s + r.rating, 0) / reviews.value.length).toFixed(1)
})

const faq = [
  {
    q: 'Quels types d\'appareils réparez-vous ?',
    a: 'Nous réparons tous les appareils électroménagers du quotidien : lave-linge, sèche-linge, réfrigérateur, congélateur, lave-vaisselle, four, micro-ondes et hotte aspirante.',
  },
  {
    q: 'Quelles marques prenez-vous en charge ?',
    a: 'Nous intervenons sur la grande majorité des marques du marché : Bosch, Samsung, LG, Whirlpool, Siemens, Electrolux, Miele, Brandt, Beko, Hotpoint, Indesit, et bien d\'autres.',
  },
  {
    q: 'Quel est le délai d\'intervention à Paris ?',
    a: 'Nous intervenons généralement sous 24 à 48h selon les disponibilités. Vous pouvez consulter le calendrier en ligne et choisir la date qui vous convient.',
  },
  {
    q: 'Combien coûte une intervention ?',
    a: 'Le tarif dépend de la panne et de l\'appareil concerné. Nous établissons un diagnostic sur place avant tout devis. Vous n\'êtes facturé qu\'après acceptation du devis.',
  },
  {
    q: 'Intervenez-vous le week-end ?',
    a: 'Oui, nous intervenons du lundi au samedi selon les disponibilités affichées sur notre calendrier en ligne.',
  },
  {
    q: 'Le déplacement est-il facturé ?',
    a: 'Les frais de déplacement sont inclus dans le tarif de l\'intervention pour toute adresse dans Paris intra-muros.',
  },
]

// JSON-LD Schema.org
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'LocalBusiness',
            name: 'ÉlectroMénagerParis',
            description: 'Technicien indépendant spécialisé dans la réparation d\'appareils électroménagers à domicile à Paris.',
            areaServed: { '@type': 'City', name: 'Paris' },
            address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressCountry: 'FR' },
            url: 'https://electromenager-paris.fr',
            openingHoursSpecification: [
              { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
            ],
            ...(reviews.value?.length
              ? {
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: avgRating.value,
                    reviewCount: reviews.value.length,
                    bestRating: 5,
                    worstRating: 1,
                  },
                  review: reviews.value.slice(0, 5).map(r => ({
                    '@type': 'Review',
                    author: { '@type': 'Person', name: r.author_name },
                    reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
                    reviewBody: r.comment,
                  })),
                }
              : {}),
          },
          {
            '@type': 'FAQPage',
            mainEntity: faq.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ],
      }),
    },
  ],
})

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)
</script>

<template>
  <div>
    <!-- ── HERO ───────────────────────────────────────────────────────────── -->
    <section class="relative bg-brand-blue text-white overflow-hidden">
      <div class="absolute inset-0 opacity-10"
        style="background-image: radial-gradient(circle at 70% 50%, #f97316 0%, transparent 60%)" />
      <div class="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
        <div class="max-w-2xl">
          <p class="text-orange-400 font-medium text-sm uppercase tracking-widest mb-4">
            Paris — Intervention à domicile
          </p>
          <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Votre électroménager<br>
            <span class="text-orange-400">réparé chez vous,</span><br>
            rapidement.
          </h1>
          <p class="text-slate-300 text-lg mb-8 leading-relaxed">
            Technicien indépendant à Paris — lave-linge, frigo, four, lave-vaisselle.
            Intervention sous 24–48h, devis sur place, toutes marques.
          </p>
          <div class="flex flex-wrap gap-4">
            <NuxtLink
              to="/reservation"
              class="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Prendre rendez-vous →
            </NuxtLink>
            <a
              href="#prestations"
              class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors text-sm"
            >
              Voir les prestations
            </a>
          </div>

          <!-- Social proof -->
          <div v-if="reviews?.length" class="mt-10 flex items-center gap-3">
            <span class="text-orange-400 text-xl">★★★★★</span>
            <span class="text-slate-300 text-sm">
              <strong class="text-white">{{ avgRating }}/5</strong> · {{ reviews.length }} avis clients
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PRESTATIONS ───────────────────────────────────────────────────── -->
    <section id="prestations" class="py-20 bg-slate-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-900 mb-3">Nos prestations</h2>
          <p class="text-slate-500">Réparation et maintenance de tous vos appareils électroménagers</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="service in services"
            :key="service.id"
            class="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div class="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 text-orange-500 text-2xl">
              ⚙
            </div>
            <h3 class="font-semibold text-slate-900 mb-2">{{ service.name }}</h3>
            <p class="text-slate-500 text-sm leading-relaxed">{{ service.description }}</p>
          </div>

          <div v-if="!services?.length" class="col-span-3 text-center text-slate-400 py-12">
            Prestations en cours de chargement…
          </div>
        </div>

        <div class="mt-10 text-center">
          <NuxtLink
            to="/reservation"
            class="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-900 text-white font-medium rounded-xl transition-colors text-sm"
          >
            Réserver une intervention →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ── MARQUES ────────────────────────────────────────────────────────── -->
    <section id="marques" class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-900 mb-3">Marques prises en charge</h2>
          <p class="text-slate-500">Nous intervenons sur toutes les grandes marques du marché</p>
        </div>

        <div class="flex flex-wrap justify-center gap-6">
          <div
            v-for="brand in brands"
            :key="brand.id"
            class="group relative flex items-center justify-center w-28 h-20 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl transition-all cursor-default"
          >
            <img
              :src="brand.logo_url"
              :alt="brand.name"
              class="h-10 w-auto object-contain grayscale group-hover:grayscale-0 transition-all"
            />
            <!-- Tooltip -->
            <span
              class="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
            >
              {{ brand.name }}
            </span>
          </div>

          <div v-if="!brands?.length" class="w-full text-center text-slate-400 py-8">
            Liste des marques en cours de chargement…
          </div>
        </div>
      </div>
    </section>

    <!-- ── AVIS ──────────────────────────────────────────────────────────── -->
    <section id="avis" class="py-20 bg-slate-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-900 mb-3">Avis clients</h2>
          <p class="text-slate-500">Ce que nos clients disent de nos interventions</p>
          <div v-if="reviews?.length" class="mt-3 flex items-center justify-center gap-2">
            <span class="text-orange-400 text-lg">★★★★★</span>
            <span class="text-slate-600 font-medium">{{ avgRating }}/5</span>
            <span class="text-slate-400 text-sm">· {{ reviews.length }} avis</span>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="bg-white rounded-2xl border border-slate-200 p-6"
          >
            <div class="text-orange-400 text-sm mb-3">{{ stars(review.rating) }}</div>
            <p class="text-slate-700 text-sm leading-relaxed mb-4">"{{ review.comment }}"</p>
            <p class="text-slate-400 text-xs font-medium">— {{ review.author_name }}</p>
          </div>

          <div v-if="!reviews?.length" class="col-span-3 text-center text-slate-400 py-12">
            Soyez le premier à laisser un avis !
          </div>
        </div>

        <div class="mt-10 text-center">
          <NuxtLink
            to="/avis"
            class="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 hover:border-orange-400 text-slate-700 hover:text-orange-600 font-medium rounded-xl transition-colors text-sm"
          >
            Laisser un avis →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ── FAQ ──────────────────────────────────────────────────────────── -->
    <section id="faq" class="py-20 bg-white">
      <div class="max-w-3xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-900 mb-3">Questions fréquentes</h2>
          <p class="text-slate-500">Tout ce que vous devez savoir avant de prendre rendez-vous</p>
        </div>

        <Accordion type="single" collapsible class="space-y-3">
          <AccordionItem
            v-for="(item, i) in faq"
            :key="i"
            :value="`item-${i}`"
            class="border border-slate-200 rounded-xl px-6 overflow-hidden"
          >
            <AccordionTrigger class="text-left font-medium text-slate-900 py-5 hover:no-underline">
              {{ item.q }}
            </AccordionTrigger>
            <AccordionContent class="text-slate-600 text-sm leading-relaxed pb-5">
              {{ item.a }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>

    <!-- ── CTA FINAL ─────────────────────────────────────────────────────── -->
    <section class="py-20 bg-brand-blue text-white">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Votre appareil est en panne ?</h2>
        <p class="text-slate-300 mb-8">Réservez une intervention en ligne en moins de 2 minutes. Déplacement à Paris, sous 24–48h.</p>
        <NuxtLink
          to="/reservation"
          class="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
        >
          Prendre rendez-vous →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
