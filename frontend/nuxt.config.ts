import Aura from "@primevue/themes/aura";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    "@nuxt/fonts",
    "@primevue/nuxt-module",
    "@vueuse/nuxt",
    "@nuxtjs/supabase",
  ],
  fonts: {
    experimental: {
      processCSSVariables: true,
    },
  },
  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          prefix: "p",
          darkModeSelector: ".dark-mode",
          cssLayer: {
            name: "primevue",
            order: "tailwind-base, primevue, tailwind-utilities",
          },
        },
      },
    },
  },
  supabase: {
    redirect: false,
  },
  routeRules: {},
});
