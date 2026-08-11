<template>
  <div class="bg-white rounded">
    <div class="overflow-x-auto -mt-4">
      <table class="min-w-full border border-gray-200 rounded">
        <tbody>
          <tr>
            <td class="font-bold px-3 py-2 border-b border-gray-100 bg-gray-50">ឈ្មោះ:</td>
            <td class="px-3 py-2 border-b border-gray-100">
              <kbd class="px-2 py-0.5 rounded bg-gray-100 border text-base font-mono">{{ name || '-' }}</kbd>
            </td>
          </tr>
          <tr>
            <td class="font-bold px-3 py-2 border-b border-gray-100 bg-gray-50">លេខទូរស័ព្ទ:</td>
            <td class="px-3 py-2 border-b border-gray-100">
              <kbd class="px-2 py-0.5 rounded bg-gray-100 border text-base font-mono">{{ phone || '-' }}</kbd>
            </td>
          </tr>
          <tr>
            <td class="font-bold px-3 py-2 bg-gray-50">ពាក្យសម្ងាត់:</td>
            <td class="px-3 py-2">
              <kbd class="px-2 py-0.5 rounded bg-gray-100 border text-base font-mono">{{ password || '-' }}</kbd>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name?: string
  phone?: string
  password?: string
}>()
</script>

<style scoped>
.bg-white {
  background: #fff;
}
</style>
