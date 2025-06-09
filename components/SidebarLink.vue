<script setup lang="ts">
const props = defineProps<{
  to: string
  icon: string
}>()

const route = useRoute()
const isActive = computed(() => route.path === props.to)
</script>

<template>
  <NuxtLink
    :to="props.to"
    class="flex items-center gap-3 px-3 py-2 rounded-md transition-colors"
    :class="[
      isActive ? 'bg-gray-200 dark:bg-gray-800 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
    ]"
  >
    <UIcon :name="props.icon" class="w-5 h-5" />
    <span><slot /></span>
  </NuxtLink>
</template>
