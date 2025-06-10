<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <UCard :ui="{ header: 'p-2 sm:p-3', body: 'p-2 sm:p-3' }">
    <template #header>
      <div>
        <p class="text-md font-semibold">{{ title }}</p>
      </div>
    </template>
    <slot />
  </UCard>
</template> 