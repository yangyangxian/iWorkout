<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: false
  }
})
</script>

<template>
  <UCard :ui="{ header: 'p-2 sm:p-3', body: 'p-2 sm:p-3 text-md' }">
    <template #header v-if="title">
      <div>
        <p class="text-lg font-semibold">{{ title }}</p>
      </div>
    </template>
    <slot />
  </UCard>
</template> 