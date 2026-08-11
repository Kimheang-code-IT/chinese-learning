<script setup lang="ts">
import { useMenu } from '~/composables/useMenu'
const { items } = useMenu()
</script>

<template>
  <nav
    class="khmer-nav fixed  inset-x-0 bottom-0 z-50 border-t border-default bg-default/95 backdrop-blur md:hidden pb-[env(safe-area-inset-bottom)]">
    <!--
      ClientOnly: item.active is computed from route.path which is only known on the client.
      Without this, SSR renders all tabs as inactive, but the client marks one as active,
      causing a hydration mismatch (class attribute differs between server and client).
    -->
    <ClientOnly>
      <ul :class="['grid', items.length === 4 ? 'grid-cols-4' : 'grid-cols-3']">
        <li v-for="item in items" :key="item.to">
          <NuxtLink
:to="item.to" class="flex flex-col items-center gap-1 py-2 text-sm"
            :class="item.active ? 'text-primary' : 'text-muted'">
            <UIcon :name="item.icon" class="text-lg" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>

      <!-- SSR fallback: render tabs without active state to avoid mismatch -->
      <template #fallback>
        <ul :class="['grid', items.length === 4 ? 'grid-cols-4' : 'grid-cols-3']">
          <li v-for="item in items" :key="item.to">
            <div class="flex flex-col items-center gap-1 py-2 text-sm text-muted">
              <UIcon :name="item.icon" class="text-lg" />
              <span>{{ item.label }}</span>
            </div>
          </li>
        </ul>
      </template>
    </ClientOnly>
  </nav>
</template>
