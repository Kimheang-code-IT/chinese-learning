<script setup lang="ts">
// Unknown routes → home (does not match /words/:book or /words/:book/:word)
await navigateTo('/', { replace: true })
</script>

<template>
  <div />
</template>
