<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useBookAccess } from '~/composables/useBookAccess'

type FeatureItem = {
  title: string
  description: string
  icon?: string
  image?: string
  bookNumber: number
}

const featureSection = {
  title: 'ចាប់ផ្តើមរៀនភាសាចិន',
  description: 'សូមជ្រើសផ្នែកខាងក្រោមដើម្បីចាប់ផ្តើមហាត់សម្រួលពាក្យ និងការបញ្ចេញសំឡេង។',
  items: [
    {
      title: 'សៀវភៅគំនូសអក្សរចិន ភាគ០១',
      description: 'បញ្ញីពាក្យអក្សរចិនមូលដ្ឋាន - ចំនួន​ ១០០ពាក្យ',
      icon: 'i-lucide-book-open',
      image: '/Book1.svg',
      bookNumber: 1
    },
    {
      title: 'សៀវភៅគំនូសអក្សរចិន ភាគ០២',
      description: 'បញ្ញីពាក្យអក្សរចិនមូលដ្ឋាន - ចំនួន​ ១០០ពាក្យ',
      icon: 'i-lucide-book-open',
      image: '/Book2.svg',
      bookNumber: 2
    },
    {
      title: 'សៀវភៅគំនូសអក្សរចិន ភាគ០៣',
      description: 'បញ្ញីពាក្យអក្សរចិនមូលដ្ឋាន - ចំនួន​ ១០០ពាក្យ',
      icon: 'i-lucide-book-open',
      image: '/Book3.svg',
      bookNumber: 3
    }
  ] satisfies FeatureItem[]
}

const auth = useAuth()
const { canAccessBook } = useBookAccess()

const fallbackCardImages = ['/Book1.svg', '/Book2.svg', '/Book3.svg']

const getCardImage = (item: FeatureItem, index: number) => {
  return item.image || fallbackCardImages[index % fallbackCardImages.length]
}

useChineseLearning()

useSeoMeta({
  title: 'ទំព័រដើម - រៀនភាសាចិន',
  ogTitle: 'ដំណាក់សិក្សា - រៀនភាសាចិនជាមួយន័យខ្មែរ',
  description: 'រៀនវាក្យសព្ទភាសាចិនជាមួយន័យខ្មែរ និងគំនូសអក្សរចិនបានយ៉ាងងាយស្រួល។',
  ogDescription: 'រៀនវាក្យសព្ទភាសាចិនជាមួយន័យខ្មែរ និងគំនូសអក្សរចិនបានយ៉ាងងាយស្រួល។',
  ogImage: '/logo-tab.svg',
  twitterImage: '/logo-tab.svg'
})
</script>

<template>
  <div class="space-y-12 pb-20">
    <UPageSection :title="featureSection.title" :description="featureSection.description"
      :ui="{ title: 'mb-1 lg:mb-3', description: 'mt-0 lg:mt-2' }" class="-mt-10">
      <UPageGrid class="gap-4 lg:gap-6">

        <template v-for="(item, index) in featureSection.items" :key="index">
          <!-- Accessible book: clickable card -->
          <NuxtLink
            v-if="!auth.isAuthenticated.value || canAccessBook(item.bookNumber)"
            :to="`/words/${item.bookNumber}`"
            class="block group"
          >
            <UPageCard
              :title="item.title"
              :description="item.description"
              :icon="item.icon"
              :ui="{
                root: 'relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-linear-to-br from-surface to-elevated/30 border-default hover:border-primary/40',
                body: 'relative z-10',
                header: 'relative z-10'
              }"
              spotlight
              class="cursor-pointer"
            >
              <NuxtImg :src="getCardImage(item, index)" :alt="`${item.title} image`"
                class="pointer-events-none select-none absolute right-5 top-2 w-20 rotate-12 opacity-20 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110 group-hover:opacity-40"
                loading="lazy" />
            </UPageCard>
          </NuxtLink>

          <!-- Locked book: non-clickable card with lock overlay -->
          <div v-else class="block relative opacity-60 cursor-not-allowed select-none" :title="`អ្នកមិនត្រូវបានអនុញ្ញាតឱ្យចូលមើលសៀវភៅនេះ`">
            <UPageCard
              :title="item.title"
              :description="item.description"
              :icon="item.icon"
              :ui="{
                root: 'relative overflow-hidden border-default bg-linear-to-br from-surface to-elevated/30 grayscale',
                body: 'relative z-10',
                header: 'relative z-10'
              }"
            >
              <NuxtImg :src="getCardImage(item, index)" :alt="`${item.title} image`"
                class="pointer-events-none select-none absolute right-5 top-2 w-20 rotate-12 opacity-10"
                loading="lazy" />

              <!-- Lock badge -->
              <div class="absolute inset-0 flex items-center justify-center z-20 rounded-xl">
                <div class="flex flex-col items-center gap-1 bg-surface/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-default shadow">
                  <UIcon name="i-lucide-lock" class="w-6 h-6 text-muted" />
                  <span class="text-[11px] text-muted khmer-text font-medium">គ្មានការអនុញ្ញាត</span>
                </div>
              </div>
            </UPageCard>
          </div>
        </template>

      </UPageGrid>
    </UPageSection>
  </div>
</template>

