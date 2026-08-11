<script setup lang="ts">
interface UserToDelete {
  id: string | number
  name: string
}

const props = defineProps<{
  user: UserToDelete | null
  isOpen: boolean
}>()

const emits = defineEmits<{
  delete: [id: string | number]
  close: []
}>()

function onDelete() {
  if (props.user) {
    emits('delete', props.user.id)
  }
}
</script>

<template>
  <ConfirmDialog
    :model-value="isOpen"
    title="លុបទិន្នន័យ"
    confirm-label="លុប"
    confirm-color="error"
    confirm-icon="i-lucide-trash"
    @update:model-value="val => !val && emits('close')"
    @confirm="onDelete"
    @cancel="emits('close')"
  >
    <p class="text-sm text-toned mb-6 -mt-8">
      {{ user?.name ? `ទិន្នន័យ: ${user.name}` : '' }}
    </p>
  </ConfirmDialog>
</template>
