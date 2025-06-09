<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <UCard class="h-full">
    <template #header>
      <h3 class="text-lg font-semibold">{{ title }}</h3>
    </template>
    <slot />
  </UCard>
</template> 