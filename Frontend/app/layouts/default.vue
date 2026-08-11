<template>
  <div>
    <AppHeader />

    <UMain class="pb-20 md:pb-0">
      <slot />
    </UMain>

    <MobileTabBar />
    
    <ClientOnly>
      <SearchDialog />
    </ClientOnly>
  </div>
</template>
