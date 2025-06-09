// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 3001,
    host: '0.0.0.0',
  },
  css: [
    '~/assets/css/main.css'
  ],
  modules: ['@nuxt/ui', '@nuxt/fonts', '@nuxt/icon'],
  devtools: { enabled: true },
  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },
});
