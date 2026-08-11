<script setup lang="ts">
useSeoMeta({
  title: 'ភីងអ៊ីន',
  description: 'រៀនភីងអ៊ីនភាសាចិន (Pinyin) ជាភាសាខ្មែរ'
})

const embedSrc = 'https://www.digmandarin.com/tools/pinyin.html?show_embed_button=true'
</script>

<template>
  <UPageSection
    title="តារាងភីងអ៊ីន"
    description="ចុចលើក្រឡាចំណុចណាមួយដើម្បីស្តាប់សំឡេងភីងអ៊ីន។"
    :ui="{ title: 'mb-1 lg:mb-3', description: 'mt-0 lg:mt-1' }"
    class="-mt-14"
  >
    <div class="pinyin-embed">
      <iframe
        :src="embedSrc"
        title="DigMandarin Pinyin Chart"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allow="autoplay"
      />
    </div>
  </UPageSection>
</template>

<style scoped>
.pinyin-embed {
  position: relative;
  width: 100%;
  max-width: 1126px;
  margin-inline: auto;
  overflow: hidden;
  border-radius: 0.75rem;
  background: var(--ui-bg-elevated, #f8fafc);
  /* Desktop: keep DigMandarin chart aspect ratio (1126 × 478) */
  aspect-ratio: 1126 / 478;
  min-height: 280px;
}

.pinyin-embed iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* Mobile / tablet: taller viewport so the chart stays usable */
@media (max-width: 1023px) {
  .pinyin-embed {
    aspect-ratio: auto;
    height: min(70vh, 560px);
    min-height: 360px;
  }
}

@media (max-width: 639px) {
  .pinyin-embed {
    height: min(75vh, 520px);
    min-height: 320px;
    border-radius: 0.5rem;
  }
}
</style>
