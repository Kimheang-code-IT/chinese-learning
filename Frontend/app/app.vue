<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode, useHead, useSeoMeta } from '#imports'
const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? '#3d3b3a' : 'white')

useHead({
  title: 'រៀនភាសាចិនជាមួយដំណាក់សិក្សា',
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - រៀនភាសាចិនជាមួយដំណាក់សិក្សា` : 'រៀនភាសាចិនជាមួយដំណាក់សិក្សា';
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: () => color.value }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/logo.png' },
    { rel: 'canonical', href: 'https://chinese.domnakseuksa.com' }
  ],
  htmlAttrs: {
    lang: 'km'
  },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "ដំណាក់សិក្សា",
        "url": "https://chinese.domnakseuksa.com",
        "description": "រៀនភាសាចិនជាមួយគំនូសអក្សរចិន ការអាន និងការសរសេរ"
      })
    }
  ]
})

useSeoMeta({
  ogTitle: 'រៀនភាសាចិនជាមួយដំណាក់សិក្សា',
  description: 'រៀនវាក្យសព្ទភាសាចិនជាមួយន័យខ្មែរ គំនូសអក្សរចិន និងភីងអ៊ីន។',
  ogDescription: 'រៀនវាក្យសព្ទភាសាចិនជាមួយន័យខ្មែរ គំនូសអក្សរចិន និងភីងអ៊ីន។',
  twitterCard: 'summary_large_image',
  ogSiteName: 'ដំណាក់សិក្សា',
  ogLocale: 'km_KH',
  ogType: 'website',
  ogImage: '/logo.png',
  robots: 'index, follow'
})
// Auth state is now handled globally by the plugins/auth.ts and stores/auth.ts
// No need for manual onMounted auth checks here
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
