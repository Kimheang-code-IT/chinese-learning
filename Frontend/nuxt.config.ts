export default defineNuxtConfig({
  srcDir: "app",
  ssr: true,
  compatibilityDate: "2026-03-10",
  devtools: { enabled: false },
  devServer: {
    port: 3003
  },
  modules: ["@nuxt/image", "@nuxt/ui", "@vueuse/nuxt", "@pinia/nuxt", "@nuxt/eslint", "@nuxtjs/sitemap"],

  image: {
    // In static mode, images are served directly by Nginx.
    // Using 'none' provider disables the /_ipx/ proxy that causes 404s.
    provider: 'none'
  },

  css: ["~/assets/css/main.css"],

  app: {
    pageTransition: false,
    layoutTransition: false
  },

  site: {
    url: 'https://chinese.domnakseuksa.com',
    name: 'Domnak Seuksa',
  },

  sitemap: {
    hostname: 'https://chinese.domnakseuksa.com',
    gzip: true,
    exclude: ['/admin/**'],
    routes: [
      '/',
      '/learn',
      '/practice',
      '/words/1',
      '/words/2',
      '/words/3'
    ]
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },
});