export default defineNuxtConfig({
  srcDir: "app",
  ssr: true,
  compatibilityDate: "2026-03-10",
  devtools: { enabled: false },
  devServer: {
    port: 3000
  },
  modules: ["@nuxt/image", "@nuxt/ui", "@vueuse/nuxt", "@nuxt/eslint", "@nuxtjs/sitemap"],

  image: {
    provider: 'none'
  },

  css: ["~/assets/css/main.css"],

  app: {
    pageTransition: false,
    layoutTransition: false,
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' }
      ]
    }
  },

  nitro: {
    preset: 'vercel'
  },

  site: {
    name: 'រៀនកុំព្យូទ័រ',
  },

  sitemap: {
    gzip: true,
    routes: [
      '/',
      '/words/1',
      '/words/2',
      '/words/3'
    ]
  },

  runtimeConfig: {
    public: {}
  },
});
