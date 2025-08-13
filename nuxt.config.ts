// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devServer: {
    port: 3001,
    host: '0.0.0.0',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: [
    '~/assets/css/main.css'
  ],
  modules: ['@nuxt/ui', 'shadcn-nuxt'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  devtools: { enabled: true },
  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },
  "ui": {
    "fonts": false
  }
});