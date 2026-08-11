<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode, useHead, useSeoMeta } from '#imports'

const BRAND = 'រៀនកុំព្យូទ័រ'
const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? '#0f172a' : '#fff7ed')

useHead({
  title: `${BRAND} - រៀនភាសាចិន`,
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${BRAND}` : `${BRAND} - រៀនភាសាចិន`
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: () => color.value }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/logo.png' }
  ],
  htmlAttrs: {
    lang: 'km'
  },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: BRAND,
        description: 'រៀនភាសាចិនជាមួយន័យខ្មែរ'
      })
    }
  ]
})

useSeoMeta({
  ogTitle: `${BRAND} - រៀនភាសាចិន`,
  description: 'រៀនវាក្យសព្ទភាសាចិនជាមួយន័យខ្មែរ។',
  ogDescription: 'រៀនវាក្យសព្ទភាសាចិនជាមួយន័យខ្មែរ។',
  twitterCard: 'summary_large_image',
  ogSiteName: BRAND,
  ogLocale: 'km_KH',
  ogType: 'website',
  ogImage: '/logo.png',
  robots: 'index, follow'
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#0d9488" />
    <NuxtLayout>
      <NuxtPage :page-key="route => route.fullPath" />
    </NuxtLayout>
  </UApp>
</template>
