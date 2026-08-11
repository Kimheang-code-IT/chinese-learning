const wordRoutes = [1, 2, 3].flatMap((book) =>
  Array.from({ length: 100 }, (_, i) => `/words/${book}/${i + 1}`)
)

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

  routeRules: {
    '/': { prerender: true },
    '/words/**': { prerender: true }
  },

  nitro: {
    // Static CDN output — avoids Vercel serverless "vue not found" crashes
    preset: 'vercel-static',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/words/1', '/words/2', '/words/3', ...wordRoutes],
      failOnError: false
    }
  },

  site: {
    name: 'រៀនកុំព្យូទ័រ',
    url: 'https://chinese-learning-jet.vercel.app'
  },

  sitemap: {
    gzip: true,
    routes: [
      '/',
      '/words/1',
      '/words/2',
      '/words/3',
      ...wordRoutes
    ]
  },

  runtimeConfig: {
    public: {}
  },
});
