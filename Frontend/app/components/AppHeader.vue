<template>
  <UHeader
    :toggle="false"
    :ui="{
      root: 'bg-teal-600 dark:bg-teal-700 border-b-0 shadow-none',
      container: 'bg-transparent',
      left: 'min-w-0',
      right: 'gap-1'
    }"
  >
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="h-10! w-auto shrink-0 transition-transform active:scale-95 sm:h-12!" />
      </NuxtLink>
    </template>

    <template #right>
      <UColorModeButton class="text-white hover:bg-white/10" />

      <UButton
        icon="i-simple-icons-telegram"
        color="neutral"
        variant="ghost"
        class="text-white hover:bg-white/10"
        to="https://t.me/damanksiksaa"
        target="_blank"
        aria-label="ទាក់ទងតាម Telegram"
      />
    </template>
  </UHeader>
</template>
