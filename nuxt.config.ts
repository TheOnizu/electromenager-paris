import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/supabase'],

  components: [
    { path: '~/components/ui', pathPrefix: false },
    '~/components',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/css/main.css'],

  supabase: {
    redirect: false,
  },

  runtimeConfig: {
    // Private (server-side only)
    resendApiKey: process.env.RESEND_API_KEY,
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
    jwtSecret: process.env.JWT_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
    // Public (exposed to client)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
      siteUrl: process.env.SITE_URL ?? 'http://localhost:3000',
    },
  },
})
